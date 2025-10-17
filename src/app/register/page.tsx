"use client";

import type { PutBlobResult } from "@vercel/blob";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const inputFileRef = useRef<HTMLInputElement>(null);
  const [blob, setBlob] = useState<PutBlobResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    furigana: "",
    nickname: "",
    role: "",
    partTimeJob: "",
    description: "",
    age: "",
    joinReason: "",
    goal: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
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

      const response = await fetch("/api/register", {
        method: "POST",
        body: formDataToSend,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Registration failed");
      }

      // Set blob result
      if (data.data.image) {
        setBlob({ url: data.data.image } as PutBlobResult);
      }

      // Success - redirect to top page
      router.push("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Register New Team Member
        </h1>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md text-red-600">
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-2 gap-2 md:gap-4 data-grid:flex data-grid:flex-col data-grid:gap-1"
        >
          <div data-grid>
            <label
              htmlFor="firstName"
              className="text-sm font-medium text-gray-700"
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
              placeholder="e.g., John"
            />
          </div>

          <div data-grid>
            <label
              htmlFor="lastName"
              className="text-sm font-medium text-gray-700"
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
              placeholder="e.g., Doe"
            />
          </div>
          <div data-grid>
            <label
              htmlFor="furigana"
              className="text-sm font-medium text-gray-700"
            >
              Furigana (Japanese) *
            </label>
            <Input
              id="furigana"
              name="furigana"
              type="text"
              required
              value={formData.furigana}
              onChange={handleChange}
              placeholder="e.g., ジョン・ドー"
            />
          </div>

          <div data-grid>
            <label
              htmlFor="nickname"
              className="text-sm font-medium text-gray-700"
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
              placeholder="e.g., Johnny"
            />
          </div>

          <div data-grid className="col-span-2">
            <label
              htmlFor="avatar"
              className="text-sm font-medium text-gray-700"
            >
              Avatar Photo (Optional, max 4MB)
            </label>
            <Input
              id="avatar"
              name="avatar"
              type="file"
              ref={inputFileRef}
              accept="image/*"
              onChange={handleFileChange}
              className="cursor-pointer"
            />
            {blob && (
              <div>
                <p className="text-sm text-green-600">
                  Avatar uploaded successfully!
                </p>
              </div>
            )}
          </div>

          <div data-grid>
            <label
              htmlFor="role"
              className="text-sm font-medium text-gray-700"
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
              placeholder="e.g., CEO, CTO"
            />
          </div>

          <div data-grid>
            <label
              htmlFor="age"
              className="text-sm font-medium text-gray-700"
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
              placeholder="e.g., 30"
            />
          </div>

          <div data-grid className="col-span-2">
            <label
              htmlFor="partTimeJob"
              className="text-sm font-medium text-gray-700"
            >
              Part-time Job (Optional)
            </label>
            <Input
              id="partTimeJob"
              name="partTimeJob"
              type="text"
              value={formData.partTimeJob}
              onChange={handleChange}
              placeholder="e.g., Software Engineer"
            />
          </div>

          <div data-grid className="col-span-2">
            <label
              htmlFor="description"
              className="text-sm font-medium text-gray-700"
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
              placeholder="Brief description about yourself"
              className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
            />
          </div>

          <div data-grid className="col-span-2">
            <label
              htmlFor="joinReason"
              className="text-sm font-medium text-gray-700"
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
              placeholder="Why do you want to join?"
              className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
            />
          </div>

          <div data-grid className="col-span-2">
            <label
              htmlFor="goal"
              className="text-sm font-medium text-gray-700"
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
              placeholder="What is your goal?"
              className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
            />
          </div>

          <div data-grid className="col-span-2">
            <label
              htmlFor="message"
              className="block text-sm font-medium text-gray-700 mb-1"
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
              placeholder="Message to the team"
              className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
            />
          </div>

          <div className="col-span-2 flex gap-4 pt-4">
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? (
                <>
                  <Loader className="size-4 animate-spin" />
                  Registering...
                </>
              ) : (
                "Register"
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/")}
              disabled={loading}
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
