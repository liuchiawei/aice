import { PrismaClient } from "@/generated/prisma";
import Hero from "./components/hero";

const prisma = new PrismaClient();

export default async function Team() {
  const teamMembers = await prisma.teamMember.findMany({
    orderBy: {
      id: 'asc'
    }
  });

  await prisma.$disconnect();

  return (
    <div>
      <Hero teamMembers={teamMembers} />
    </div>
  );
}