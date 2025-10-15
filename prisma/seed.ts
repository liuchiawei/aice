import { PrismaClient } from '@prisma/client';
import teamMembersData from '../src/data/team-members.json';

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding...');

  // Clear existing data
  await prisma.teamMember.deleteMany();
  console.log('Cleared existing team members');

  // Transform and insert team members
  for (const member of teamMembersData) {
    const teamMember = await prisma.teamMember.create({
      data: {
        firstName: member.name.first,
        lastName: member.name.last,
        furigana: member.name.furikana,
        nickname: member.name.nickname,
        image: member.image.full,
        role: member.role,
        partTimeJob: member['part-time-job'] || '',
        description: member.description,
        age: member.age,
        joinReason: member['join-reason'],
        goal: member.goal,
        message: member.message,
      },
    });

    console.log(`Created team member: ${teamMember.firstName} ${teamMember.lastName}`);
  }

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
