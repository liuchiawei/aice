import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { put } from "@vercel/blob";

const prisma = new PrismaClient();

// GET single team member
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const teamMember = await prisma.teamMember.findUnique({
      where: {
        id: parseInt(params.id),
      },
    });

    if (!teamMember) {
      return NextResponse.json(
        { error: "Team member not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: teamMember });
  } catch (error) {
    console.error("Get team member error:", error);
    return NextResponse.json(
      { error: "Failed to fetch team member" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// PATCH update team member
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const formData = await request.formData();

    const firstName = formData.get("firstName") as string;
    const lastName = formData.get("lastName") as string;
    const furigana = formData.get("furigana") as string;
    const nickname = formData.get("nickname") as string;
    const role = formData.get("role") as string;
    const partTimeJob = formData.get("partTimeJob") as string;
    const description = formData.get("description") as string;
    const age = formData.get("age") as string;
    const joinReason = formData.get("joinReason") as string;
    const goal = formData.get("goal") as string;
    const message = formData.get("message") as string;
    const avatarFile = formData.get("avatar") as File | null;

    // Validate required fields
    if (
      !firstName ||
      !lastName ||
      !furigana ||
      !nickname ||
      !role ||
      !description ||
      !age ||
      !joinReason ||
      !goal ||
      !message
    ) {
      return NextResponse.json(
        { error: "All fields except part-time job and avatar are required" },
        { status: 400 }
      );
    }

    // Check if team member exists
    const existingMember = await prisma.teamMember.findUnique({
      where: {
        id: parseInt(params.id),
      },
    });

    if (!existingMember) {
      return NextResponse.json(
        { error: "Team member not found" },
        { status: 404 }
      );
    }

    // Validate avatar file size (4MB limit)
    if (avatarFile && avatarFile.size > 4 * 1024 * 1024) {
      return NextResponse.json(
        { error: "Avatar file size must be less than 4MB" },
        { status: 400 }
      );
    }

    let imageUrl = existingMember.image;

    // Upload new avatar if provided
    if (avatarFile) {
      const blob = await put(avatarFile.name, avatarFile, {
        access: "public",
      });
      imageUrl = blob.url;
    }

    // Update team member
    const teamMember = await prisma.teamMember.update({
      where: {
        id: parseInt(params.id),
      },
      data: {
        firstName,
        lastName,
        furigana,
        nickname,
        image: imageUrl,
        role,
        partTimeJob: partTimeJob || "",
        description,
        age: parseInt(age),
        joinReason,
        goal,
        message,
      },
    });

    return NextResponse.json({ success: true, data: teamMember });
  } catch (error) {
    console.error("Update team member error:", error);
    return NextResponse.json(
      { error: "Failed to update team member" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// DELETE team member
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check if team member exists
    const existingMember = await prisma.teamMember.findUnique({
      where: {
        id: parseInt(params.id),
      },
    });

    if (!existingMember) {
      return NextResponse.json(
        { error: "Team member not found" },
        { status: 404 }
      );
    }

    // Delete team member
    await prisma.teamMember.delete({
      where: {
        id: parseInt(params.id),
      },
    });

    return NextResponse.json({
      success: true,
      message: "Team member deleted successfully",
    });
  } catch (error) {
    console.error("Delete team member error:", error);
    return NextResponse.json(
      { error: "Failed to delete team member" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
