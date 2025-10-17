import { PrismaClient } from "@prisma/client";
import { notFound } from "next/navigation";
import BackToHome from "@/components/common/BackToHome";
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
        <h1 className="text-4xl font-bold">
          {teamMember.firstName} {teamMember.lastName}
        </h1>
        <p className="text-lg text-gray-600 mb-2">{teamMember.furigana}</p>
        <h2 className="text-2xl font-bold">{teamMember.role}</h2>
        {teamMember.partTimeJob && (
          <p className="text-md text-gray-500">{teamMember.partTimeJob}</p>
        )}
      </section>
      <section className="col-start-1 row-start-4 md:row-start-2 space-y-4">
        <div>
          <h3 className="font-semibold text-lg mb-1">About</h3>
          <p>{teamMember.description}</p>
        </div>
        <div>
          <h3 className="font-semibold text-lg mb-1">Why I Joined</h3>
          <p>{teamMember.joinReason}</p>
        </div>
        <div>
          <h3 className="font-semibold text-lg mb-1">My Goal</h3>
          <p>{teamMember.goal}</p>
        </div>
        <div>
          <h3 className="font-semibold text-lg mb-1">Message</h3>
          <p>{teamMember.message}</p>
        </div>
      </section>
      {/* Team member image */}
      <section className="w-full h-full row-span-2">
        <img
          src={teamMember.image}
          alt={teamMember.furigana}
          className="w-full h-full object-cover rounded-lg shadow-lg"
        />
      </section>
      <BackToHome />
      {/* Product Image */}
      {/* <Image src={teamMember.image} alt={teamMember.firstName} width={500} height={500} /> */}
    </main>
  );
}
