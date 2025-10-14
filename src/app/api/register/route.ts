import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@/generated/prisma';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { firstName, lastName, furigana, nickname, image, role, partTimeJob, description, age, joinReason, goal, message } = body;

    // Validate required fields
    if (!firstName || !lastName || !furigana || !nickname || !image || !role || !description || !age || !joinReason || !goal || !message) {
      return NextResponse.json(
        { error: 'All fields except part-time job are required' },
        { status: 400 }
      );
    }

    // Create new team member
    const teamMember = await prisma.teamMember.create({
      data: {
        firstName,
        lastName,
        furigana,
        nickname,
        image,
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
