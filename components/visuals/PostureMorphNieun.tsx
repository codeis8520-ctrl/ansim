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
 * ㄱ 모핑은 차렷 몸(=양모음 ㅣ)이 줄기처럼 끝까지 남는다. 대칭을 위해
 * ㄴ 모핑도 누운 자리의 수평 바닥선(=음모음 ㅡ)을 영구적 줄기로 유지한다.
 * 사람은 그 줄기 위에서 누웠다가 앉아 ㄴ을 이룬다.
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
      aria-label="음모음 ㅡ 줄기 위에 누운 사람이 상체를 일으켜 앉습니다. 앉은 자세가 음자음 ㄴ을 이룹니다."
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
        음모음 ㅡ 줄기 위에 누운 사람이 상체를 일으켜 앉습니다. 앉은 자세가 음자음 ㄴ을 이룹니다.
      </title>

      {/* 음모음 ㅡ 줄기 — 영구적 수평 바닥선. ㄴ이 이 줄기 위에서 자란다. */}
      <line
        x1={20}
        y1={180}
        x2={180}
        y2={180}
        strokeWidth={4}
        opacity={0.55}
      />

      {/* 머리 — 누움(좌측 바닥) → 앉음(우측 위로) */}
      <motion.circle
        r={12}
        initial={{ cx: 40, cy: 168 }}
        animate={{ cx: 130, cy: 70 }}
        transition={transition}
      />

      {/* 상체 (ㄴ의 수직 부분) — 누움 시 수평, 앉음 시 수직 */}
      <motion.line
        initial={{ x1: 52, y1: 168, x2: 130, y2: 168, strokeWidth: 2 }}
        animate={{ x1: 130, y1: 82, x2: 130, y2: 168, strokeWidth: 3 }}
        transition={transition}
      />

      {/* 다리 (ㄴ의 수평 부분) — 줄기 위 약간 띄워 ㄴ의 가로획으로 강조 */}
      <motion.line
        x1={130}
        y1={168}
        x2={172}
        y2={168}
        initial={{ strokeWidth: 2 }}
        animate={{ strokeWidth: 3 }}
        transition={transition}
      />

      {/* 음모음 ㅡ 라벨 */}
      <text
        x={20}
        y={196}
        fontSize={10}
        fontWeight={600}
        fill={EUM}
        stroke="none"
        opacity={0.7}
      >
        음모음 ㅡ
      </text>
    </motion.svg>
  );
}
