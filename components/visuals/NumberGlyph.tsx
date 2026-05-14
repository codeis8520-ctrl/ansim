"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/cn";

const LOOP_INTERVAL_MS = 5500;

// 시퀀스 시점 (초) — 시퀀스 ~4.5s + 1s 휴지 → 5.5s cycle.
const STROKE_DURATION = 0.5;
const STROKE_DELAYS = [0, 0.5, 1.0, 1.5] as const; // 4 stroke 순차 draw-on
const NUMBER_LABELS_START = 2.0;
const NUMBER_LABEL_STAGGER = 0.1;
const ACCENT_START = 2.5; // △ / ○ + 그 라벨 등장

const STROKE_TRANSITION = { duration: STROKE_DURATION, ease: "easeOut" } as const;
const FADE_TRANSITION = { duration: 0.4, ease: "easeOut" } as const;
const POP_TRANSITION = { duration: 0.5, ease: "backOut" } as const;

/**
 * NumberGlyph — 양·음 한글숫자 글리프 (W=1·2·3·4 + △=5 / M=6·7·8·9 + ○=0).
 *
 * 240×280 viewBox. 매 LOOP_INTERVAL_MS마다 cycleKey가 증가하며 SVG 전체가
 * remount되어 시퀀스(4 stroke draw-on → 숫자 라벨 stagger fade-in →
 * △/○ pop-in + 그 라벨 fade-in)가 깨끗하게 forward 재생된다.
 * 호버 시에도 즉시 remount하여 재생.
 * prefers-reduced-motion 사용자: setInterval 미실행 + transition duration 0으로
 *   정적 종료 자세 (W/M 4 stroke + 숫자 + △/○ 모두 표시) 즉시 표시.
 */
export interface NumberGlyphProps {
  variant: "yang" | "eum";
  className?: string;
}

// 좌표는 BRIEF에서 잠긴 값. 변경 X.
// W: (40,220) → (90,80) → (120,200) → (150,80) → (200,220)
// M: 수평축 기준 W를 뒤집기 — (40,80) → (90,220) → (120,100) → (150,220) → (200,80)
const W_VERTICES = [
  [40, 220],
  [90, 80],
  [120, 200],
  [150, 80],
  [200, 220],
] as const;

const M_VERTICES = [
  [40, 80],
  [90, 220],
  [120, 100],
  [150, 220],
  [200, 80],
] as const;

// 숫자 라벨 위치 — 각 stroke 시작 vertex 근처, 본체 stroke와 겹치지 않게
// 가독성 우선으로 약간 오프셋 (W는 위로 가는 시작점은 아래쪽에, 아래로 가는 시작점은 위쪽에).
const W_NUMBER_POSITIONS = [
  { x: 28, y: 240, text: "1" }, // (40,220) start, segment 위로 → 아래에 배치
  { x: 78, y: 68, text: "2" }, // (90,80) start, segment 아래로 → 위에 배치
  { x: 120, y: 224, text: "3" }, // (120,200) start, segment 위로 → 아래
  { x: 138, y: 68, text: "4" }, // (150,80) start, segment 아래로 → 위
] as const;

const M_NUMBER_POSITIONS = [
  { x: 28, y: 68, text: "6" }, // (40,80) start, segment 아래로 → 위에 배치
  { x: 78, y: 240, text: "7" }, // (90,220) start, segment 위로 → 아래
  { x: 120, y: 92, text: "8" }, // (120,100) start, segment 아래로 → 위
  { x: 138, y: 240, text: "9" }, // (150,220) start, segment 위로 → 아래
] as const;

export default function NumberGlyph({ variant, className }: NumberGlyphProps) {
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

  const vertices = variant === "yang" ? W_VERTICES : M_VERTICES;
  const numberPositions =
    variant === "yang" ? W_NUMBER_POSITIONS : M_NUMBER_POSITIONS;
  const polarityClass = variant === "yang" ? "text-yang" : "text-eum";

  // reduced motion: 모든 transition 0초 → 즉시 종료 자세.
  const strokeTransition = reduced
    ? { duration: 0 }
    : STROKE_TRANSITION;
  const fadeTransition = reduced ? { duration: 0 } : FADE_TRANSITION;
  const popTransition = reduced ? { duration: 0 } : POP_TRANSITION;

  return (
    <motion.svg
      key={cycleKey}
      aria-hidden="true"
      viewBox="0 0 240 280"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("w-full h-full", polarityClass, className)}
      onHoverStart={replay}
    >
      {/* W / M 본체 — 4 stroke 순차 draw-on */}
      {vertices.slice(0, 4).map((start, i) => {
        const end = vertices[i + 1];
        const delay = reduced ? 0 : STROKE_DELAYS[i];
        return (
          <motion.line
            key={i}
            x1={start[0]}
            y1={start[1]}
            x2={end[0]}
            y2={end[1]}
            strokeWidth={5}
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ ...strokeTransition, delay }}
          />
        );
      })}

      {/* 숫자 라벨 1·2·3·4 (yang) 또는 6·7·8·9 (eum) — stagger fade-in */}
      {numberPositions.map((pos, i) => {
        const delay = reduced ? 0 : NUMBER_LABELS_START + i * NUMBER_LABEL_STAGGER;
        return (
          <motion.text
            key={pos.text}
            x={pos.x}
            y={pos.y}
            fill="currentColor"
            stroke="none"
            fontSize={14}
            fontWeight={700}
            textAnchor="middle"
            dominantBaseline="central"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ ...fadeTransition, delay }}
          >
            {pos.text}
          </motion.text>
        );
      })}

      {/* △ (yang) 또는 ○ (eum) — pop-in + 라벨 동시 등장 */}
      {variant === "yang" ? (
        <motion.g
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ ...popTransition, delay: reduced ? 0 : ACCENT_START }}
          style={{ transformOrigin: "120px 45px" }}
        >
          <polygon
            points="120,30 100,60 140,60"
            stroke="currentColor"
            strokeWidth={2.5}
            fill="none"
          />
        </motion.g>
      ) : (
        <motion.g
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ ...popTransition, delay: reduced ? 0 : ACCENT_START }}
          style={{ transformOrigin: "120px 250px" }}
        >
          <circle
            cx={120}
            cy={250}
            r={14}
            stroke="currentColor"
            strokeWidth={2.5}
            fill="none"
          />
        </motion.g>
      )}

      {/* △ "5 (↑)" / ○ "0 (완성)" 라벨 — pop과 동시에 fade-in */}
      <motion.text
        x={variant === "yang" ? 165 : 165}
        y={variant === "yang" ? 50 : 254}
        fill="currentColor"
        stroke="none"
        fontSize={13}
        fontWeight={700}
        textAnchor="start"
        dominantBaseline="central"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ ...fadeTransition, delay: reduced ? 0 : ACCENT_START + 0.1 }}
      >
        {variant === "yang" ? "5 (↑)" : "0 (완성)"}
      </motion.text>
    </motion.svg>
  );
}
