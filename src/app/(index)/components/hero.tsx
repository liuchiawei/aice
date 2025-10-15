"use client";

import { useState, useEffect } from "react";
import {
  motion,
  MotionValue,
  useMotionValue,
  useTransform,
  AnimatePresence,
} from "motion/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import TeamMemberCard from "./TeamMemberCard";
import { Loader, Plus } from "lucide-react";
import Link from "next/link";

type TeamMember = {
  id: number;
  firstName: string;
  lastName: string;
  furigana: string;
  nickname: string;
  image: string;
  role: string;
  partTimeJob: string;
  description: string;
  age: number;
  joinReason: string;
  goal: string;
  message: string;
};

export default function Hero({ teamMembers }: { teamMembers: TeamMember[] }) {
  const [mounted, setMounted] = useState(false);
  const [selectedTeamMember, setSelectedTeamMember] = useState<number | null>(
    null
  );
  // ウィンドウサイズを取得
  const windowSize = useWindowSize();

  // クライアントサイドマウント時に設定
  useEffect(() => {
    setMounted(true);
  }, []);

  // 動的なデバイスサイズ設定
  const device = {
    width: windowSize.width,
    height: windowSize.height,
  };

  // 根據螢幕寬度動態計算列數 (3 ~ 10)
  const gridColCount = Math.min(
    10,
    Math.max(
      3,
      Math.floor((windowSize.width * 1.2) / (icon.size + icon.margin))
    )
  );

  // 動態生成網格
  const grid = new Array(gridRowCount).fill(
    Array.from({ length: gridColCount }, (_, i) => i)
  );

  // 初期位置
  const x = useMotionValue(-200);
  const y = useMotionValue(-100);

  // Transform mapping functions (動的に計算)
  const createScreenRange = (axis: keyof typeof device) => [
    -60,
    80,
    device[axis] - (icon.size + icon.margin) / 2 - 80,
    device[axis] - (icon.size + icon.margin) / 2 + 60,
  ];

  const scaleRange = [0, 1, 1, 0];
  const translateRange = [50, 0, 0, -50];
  const xRange = createScreenRange("width");
  const yRange = createScreenRange("height");

  // サーバーサイドレンダリング時の簡単なフォールバック
  if (!mounted) {
    return (
      <div className="device w-full h-screen relative overflow-hidden flex flex-col items-center justify-center gap-2">
        <Loader className="size-12 text-neutral-500 animate-spin animate-infinite" />
        <div className="text-center">
          <div className="text-4xl font-bold text-gray-800 mb-4">AICE</div>
          <div className="text-lg text-gray-600 animate-pulse">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-screen relative overflow-hidden user-select-none touch-none">
      <motion.div
        drag
        // 拖曳邊界設定
        dragConstraints={{
          left: -device.width / 5, // maximum left (right side drag)
          right: 100, // maximum right (left side drag)
          top: -500,
          bottom: 50,
        }}
        dragElastic={0.5}
        style={{
          width: device.width * 2,
          height: device.height * 2,
          x,
          y,
          willChange: "transform",
        }}
        className="bg-transparent cursor-grab active:cursor-grabbing"
      >
        {grid.map((rows, rowIndex) =>
          rows.map((colIndex: number) => (
            <Item
              key={`${rowIndex}-${colIndex}`}
              row={rowIndex}
              col={colIndex}
              index={rowIndex * gridColCount + colIndex}
              planeX={x}
              planeY={y}
              xRange={xRange}
              yRange={yRange}
              scaleRange={scaleRange}
              translateRange={translateRange}
              setSelectedTeamMember={setSelectedTeamMember}
              teamMembers={teamMembers}
              gridColCount={gridColCount}
            />
          ))
        )}
        <AddMemberButton
          planeX={x}
          planeY={y}
          xRange={xRange}
          yRange={yRange}
          scaleRange={scaleRange}
          translateRange={translateRange}
          teamMembersCount={teamMembers.length}
          gridColCount={gridColCount}
        />
      </motion.div>
      <AnimatePresence>
        {selectedTeamMember && (
          <TeamMemberCard
            teamMember={teamMembers.find((m) => m.id === selectedTeamMember)!}
            setSelectedTeamMember={setSelectedTeamMember}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function Item({
  row,
  col,
  index,
  planeX,
  planeY,
  xRange,
  yRange,
  scaleRange,
  translateRange,
  setSelectedTeamMember,
  teamMembers,
  gridColCount,
}: ItemProps) {
  const xOffset =
    col * (icon.size + icon.margin) +
    (row % 2) * ((icon.size + icon.margin) / 2);
  const yOffset = row * icon.size;

  const screenOffsetX = useTransform(() => planeX.get() + xOffset + 20);
  const screenOffsetY = useTransform(() => planeY.get() + yOffset + 20);
  const x = useTransform(screenOffsetX, xRange, translateRange);
  const y = useTransform(screenOffsetY, yRange, translateRange);
  const xScale = useTransform(screenOffsetX, xRange, scaleRange);
  const yScale = useTransform(screenOffsetY, yRange, scaleRange);
  const scale = useTransform(() => Math.min(xScale.get(), yScale.get()));

  const memberIndex = (row * gridColCount + col) % teamMembers.length;
  const member = teamMembers[memberIndex];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, delay: index * 0.03 }}
      className="absolute flex justify-center items-center rounded-full bg-neutral-50 contain-strict overflow-hidden shadow-md hover:shadow-xl hover:scale-110 transition-all"
      style={{
        left: `${xOffset}px`,
        top: `${yOffset}px`,
        x,
        y,
        scale,
        width: `${icon.size}px`,
        height: `${icon.size}px`,
        willChange: "transform",
      }}
    >
      <TooltipProvider>
        <Tooltip delayDuration={600}>
          <TooltipTrigger asChild>
            <Avatar
              className="size-full flex justify-center items-center cursor-pointer text-2xl"
              onClick={() => setSelectedTeamMember(member.id)}
            >
              <AvatarImage
                src={member.image}
                alt={member.furigana}
                className="object-cover select-none touch-none"
              />
              <AvatarFallback>{member.firstName.charAt(0)}</AvatarFallback>
            </Avatar>
          </TooltipTrigger>
          <TooltipContent>
            <p>{member.furigana}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </motion.div>
  );
}

function AddMemberButton({
  planeX,
  planeY,
  xRange,
  yRange,
  scaleRange,
  translateRange,
  teamMembersCount,
  gridColCount,
}: {
  planeX: MotionValue<number>;
  planeY: MotionValue<number>;
  xRange: number[];
  yRange: number[];
  scaleRange: number[];
  translateRange: number[];
  teamMembersCount: number;
  gridColCount: number;
}) {
  // Calculate position based on team members count
  // Place it after the last member in the grid
  const totalItems = teamMembersCount;
  const row = Math.floor(totalItems / gridColCount);
  const col = totalItems % gridColCount;

  const xOffset =
    col * (icon.size + icon.margin) +
    (row % 2) * ((icon.size + icon.margin) / 2);
  const yOffset = row * icon.size;

  const screenOffsetX = useTransform(() => planeX.get() + xOffset + 20);
  const screenOffsetY = useTransform(() => planeY.get() + yOffset + 20);
  const x = useTransform(screenOffsetX, xRange, translateRange);
  const y = useTransform(screenOffsetY, yRange, translateRange);
  const xScale = useTransform(screenOffsetX, xRange, scaleRange);
  const yScale = useTransform(screenOffsetY, yRange, scaleRange);
  const scale = useTransform(() => Math.min(xScale.get(), yScale.get()));

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, delay: totalItems * 0.03 }}
      className="absolute flex justify-center items-center rounded-full bg-neutral-50 contain-strict overflow-hidden shadow-md hover:shadow-xl hover:scale-110 transition-all"
      style={{
        left: `${xOffset}px`,
        top: `${yOffset}px`,
        x,
        y,
        scale,
        width: `${icon.size}px`,
        height: `${icon.size}px`,
        willChange: "transform",
      }}
    >
      <TooltipProvider>
        <Tooltip delayDuration={600}>
          <TooltipTrigger asChild>
            <Link
              href="/register"
              className="w-full h-full flex justify-center items-center cursor-pointer bg-gradient-to-br from-blue-400 to-blue-600 hover:from-blue-500 hover:to-blue-700 transition-all"
            >
              <Plus className="size-12 text-white" strokeWidth={3} />
            </Link>
          </TooltipTrigger>
          <TooltipContent>
            <p>Add New Member</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </motion.div>
  );
}

interface ItemProps {
  row: number;
  col: number;
  index: number;
  planeX: MotionValue<number>;
  planeY: MotionValue<number>;
  xRange: number[];
  yRange: number[];
  scaleRange: number[];
  translateRange: number[];
  setSelectedTeamMember: (id: number) => void;
  teamMembers: TeamMember[];
  gridColCount: number;
}

/**
 * ==============   Settings   ================
 */

const gridRowCount = 10;

const icon = {
  margin: 80,
  size: 100,
};

// ウィンドウサイズを監視するカスタムフック
function useWindowSize() {
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== "undefined" ? window.innerWidth : 1920,
    height: typeof window !== "undefined" ? window.innerHeight : 1080,
  });

  useEffect(() => {
    // ウィンドウサイズ変更のハンドラー
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }

    // リサイズイベントリスナーを追加
    window.addEventListener("resize", handleResize);

    // コンポーネントマウント時に一度実行
    handleResize();

    // クリーンアップ
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return windowSize;
}
