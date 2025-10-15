import { NextRequest, NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    const firstName = formData.get('firstName') as string;
    const lastName = formData.get('lastName') as string;
    const furigana = formData.get('furigana') as string;
    const nickname = formData.get('nickname') as string;
    const role = formData.get('role') as string;
    const partTimeJob = formData.get('partTimeJob') as string;
    const description = formData.get('description') as string;
    const age = formData.get('age') as string;
    const joinReason = formData.get('joinReason') as string;
    const goal = formData.get('goal') as string;
    const message = formData.get('message') as string;
    const avatarFile = formData.get('avatar') as File | null;

    // Validate required fields
    if (!firstName || !lastName || !furigana || !nickname || !role || !description || !age || !joinReason || !goal || !message) {
      return NextResponse.json(
        { error: 'All fields except part-time job and avatar are required' },
        { status: 400 }
      );
    }

    // Validate avatar file size (4MB limit)
    if (avatarFile && avatarFile.size > 4 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'Avatar file size must be less than 4MB' },
        { status: 400 }
      );
    }

    let imageUrl = '';

    // Upload avatar if provided
    if (avatarFile) {
      const blob = await put(avatarFile.name, avatarFile, {
        access: 'public',
      });
      imageUrl = blob.url;
    }

    // Create new team member
    const teamMember = await prisma.teamMember.create({
      data: {
        firstName,
        lastName,
        furigana,
        nickname,
        image: imageUrl,
        role,
        partTimeJob: partTimeJob || '',
        description,
        age: parseInt(age),
        joinReason,
        goal,
        message,
      },
    });

    return NextResponse.json(
      { success: true, data: teamMember },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Failed to register team member' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
