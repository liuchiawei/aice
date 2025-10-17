import { PrismaClient } from "@prisma/client";
import TeamMembersTable from "./components/TeamMembersTable";

export default async function DashboardPage() {
  const prisma = new PrismaClient();
  const teamMembers = await prisma.teamMember.findMany({
    orderBy: {
      id: "asc",
    },
  });
  await prisma.$disconnect();

  return (
    <main className="max-w-7xl mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Team Dashboard
        </h1>
        <p className="text-gray-600">
          Manage your team members - view, edit, and delete member information.
        </p>
      </div>

      <TeamMembersTable initialMembers={teamMembers} />
    </main>
  );
}