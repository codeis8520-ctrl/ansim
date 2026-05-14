"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/cn";
import { YANG, EUM } from "@/lib/colors";

const TRANSITION = { duration: 1.2, ease: "easeInOut" } as const;
const LOOP_INTERVAL_MS = 3500;

/**
 * PostureMorphGiyeok — 차렷 → 거수 경례 모핑 자동 루프.
 *
 * 200×200 viewBox. 매 LOOP_INTERVAL_MS마다 cycleKey가 증가하며 SVG 전체가
 * remount되어 차렷에서 경례까지 forward 애니메이션이 깨끗하게 재생된다.
 * remount 방식이라 reverse가 forward를 덮어쓰는 문제가 없다.
 * 호버 시에도 즉시 remount하여 재생.
 * prefers-reduced-motion 사용자: transition duration 0으로 즉시 종료 자세 정적 표시.
 */
export interface PostureMorphGiyeokProps {
  className?: string;
}

export default function PostureMorphGiyeok({
  className,
}: PostureMorphGiyeokProps) {
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
      aria-label="차렷 자세에서 거수 경례 자세로 변하는 사람. 경례한 팔이 ㄱ을 이룹니다."
      viewBox="0 0 200 200"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("w-full h-full text-eum", className)}
      onHoverStart={replay}
    >
      <title>
        차렷 자세에서 거수 경례 자세로 변하는 사람. 경례한 팔이 ㄱ을 이룹니다.
      </title>

      {/* 머리 (정적) */}
      <circle cx={100} cy={30} r={14} />

      {/* 몸통 (정적) */}
      <line x1={100} y1={44} x2={100} y2={140} />

      {/* 두 다리 (정적) */}
      <line x1={100} y1={140} x2={80} y2={180} />
      <line x1={100} y1={140} x2={120} y2={180} />

      {/* 왼팔 — 차렷 유지 (정적) */}
      <line x1={84} y1={55} x2={84} y2={110} />

      {/* ㄱ-팔 수직 부분 — 차렷에서 경례까지 forward 애니메이션 */}
      <motion.line
        x1={116}
        y1={55}
        initial={{ x2: 116, y2: 110, stroke: EUM }}
        animate={{ x2: 116, y2: 15, stroke: YANG }}
        transition={transition}
      />

      {/* ㄱ-팔 수평 부분 — 차렷에선 collapsed (불가시), 경례에서 펼쳐짐 */}
      <motion.line
        initial={{ x1: 116, y1: 55, x2: 116, y2: 55, stroke: EUM }}
        animate={{ x1: 116, y1: 15, x2: 86, y2: 15, stroke: YANG }}
        transition={transition}
      />
    </motion.svg>
  );
}
