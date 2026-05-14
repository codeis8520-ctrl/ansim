"use client";

import { Fragment, useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/cn";
import { YANG, EUM } from "@/lib/colors";

const SLIDE_TRANSITION = { duration: 1.0, ease: "easeInOut" } as const;
const LOOP_INTERVAL_MS = 3900;

export type CombinationMode =
  | "close-corner"
  | "close-curve"
  | "open-spread";
export type Polarity = "yang" | "eum";

export interface CombinationCardProps {
  mode: CombinationMode;
  result: "ㅁ" | "ㅇ" | "ㅅ";
  polarity: Polarity;
  topLabel: string;
  bottomLabel: string;
  description: string;
  className?: string;
}

/**
 * CombinationCard — ㄱ + ㄴ → 결과 글자(ㅁ/ㅇ/ㅅ) 결합 애니메이션 카드.
 *
 * 200×200 viewBox 공통. ㄱ(좌상단)과 ㄴ(우하단)이 fade-in + slide로 등장한 뒤
 * 모드별로 다르게 결합되어 결과 자모를 형성한다.
 *
 * - close-corner → ㅁ : 사각형의 두 직각 코너로 맞물림.
 * - close-curve  → ㅇ : 사각형 잠시 형성 후 라인 fade-out + 원 draw-on.
 * - open-spread  → ㅅ : 두 다리처럼 벌어지는 V 역상. 닫지 않음. EUM→YANG 보간.
 *
 * 트리거: cycleKey 기반 자동 루프 — 매 LOOP_INTERVAL_MS마다 SVG+결과 글자가
 * Fragment 단위로 remount되어 forward 애니메이션이 깨끗하게 재생.
 * 호버 시에도 즉시 remount.
 * prefers-reduced-motion: 즉시 종료 자세 정적 표시.
 */
export default function CombinationCard({
  mode,
  result,
  polarity,
  topLabel,
  bottomLabel,
  description,
  className,
}: CombinationCardProps) {
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

  const ariaLabel = `${topLabel} — ${result}로 결합되는 ㄱ과 ㄴ`;
  const resultColor = polarity === "yang" ? "text-yang" : "text-eum";
  const resultDelay = reduced ? 0 : 1.4;

  return (
    <div
      className={cn(
        "flex flex-col items-center text-center gap-4 p-6 md:p-8 rounded-2xl bg-background border border-foreground/10",
        className,
      )}
    >
      {/* 상단 모드 레이블 */}
      <p className="text-sm md:text-base font-medium text-foreground/70 uppercase tracking-wide">
        {topLabel}
      </p>

      {/* 결합 애니메이션 SVG + 결과 글자 — Fragment 단위 remount로 forward 재생 */}
      <Fragment key={cycleKey}>
        <div className="w-full max-w-[200px] aspect-square">
          <motion.svg
            role="img"
            aria-label={ariaLabel}
            viewBox="0 0 200 200"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            stroke={EUM}
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-full h-full"
            onHoverStart={replay}
          >
            <title>{ariaLabel}</title>

            {mode === "close-corner" && <CloseCornerShape reduced={reduced} />}
            {mode === "close-curve" && <CloseCurveShape reduced={reduced} />}
            {mode === "open-spread" && <OpenSpreadShape reduced={reduced} />}
          </motion.svg>
        </div>

        {/* 결과 글자 — 결합 완료 시점에 fade in */}
        <motion.p
          aria-hidden="true"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: resultDelay }}
          className={cn(
            "text-7xl md:text-8xl font-bold leading-none",
            resultColor,
          )}
        >
          {result}
        </motion.p>
      </Fragment>

      {/* 하단 라벨 */}
      <p className="text-lg md:text-xl font-bold text-foreground">
        {bottomLabel}
      </p>
      <p className="text-base text-foreground/80 leading-relaxed">
        {description}
      </p>
    </div>
  );
}

/* ---------- 모드별 SVG 형상 ---------- */

/**
 * close-corner → ㅁ : ㄱ과 ㄴ이 직사각형의 두 대각 코너로 맞물려 80×80 사각형 형성.
 */
function CloseCornerShape({ reduced }: { reduced: boolean }) {
  const t = reduced ? { duration: 0 } : SLIDE_TRANSITION;
  return (
    <>
      {/* ㄱ — 수평 */}
      <motion.line
        initial={{ x1: 40, y1: 40, x2: 80, y2: 40, opacity: 0 }}
        animate={{ x1: 60, y1: 60, x2: 140, y2: 60, opacity: 1 }}
        transition={t}
      />
      {/* ㄱ — 수직 */}
      <motion.line
        initial={{ x1: 80, y1: 40, x2: 80, y2: 80, opacity: 0 }}
        animate={{ x1: 140, y1: 60, x2: 140, y2: 140, opacity: 1 }}
        transition={t}
      />
      {/* ㄴ — 수직 */}
      <motion.line
        initial={{ x1: 120, y1: 120, x2: 120, y2: 160, opacity: 0 }}
        animate={{ x1: 60, y1: 60, x2: 60, y2: 140, opacity: 1 }}
        transition={t}
      />
      {/* ㄴ — 수평 */}
      <motion.line
        initial={{ x1: 120, y1: 160, x2: 160, y2: 160, opacity: 0 }}
        animate={{ x1: 60, y1: 140, x2: 140, y2: 140, opacity: 1 }}
        transition={t}
      />
    </>
  );
}

