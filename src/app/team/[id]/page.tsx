import TeamMembers from "@/data/team-members.json";
import { notFound } from "next/navigation";
// import Image from "next/image";
export default function TeamPage({ params }: { params: { id: string } }) {
  const teamMember = TeamMembers.find(
    (member) => member.id === parseInt(params.id)
  );
  if (!teamMember) {
    notFound();
  }
  return (
    <section className="max-w-5xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <h1 className="text-4xl font-bold">{teamMember.name.first} {teamMember.name.last}</h1>
        <h2 className="text-2xl font-bold">{teamMember.role}</h2>
      </div>
      <p className="col-start-1 row-start-4 md:row-start-2">
        {teamMember.description}
      </p>
      {/* demo image */}
      <div className="w-full h-full row-span-2">
        <img
          src={teamMember.image.full}
          alt={teamMember.name.furikana}
          className="w-full h-full object-cover"
        />
      </div>
      {/* Product Image */}
      {/* <Image src={teamMember.image} alt={teamMember.name} width={500} height={500} /> */}
    </section>
  );
}
