import { put } from "@vercel/blob";
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const formData = await request.formData();
    const avatar = formData.get("avatar") as File | null;
    const memberId = formData.get("memberId") as string | null;

    if (!memberId) {
      return NextResponse.json(
        { error: "Member ID is required" },
        { status: 400 }
      );
    }

    if (!avatar) {
      return NextResponse.json(
        { error: "Avatar file is required" },
        { status: 400 }
      );
    }

    // Validate file size (4MB limit)
    if (avatar.size > 4 * 1024 * 1024) {
      return NextResponse.json(
        { error: "Avatar file size must be less than 4MB" },
        { status: 400 }
      );
    }

    // Upload to Vercel Blob
    const blob = await put(avatar.name, avatar, {
      access: "public",
    });

    // Update team member in database
    const updatedMember = await prisma.teamMember.update({
      where: {
        id: parseInt(memberId),
      },
      data: {
        image: blob.url,
      },
    });

    await prisma.$disconnect();

    return NextResponse.json({
      success: true,
      data: updatedMember,
    });
  } catch (error) {
    await prisma.$disconnect();
    console.error("Avatar update error:", error);
    return NextResponse.json(
      { error: "Failed to update avatar" },
      { status: 500 }
    );
  }
}
