"use client";

import { motion } from "motion/react";
import { CardContainer, CardBody, CardItem } from "@/components/ui/3d-card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import TeamMembers from "@/data/team-members.json";

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
  // カードの入場と退出の時間
  const cardEnterDuration = 0.5;
  const cardExitDuration = 0.2;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: cardExitDuration }}
      className="w-screen h-screen bg-black/40 fixed top-0 left-0"
      onClick={() => setSelectedTeamMember(null)}
    >
      <motion.div
        initial={{ opacity: 0, x: 100, y: -80, rotate: 20 }}
        animate={{ opacity: 1, x: 0, y: 0, rotate: 0 }}
        exit={{
          opacity: 0,
          x: 100,
          y: -80,
          rotate: 20,
          transition: { duration: cardExitDuration },
        }}
        transition={{
          duration: cardEnterDuration,
          type: "spring",
          damping: 10,
          stiffness: 160,
          opacity: { type: "keyframes" },
        }}
        className="w-4/5 md:w-1/2 lg:w-1/3 xl:w-1/4 absolute top-1/2 right-1/2 md:right-12 -translate-y-1/2 translate-x-1/2 md:translate-x-0 origin-bottom-left"
      >
        <AspectRatio ratio={5 / 7}>
          <CardContainer
            containerClassName="w-full h-full"
            className="w-full h-full"
          >
            <CardBody className="group w-full h-full p-6 relative bg-card rounded-xl shadow-2xl">
              <AiceLogo />
              <AiceLogo rotate />
              <CardItem
                translateZ={100}
                className="w-full text-center absolute top-12 left-1/2 -translate-x-1/2"
              >
                <h2 className="mb-1 text-md md:text-sm text-muted-foreground">
                  {teamMember.name.furikana}
                </h2>
                <h1 className="text-5xl md:text-4xl font-bold group-hover:text-shadow-lg transition-all">
                  {teamMember.name.first} {teamMember.name.last}
                </h1>
              </CardItem>
              <motion.div
                initial={{ opacity: 0, y: 200 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{
                  opacity: 0,
                  y: 200,
                  transition: { duration: cardExitDuration },
                }}
                transition={{
                  delay: cardEnterDuration,
                  duration: 0.08,
                  opacity: { type: "keyframes" },
                  y: { type: "spring" },
                }}
                className="w-4/5 aspect-square absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10"
              >
                <CardItem
                  translateZ={40}
                  as="img"
                  src={teamMember.image.full}
                  alt={teamMember.name}
                  children={null}
                  className="aspect-square rounded-full object-cover overflow-hidden group-hover:shadow-xl transition-all duration-200 ease-linear"
                />
              </motion.div>
              {/* Info Section */}
              <CardItem
                translateZ={60}
                className="w-3/4 h-1/5 px-6 py-4 rounded-lg bg-neutral-200/50 backdrop-blur-xs absolute top-2/3 left-1/2 -translate-x-1/2 text-justify group-hover:shadow-xl transition-all"
              >
                <CardItem
                  translateZ={120}
                  translateY={-10}
                  className="absolute top-0 left-6 -translate-y-1/2 z-10 px-4 py-1 bg-card-foreground rounded-sm text-card text-xl font-bold group-hover:shadow-xl transition-all"
                  as="h2"
                >
                  {teamMember.role}
                </CardItem>
                <CardItem
                  translateZ={80}
                  className="w-full text-right text-xs"
                  as="h3"
                >
                  {teamMember.age} 才
                </CardItem>
                <CardItem
                  translateZ={100}
                  className="text-justify group-hover:text-shadow-md transition-all"
                  as="p"
                >
                  {teamMember.message}
                </CardItem>
              </CardItem>
            </CardBody>
          </CardContainer>
        </AspectRatio>
      </motion.div>
    </motion.div>
  );
}

const AiceLogo = ({ rotate }: { rotate?: boolean }) => {
  return (
    <div
      className={`absolute flex flex-col text-neutral-200 text-center text-xl font-bold leading-5 tracking-tight pointer-events-none select-none -z-10 ${
        rotate ? "-rotate-180 bottom-6 right-6" : "top-6 left-6"
      }`}
    >
      <span>A</span>
      <span>I</span>
      <span>C</span>
      <span>E</span>
    </div>
  );
};
