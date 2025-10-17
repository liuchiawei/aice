import { PrismaClient } from "@prisma/client";
import { notFound } from "next/navigation";
import BackToHome from "@/components/common/BackToHome";
import EditableAvatar from "@/components/common/EditableAvatar";
// import Image from "next/image";

const prisma = new PrismaClient();

export default async function TeamPage({ params }: { params: { id: string } }) {
  const teamMember = await prisma.teamMember.findUnique({
    where: {
      id: parseInt(params.id),
    },
  });

  await prisma.$disconnect();

  if (!teamMember) {
    notFound();
  }

  return (
    <main className="max-w-5xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-2 gap-4">
      <section>
        <p className="w-full text-lg text-gray-600">{teamMember.furigana}</p>
        <h1 className="text-4xl md:text-6xl font-bold mb-2">
          {teamMember.firstName} {teamMember.lastName}
        </h1>
        <h2 className="text-2xl font-bold">{teamMember.role}</h2>
        {teamMember.partTimeJob && (
          <p className="w-full text-md text-gray-500">
            {teamMember.partTimeJob}
          </p>
        )}
      </section>
      {/* Team member image */}
      <section className="flex justify-center items-center">
        <EditableAvatar
          memberId={teamMember.id}
          currentImage={teamMember.image}
          fallback={teamMember.furigana.charAt(0)}
        />
      </section>
      <section className="space-y-4">
        <div>
          <h3 className="font-semibold text-lg">About</h3>
          <p>{teamMember.description}</p>
        </div>
        <div>
          <h3 className="font-semibold text-lg">Why I Joined</h3>
          <p>{teamMember.joinReason}</p>
        </div>
        <div>
          <h3 className="font-semibold text-lg">My Goal</h3>
          <p>{teamMember.goal}</p>
        </div>
        <div>
          <h3 className="font-semibold text-lg">Message</h3>
          <p>{teamMember.message}</p>
        </div>
      </section>
      <BackToHome />
    </main>
  );
}
