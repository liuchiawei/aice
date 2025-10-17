"use client";

import { useState, useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Pencil, Loader } from "lucide-react";
import { useRouter } from "next/navigation";

interface EditableAvatarProps {
  memberId: number;
  currentImage: string;
  fallback: string;
}

export default function EditableAvatar({
  memberId,
  currentImage,
  fallback,
}: EditableAvatarProps) {
  const router = useRouter();
  const inputFileRef = useRef<HTMLInputElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (4MB limit)
    if (file.size > 4 * 1024 * 1024) {
      setError("Avatar file size must be less than 4MB");
      if (inputFileRef.current) {
        inputFileRef.current.value = "";
      }
      setTimeout(() => setError(""), 3000);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("avatar", file);
      formData.append("memberId", memberId.toString());

      const response = await fetch("/api/avatar/update", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update avatar");
      }

      // Refresh the page to show updated avatar
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update avatar");
      setTimeout(() => setError(""), 3000);
    } finally {
      setLoading(false);
      if (inputFileRef.current) {
        inputFileRef.current.value = "";
      }
    }
  };

  const handleEditClick = () => {
    inputFileRef.current?.click();
  };

  return (
    <div className="relative inline-block">
      <div
        className="relative"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Avatar className="size-32 transition-opacity duration-200">
          <AvatarImage
            src={currentImage}
            alt={fallback}
            className="object-cover rounded-lg shadow-lg"
          />
          <AvatarFallback>{fallback}</AvatarFallback>
        </Avatar>

        {/* Overlay with edit button */}
        <div
          className={`absolute inset-0 bg-black/[0.3] rounded-full flex items-center justify-center transition-opacity duration-200 ${
            isHovered && !loading ? "opacity-100" : "opacity-0"
          }`}
        >
          <Button
            type="button"
            variant="secondary"
            size="icon"
            onClick={handleEditClick}
            disabled={loading}
            className="absolute bottom-0 right-0 rounded-full cursor-pointer"
          >
            <Pencil className="size-4" />
          </Button>
        </div>

        {/* Loading overlay */}
        {loading && (
          <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
            <Loader className="size-6 animate-spin text-white" />
          </div>
        )}
      </div>

      {/* Hidden file input */}
      <input
        title="Upload avatar"
        ref={inputFileRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Error message */}
      {error && (
        <p className="text-sm text-red-600 mt-2 absolute top-full left-0 whitespace-nowrap">
          {error}
        </p>
      )}
    </div>
  );
}
