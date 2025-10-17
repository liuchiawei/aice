"use client";

import { useState, useRef, useEffect } from "react";
import { TeamMember } from "@prisma/client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader, Upload } from "lucide-react";

interface EditMemberDialogProps {
  member: TeamMember;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export default function EditMemberDialog({
  member,
  open,
  onOpenChange,
  onSuccess,
}: EditMemberDialogProps) {
  const inputFileRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    firstName: member.firstName,
    lastName: member.lastName,
    furigana: member.furigana,
    nickname: member.nickname,
    role: member.role,
    partTimeJob: member.partTimeJob,
    description: member.description,
    age: member.age.toString(),
    joinReason: member.joinReason,
    goal: member.goal,
    message: member.message,
  });

  // Reset form when member changes
  useEffect(() => {
    setFormData({
      firstName: member.firstName,
      lastName: member.lastName,
      furigana: member.furigana,
      nickname: member.nickname,
      role: member.role,
      partTimeJob: member.partTimeJob,
      description: member.description,
      age: member.age.toString(),
      joinReason: member.joinReason,
      goal: member.goal,
      message: member.message,
    });
    setPreviewUrl(null);
    setError("");
  }, [member]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (4MB limit)
    if (file.size > 4 * 1024 * 1024) {
      setError("Avatar file size must be less than 4MB");
      if (inputFileRef.current) {
        inputFileRef.current.value = "";
      }
      return;
    }

    setError("");

    // Create preview URL
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  };

  const handleAvatarClick = () => {
    inputFileRef.current?.click();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const formDataToSend = new FormData();

      // Append all text fields
      Object.entries(formData).forEach(([key, value]) => {
        formDataToSend.append(key, value);
      });

      // Append avatar file if selected
      if (inputFileRef.current?.files?.[0]) {
        formDataToSend.append("avatar", inputFileRef.current.files[0]);
      }

      const response = await fetch(`/api/team-member/${member.id}`, {
        method: "PATCH",
        body: formDataToSend,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Update failed");
      }

      // Success
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Team Member</DialogTitle>
          <DialogDescription>
            Update the information for {member.firstName} {member.lastName}
          </DialogDescription>
        </DialogHeader>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-600 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Avatar Upload */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Avatar Photo (Optional, max 4MB)
            </label>

            <div className="flex items-center gap-4">
              <Avatar
                className="size-20 cursor-pointer hover:opacity-80 transition-opacity border-2 border-gray-200"
                onClick={handleAvatarClick}
              >
                <AvatarImage
                  src={previewUrl || member.image}
                  alt="Avatar preview"
                />
                <AvatarFallback>
                  <Upload className="size-8 text-gray-400" />
                </AvatarFallback>
              </Avatar>

              <div className="flex-1">
                <Input
                  id="avatar"
                  name="avatar"
                  type="file"
                  ref={inputFileRef}
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleAvatarClick}
                  className="w-full sm:w-auto"
                >
                  {previewUrl ? "Change Avatar" : "Upload New Avatar"}
                </Button>
                {previewUrl && (
                  <p className="text-sm text-green-600 mt-2">
                    New avatar selected
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="firstName"
                className="text-sm font-medium text-gray-700 block mb-1"
              >
                First Name *
              </label>
              <Input
                id="firstName"
                name="firstName"
                type="text"
                required
                value={formData.firstName}
                onChange={handleChange}
              />
            </div>

            <div>
              <label
                htmlFor="lastName"
                className="text-sm font-medium text-gray-700 block mb-1"
              >
                Last Name *
              </label>
              <Input
                id="lastName"
                name="lastName"
                type="text"
                required
                value={formData.lastName}
                onChange={handleChange}
              />
            </div>

            <div>
              <label
                htmlFor="furigana"
                className="text-sm font-medium text-gray-700 block mb-1"
              >
                Furigana *
              </label>
              <Input
                id="furigana"
                name="furigana"
                type="text"
                required
                value={formData.furigana}
                onChange={handleChange}
              />
            </div>

            <div>
              <label
                htmlFor="nickname"
                className="text-sm font-medium text-gray-700 block mb-1"
              >
                Nickname *
              </label>
              <Input
                id="nickname"
                name="nickname"
                type="text"
                required
                value={formData.nickname}
                onChange={handleChange}
              />
            </div>

            <div>
              <label
                htmlFor="role"
                className="text-sm font-medium text-gray-700 block mb-1"
              >
                Role *
              </label>
              <Input
                id="role"
                name="role"
                type="text"
                required
                value={formData.role}
                onChange={handleChange}
              />
            </div>

            <div>
              <label
                htmlFor="age"
                className="text-sm font-medium text-gray-700 block mb-1"
              >
                Age *
              </label>
              <Input
                id="age"
                name="age"
                type="number"
                required
                min="18"
                max="100"
                value={formData.age}
                onChange={handleChange}
              />
            </div>

            <div className="col-span-2">
              <label
                htmlFor="partTimeJob"
                className="text-sm font-medium text-gray-700 block mb-1"
              >
                Part-time Job (Optional)
              </label>
              <Input
                id="partTimeJob"
                name="partTimeJob"
                type="text"
                value={formData.partTimeJob}
                onChange={handleChange}
              />
            </div>

            <div className="col-span-2">
              <label
                htmlFor="description"
                className="text-sm font-medium text-gray-700 block mb-1"
              >
                Description *
              </label>
              <textarea
                id="description"
                name="description"
                required
                rows={3}
                value={formData.description}
                onChange={handleChange}
                className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
              />
            </div>

            <div className="col-span-2">
              <label
                htmlFor="joinReason"
                className="text-sm font-medium text-gray-700 block mb-1"
              >
                Join Reason *
              </label>
              <textarea
                id="joinReason"
                name="joinReason"
                required
                rows={2}
                value={formData.joinReason}
                onChange={handleChange}
                className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
              />
            </div>

            <div className="col-span-2">
              <label
                htmlFor="goal"
                className="text-sm font-medium text-gray-700 block mb-1"
              >
                Goal *
              </label>
              <textarea
                id="goal"
                name="goal"
                required
                rows={2}
                value={formData.goal}
                onChange={handleChange}
                className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
              />
            </div>

            <div className="col-span-2">
              <label
                htmlFor="message"
                className="text-sm font-medium text-gray-700 block mb-1"
              >
                Message *
              </label>
              <textarea
                id="message"
                name="message"
                required
                rows={3}
                value={formData.message}
                onChange={handleChange}
                className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader className="size-4 animate-spin mr-2" />
                  Updating...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
