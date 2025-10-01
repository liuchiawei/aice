"use client";

import { CardContainer, CardBody, CardItem } from "@/components/ui/3d-card";
import TeamMembers from "@/data/team-members.json";
import { motion, AnimatePresence } from "motion/react";

export default function TeamMemberCard({
  id,
  setSelectedTeamMember,
}: {
  id: number;
  setSelectedTeamMember: (id: number | null) => void;
}) {
  const teamMember = TeamMembers.find((member) => member.id === id);
  if (!teamMember) {
    return null;
  }
  return (
    <div
      className="w-screen h-screen bg-black/40 fixed top-0 left-0"
      onClick={() => setSelectedTeamMember(null)}
    >
      <motion.div
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 100 }}
        transition={{ duration: 0.5, type: "spring" }}
        className="absolute top-1/2 right-1/2 md:right-12 -translate-y-1/2 translate-x-1/2 md:translate-x-0"
      >
        <CardContainer>
          <CardBody className="w-66 md:w-72 h-96 bg-card rounded-xl relative">
            <CardItem
              translateZ={100}
              className="text-2xl font-bold bg-red-500"
            >
              <h1>{teamMember.name}</h1>
            </CardItem>
            <CardItem
              translateZ={80}
              as="img"
              src={teamMember.image}
              alt={teamMember.name}
              children={null}
            />
            <CardItem
              translateZ={100}
              className="text-2xl font-bold bg-blue-500"
            >
              <h1>{teamMember.role}</h1>
            </CardItem>
          </CardBody>
        </CardContainer>
      </motion.div>
    </div>
  );
}
