"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/cn";
import { EUM } from "@/lib/colors";

const TRANSITION = { duration: 1.2, ease: "easeInOut" } as const;
const LOOP_INTERVAL_MS = 3700;

/**
 * PostureMorphNieun — 누움 → 앉음 모핑 자동 루프.
 *
 * 200×200 viewBox. 매 LOOP_INTERVAL_MS마다 cycleKey 증가로 SVG remount,
 * 누움→앉음 forward 애니메이션이 깨끗하게 재생된다.
 * Giyeok과 LOOP_INTERVAL_MS를 살짝 다르게(3500 vs 3700) 두어 두 컴포넌트가
 * 동시에 동기 재생되지 않도록.
 *
 * ㄴ을 형성하는 상체+다리는 EUM 유지, morph 종료 시 stroke-width 강조 (양과의 차별).
 * prefers-reduced-motion: 즉시 종료 자세.
 */
export interface PostureMorphNieunProps {
  className?: string;
}

export default function PostureMorphNieun({
  className,
}: PostureMorphNieunProps) {
  const reduced = useReducedMotion() ?? false;
  const [cycleKey, setCycleKey] = useState(0);

  useEffect(() => {
    if (reduced) return;
    const interval = setInterval(
      () => setCycleKey((k) => k + 1),
      LOOP_INTERVAL_MS,
    );
    return () => clearInterval(interval);
  }, [reduced]);

  const replay = () => {
    if (reduced) return;
    setCycleKey((k) => k + 1);
  };

  const transition = reduced ? { duration: 0 } : TRANSITION;

  return (
    <motion.svg
      key={cycleKey}
      role="img"
      aria-label="누운 자세에서 상체를 일으켜 앉는 사람. 앉은 자세가 ㄴ을 이룹니다."
      viewBox="0 0 200 200"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      stroke={EUM}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("w-full h-full text-eum", className)}
      onHoverStart={replay}
    >
      <title>
        누운 자세에서 상체를 일으켜 앉는 사람. 앉은 자세가 ㄴ을 이룹니다.
      </title>

      {/* 머리 — 누움 좌측 → 앉음 우측 위로 이동 */}
      <motion.circle
        r={14}
        initial={{ cx: 30, cy: 120 }}
        animate={{ cx: 130, cy: 40 }}
        transition={transition}
      />

      {/* 상체 (ㄴ의 수직 부분) — 누움 시 수평, 앉음 시 수직 */}
      <motion.line
        initial={{ x1: 44, y1: 120, x2: 130, y2: 120, strokeWidth: 2 }}
        animate={{ x1: 130, y1: 54, x2: 130, y2: 120, strokeWidth: 3 }}
        transition={transition}
      />

      {/* 다리 (ㄴ의 수평 부분) — 위치 정적, 두께만 강조 */}
      <motion.line
        x1={130}
        y1={120}
        x2={180}
        y2={120}
        initial={{ strokeWidth: 2 }}
        animate={{ strokeWidth: 3 }}
        transition={transition}
      />
    </motion.svg>
  );
}
