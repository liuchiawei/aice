"use client";

import { useState, useEffect } from "react";
import {
  motion,
  MotionValue,
  useMotionValue,
  useTransform,
  AnimatePresence,
} from "motion/react";
// import Image from "next/image";
// import Link from "next/link";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import TeamMemberCard from "./TeamMemberCard";
import { Loader } from "lucide-react";
import TeamMembers from "@/data/team-members.json";

export default function Hero() {
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
          left: -200,
          right: 20,
          top: -500,
          bottom: 50,
        }}
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
              index={rowIndex * 12 + colIndex}
              planeX={x}
              planeY={y}
              xRange={xRange}
              yRange={yRange}
              scaleRange={scaleRange}
              translateRange={translateRange}
              setSelectedTeamMember={setSelectedTeamMember}
            />
          ))
        )}
      </motion.div>
      <AnimatePresence>
        {selectedTeamMember && (
          <TeamMemberCard
            id={selectedTeamMember}
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
            <div
              onClick={() =>
                setSelectedTeamMember(
                  TeamMembers[(row * 10 + col) % TeamMembers.length].id
                )
              }
              className="w-full h-full flex justify-center items-center cursor-pointer"
            >
              {/* Demo Image */}
              <img
                src={TeamMembers[(row * 10 + col) % TeamMembers.length].image.thumbnail}
                alt={TeamMembers[(row * 10 + col) % TeamMembers.length].name.furikana}
                className="object-cover select-none touch-none"
              />
              {/* Product Image */}
              {/* <Image
                src={TeamMembers[(row * 10 + col) % TeamMembers.length].image}
                alt={TeamMembers[(row * 10 + col) % TeamMembers.length].name}
                width={icon.size}
                height={icon.size}
                className="object-cover select-none touch-none"
              /> */}
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>{TeamMembers[(row * 12 + col) % TeamMembers.length].name.furikana}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </motion.div>
  );
}

// Fill a grid of numbers to represent each app icon
const grid = new Array(10).fill([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);

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
}

/**
 * ==============   Settings   ================
 */

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
