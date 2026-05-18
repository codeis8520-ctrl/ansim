"use client";

import { cn } from "@/lib/cn";

/**
 * DigitGlyph — 양·음 한글숫자 각론 (1~9, 0/5의 보조 글리프 △/○).
 *
 * 100×120 viewBox. 각 digit의 획 수 = 값.
 *   1~4: W의 1~4번째 획까지 누적 그리기.
 *   5  : △ (양의 완성, "오" — 더 그릴 W 획이 없음).
 *   6~9: M의 1~4번째 획까지 누적 그리기.
 *   0  : ○ (음의 완성, "영" — 더 그릴 M 획이 없음).
 *
 * NumberGlyph(총론)와 동일한 vertex 좌표·beat을 사용해 시각 일관성 확보.
 * 정적 SVG (애니메이션 없음) — 각론은 한눈에 매핑이 보이는 게 핵심.
 */

const W_VERTICES = [
  [20, 30],
  [40, 100],
  [55, 45],
  [70, 100],
  [90, 30],
] as const;

const M_VERTICES = [
  [20, 100],
  [40, 30],
  [55, 85],
  [70, 30],
  [90, 100],
] as const;

export type DigitValue = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 0;

export interface DigitGlyphProps {
  value: DigitValue;
  className?: string;
}

function strokeCountFor(value: DigitValue): number {
  if (value === 5 || value === 0) return 0;
  if (value <= 4) return value;
  return value - 5;
}

export default function DigitGlyph({ value, className }: DigitGlyphProps) {
  const isYang = value >= 1 && value <= 5;
  const polarityClass = isYang ? "text-yang" : "text-eum";
  const strokes = strokeCountFor(value);

  const vertices =
    value >= 1 && value <= 4
      ? W_VERTICES
      : value >= 6 && value <= 9
        ? M_VERTICES
        : null;

  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 110 130"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("w-full h-full", polarityClass, className)}
    >
      {/* 누적 W/M 획 (1~4, 6~9) */}
      {vertices &&
        Array.from({ length: strokes }).map((_, i) => {
          const start = vertices[i];
          const end = vertices[i + 1];
          return (
            <line
              key={i}
              x1={start[0]}
              y1={start[1]}
              x2={end[0]}
              y2={end[1]}
              strokeWidth={4}
            />
          );
        })}

      {/* 5 — △ (양 완성) */}
      {value === 5 && (
        <polygon
          points="55,32 30,90 80,90"
          stroke="currentColor"
          strokeWidth={4}
          fill="none"
        />
      )}

      {/* 0 — ○ (음 완성) */}
      {value === 0 && (
        <circle
          cx={55}
          cy={65}
          r={28}
          stroke="currentColor"
          strokeWidth={4}
          fill="none"
        />
      )}

      {/* 숫자 라벨 */}
      <text
        x={55}
        y={120}
        textAnchor="middle"
        fontSize={18}
        fontWeight={700}
        fill="currentColor"
        stroke="none"
      >
        {value === 0 ? "0" : value}
      </text>
    </svg>
  );
}