/**
 * close-curve → ㅇ : 사각형 코너 슬라이드 → 라인 fade-out → 원 draw-on.
 */
function CloseCurveShape({ reduced }: { reduced: boolean }) {
  const slide = reduced ? { duration: 0 } : SLIDE_TRANSITION;
  const lineFade = reduced
    ? { duration: 0 }
    : ({ duration: 0.5, delay: 0.8 } as const);
  const circleDraw = reduced
    ? { duration: 0 }
    : ({ duration: 0.7, delay: 0.8 } as const);
  return (
    <>
      {/* ㄱ — 수평 */}
      <motion.line
        initial={{ x1: 40, y1: 40, x2: 80, y2: 40, opacity: 0, strokeOpacity: 1 }}
        animate={{ x1: 60, y1: 60, x2: 140, y2: 60, opacity: 1, strokeOpacity: 0 }}
        transition={{
          x1: slide,
          y1: slide,
          x2: slide,
          y2: slide,
          opacity: slide,
          strokeOpacity: lineFade,
        }}
      />
      {/* ㄱ — 수직 */}
      <motion.line
        initial={{ x1: 80, y1: 40, x2: 80, y2: 80, opacity: 0, strokeOpacity: 1 }}
        animate={{ x1: 140, y1: 60, x2: 140, y2: 140, opacity: 1, strokeOpacity: 0 }}
        transition={{
          x1: slide,
          y1: slide,
          x2: slide,
          y2: slide,
          opacity: slide,
          strokeOpacity: lineFade,
        }}
      />
      {/* ㄴ — 수직 */}
      <motion.line
        initial={{ x1: 120, y1: 120, x2: 120, y2: 160, opacity: 0, strokeOpacity: 1 }}
        animate={{ x1: 60, y1: 60, x2: 60, y2: 140, opacity: 1, strokeOpacity: 0 }}
        transition={{
          x1: slide,
          y1: slide,
          x2: slide,
          y2: slide,
          opacity: slide,
          strokeOpacity: lineFade,
        }}
      />
      {/* ㄴ — 수평 */}
      <motion.line
        initial={{ x1: 120, y1: 160, x2: 160, y2: 160, opacity: 0, strokeOpacity: 1 }}
        animate={{ x1: 60, y1: 140, x2: 140, y2: 140, opacity: 1, strokeOpacity: 0 }}
        transition={{
          x1: slide,
          y1: slide,
          x2: slide,
          y2: slide,
          opacity: slide,
          strokeOpacity: lineFade,
        }}
      />
      {/* 원 */}
      <motion.circle
        cx={100}
        cy={100}
        r={40}
        stroke={EUM}
        initial={{ pathLength: 0, strokeOpacity: 0 }}
        animate={{ pathLength: 1, strokeOpacity: 1 }}
        transition={circleDraw}
      />
    </>
  );
}

/**
 * open-spread → ㅅ : ㄱ과 ㄴ이 apex (100,60)에서 좌하/우하로 벌어지는 V 역상.
 * EUM→YANG 보간 (양 자음).
 */
function OpenSpreadShape({ reduced }: { reduced: boolean }) {
  const slide = reduced ? { duration: 0 } : SLIDE_TRANSITION;
  const colorTransition = reduced
    ? { duration: 0 }
    : ({ duration: 0.7, delay: 0.5 } as const);
  const fadeTransition = reduced
    ? { duration: 0 }
    : ({ duration: 0.5, delay: 0.5 } as const);
  return (
    <>
      {/* ㄱ — 첫 line (왼쪽 다리로 morph) */}
      <motion.line
        initial={{ x1: 40, y1: 40, x2: 80, y2: 40, opacity: 0, stroke: EUM }}
        animate={{ x1: 100, y1: 60, x2: 60, y2: 140, opacity: 1, stroke: YANG }}
        transition={{
          x1: slide,
          y1: slide,
          x2: slide,
          y2: slide,
          opacity: slide,
          stroke: colorTransition,
        }}
      />
      {/* ㄱ — 두 번째 line (사라짐) */}
      <motion.line
        initial={{ x1: 80, y1: 40, x2: 80, y2: 80, opacity: 0, strokeOpacity: 1 }}
        animate={{ x1: 80, y1: 40, x2: 80, y2: 80, opacity: 1, strokeOpacity: 0 }}
        transition={{ opacity: slide, strokeOpacity: fadeTransition }}
      />
      {/* ㄴ — 첫 line (오른쪽 다리로 morph) */}
      <motion.line
        initial={{ x1: 120, y1: 120, x2: 120, y2: 160, opacity: 0, stroke: EUM }}
        animate={{ x1: 100, y1: 60, x2: 140, y2: 140, opacity: 1, stroke: YANG }}
        transition={{
          x1: slide,
          y1: slide,
          x2: slide,
          y2: slide,
          opacity: slide,
          stroke: colorTransition,
        }}
      />
      {/* ㄴ — 두 번째 line (사라짐) */}
      <motion.line
        initial={{ x1: 120, y1: 160, x2: 160, y2: 160, opacity: 0, strokeOpacity: 1 }}
        animate={{ x1: 120, y1: 160, x2: 160, y2: 160, opacity: 1, strokeOpacity: 0 }}
        transition={{ opacity: slide, strokeOpacity: fadeTransition }}
      />
    </>
  );
}
