"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/cn";
import { YANG, EUM, FOREGROUND } from "@/lib/colors";

const LOOP_INTERVAL_MS = 7500;

export interface ConsonantTreeProps {
  className?: string;
}

/**
 * ConsonantTree — 14자 자음 enumeration 시각화.
 *
 * 한 SVG (viewBox 0 0 800 1000)에 트리 다이어그램(상단 y 0-480)과
 * 5x4 매트릭스(하단 y 520-1000)를 통합. 두 영역이 동일 hover state를
 * 공유해야 자연스러우므로 props drilling 없이 한 컴포넌트 내부 state.
 *
 * 5단계 cascade:
 *   1) 사람 몸  (t=0,   0.5s)
 *   2) ㄱ/ㄴ + 연결선 (t=0.5, 0.7s)
 *   3) ㄱ+ㄴ 결합 + 연결선 (t=1.3, 0.6s)
 *   4) ㅁ/ㅇ/ㅅ + 연결선 (t=2.0, 0.8s, stagger 0.15)
 *   5) 매트릭스 헤더 + 5행 (t=3.0, stagger 0.12, cell stagger 0.08)
 *
 * 호버: 매트릭스 셀 호버 시 그 글자의 뿌리 노드 함께 강조 + path line.
 *       비-hovered 글자는 opacity 0.4. prefers-reduced-motion 시 모든
 *       단계 즉시 최종 상태.
 */

type Polarity = "yang" | "eum";

interface ConsonantRow {
  root: string;
  polarity: Polarity;
  plus1: string;
  plus2: string | null;
  rowY: number;
  /** 트리 영역에서 root 노드의 x좌표 (호버 path 그릴 때 사용). */
  rootTreeX: number;
  /** 트리 영역에서 root 노드의 y좌표. */
  rootTreeY: number;
}

const CONSONANT_DATA: ConsonantRow[] = [
  // 트리 좌표: 상단 ㄱ(240,160), 하단 ㅁ(280,420), ㅇ(400,420), ㅅ(520,420)
  { root: "ㄱ", polarity: "yang", plus1: "ㅋ", plus2: "ㄹ",  rowY: 620, rootTreeX: 240, rootTreeY: 160 },
  { root: "ㄴ", polarity: "eum",  plus1: "ㄷ", plus2: "ㅌ",  rowY: 700, rootTreeX: 560, rootTreeY: 160 },
  { root: "ㅁ", polarity: "eum",  plus1: "ㅂ", plus2: "ㅍ",  rowY: 780, rootTreeX: 280, rootTreeY: 420 },
  { root: "ㅅ", polarity: "yang", plus1: "ㅈ", plus2: "ㅊ",  rowY: 860, rootTreeX: 520, rootTreeY: 420 },
  { root: "ㅇ", polarity: "eum",  plus1: "ㅎ", plus2: null,   rowY: 940, rootTreeX: 400, rootTreeY: 420 },
];

const COL_X = {
  rootLabel: 120,
  root: 280,
  plus1: 440,
  plus2: 600,
} as const;

const polarityColor = (p: Polarity) => (p === "yang" ? YANG : EUM);

const ARIA_LABEL =
  "14자 자음 트리: 사람 몸에서 양뿌리 ㄱ과 음뿌리 ㄴ이 갈라지고, 두 뿌리가 결합해 초자음 5개 ㄱ ㄴ ㅁ ㅅ ㅇ을 이룹니다. 각 초자음에 획을 더해 14자 자음 전체가 완성됩니다.";

export default function ConsonantTree({ className }: ConsonantTreeProps) {
  const reduced = useReducedMotion() ?? false;
  const [hovered, setHovered] = useState<string | null>(null);
  const [cycleKey, setCycleKey] = useState<number>(0);

  // 타이머 기반 자동 루프 — 스크롤 무관하게 ~7.5s마다 cascade 리플레이.
  useEffect(() => {
    if (reduced) return;
    const interval = setInterval(
      () => setCycleKey((k) => k + 1),
      LOOP_INTERVAL_MS,
    );
    return () => clearInterval(interval);
  }, [reduced]);

  // ----- timings (reduced-motion 시 0) -----
  const t = (s: number) => (reduced ? 0 : s);
  const dur = (s: number) => (reduced ? 0 : s);

  /**
   * Variants — parent SVG는 stagger 캐스케이드의 베이스. 각 단계 motion.g는
   * 자체 variants로 fade/scale + 자식 stagger.
   */
  const containerVariants = {
    hidden: {},
    show: {
      transition: { staggerChildren: 0, delayChildren: 0 },
    },
  };

  // 단계 1 — 사람 몸 노드
  const stage1 = {
    hidden: { opacity: 0, scale: 0.7 },
    show: {
      opacity: 1,
      scale: 1,
      transition: { duration: dur(0.5), delay: t(0), ease: "easeOut" as const },
    },
  };

  // 단계 2 — ㄱ/ㄴ 노드 + 연결선
  const stage2Group = {
    hidden: {},
    show: {
      transition: {
        delayChildren: t(0.5),
        staggerChildren: 0,
      },
    },
  };
  const stage2Node = {
    hidden: { opacity: 0, scale: 0.7 },
    show: {
      opacity: 1,
      scale: 1,
      transition: { duration: dur(0.5), ease: "easeOut" as const },
    },
  };
  const stage2Line = {
    hidden: { pathLength: 0, opacity: 0 },
    show: {
      pathLength: 1,
      opacity: 0.4,
      transition: { duration: dur(0.7), ease: "easeOut" as const },
    },
  };

  // 단계 3 — ㄱ+ㄴ 결합 + 연결선
  const stage3Group = {
    hidden: {},
    show: {
      transition: { delayChildren: t(1.3) },
    },
  };
  const stage3Node = {
    hidden: { opacity: 0, scale: 0.7 },
    show: {
      opacity: 1,
      scale: 1,
      transition: { duration: dur(0.6), ease: "easeOut" as const },
    },
  };
  const stage3Line = {
    hidden: { pathLength: 0, opacity: 0 },
    show: {
      pathLength: 1,
      opacity: 0.4,
      transition: { duration: dur(0.6), ease: "easeOut" as const },
    },
  };

  // 단계 4 — ㅁ ㅇ ㅅ stagger
  const stage4Group = {
    hidden: {},
    show: {
      transition: {
        delayChildren: t(2.0),
        staggerChildren: dur(0.15),
      },
    },
  };
  const stage4Item = {
    hidden: { opacity: 0, scale: 0.7 },
    show: {
      opacity: 1,
      scale: 1,
      transition: { duration: dur(0.5), ease: "easeOut" as const },
    },
  };
  const stage4Line = {
    hidden: { pathLength: 0, opacity: 0 },
    show: {
      pathLength: 1,
      opacity: 0.4,
      transition: { duration: dur(0.6), ease: "easeOut" as const },
    },
  };

  // 단계 5 — 매트릭스
  const stage5Group = {
    hidden: {},
    show: {
      transition: {
        delayChildren: t(3.0),
        staggerChildren: dur(0.12),
      },
    },
  };
  const stage5Header = {
    hidden: { opacity: 0, y: -8 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: dur(0.4), ease: "easeOut" as const },
    },
  };
  const stage5Row = {
    hidden: {},
    show: {
      transition: { staggerChildren: dur(0.08) },
    },
  };
  const stage5Cell = {
    hidden: { opacity: 0, y: 8 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: dur(0.35), ease: "easeOut" as const },
    },
  };

  // ----- 호버 헬퍼 -----
  const isHoverActive = hovered !== null;

  /**
   * 어느 셀/노드가 "호버 강조 활성"인지 판정.
   * - 호버한 글자 자체는 활성.
   * - 매트릭스 셀이 호버되면 그 글자의 뿌리도 활성.
   * - 트리 root가 호버되면 그 root만 활성 (행 cells까지 강조하진 않음 — 단순화).
   */
  const isActive = (glyph: string): boolean => {
    if (!hovered) return false;
    if (hovered === glyph) return true;
    // hovered가 매트릭스 셀(plus1/plus2)이면 그 행의 root도 active
    for (const r of CONSONANT_DATA) {
      if (hovered === r.plus1 || hovered === r.plus2) {
        if (glyph === r.root) return true;
      }
    }
    return false;
  };

  /** 비-호버 글자의 dim opacity. */
  const opacityFor = (glyph: string): number => {
    if (!isHoverActive) return 1;
    return isActive(glyph) ? 1 : 0.4;
  };

  /**
   * 호버 path: hovered가 매트릭스 셀(plus1/plus2)이면
   * 트리 root → 셀 중심 단일 line 그린다.
   */
  const hoverPath = (() => {
    if (!hovered) return null;
    for (const r of CONSONANT_DATA) {
      const cellX =
        hovered === r.plus1 ? COL_X.plus1 :
        hovered === r.plus2 ? COL_X.plus2 :
        null;
      if (cellX !== null) {
        return {
          x1: r.rootTreeX,
          y1: r.rootTreeY,
          x2: cellX,
          y2: r.rowY,
          color: polarityColor(r.polarity),
        };
      }
    }
    return null;
  })();

  // ----- 글자 노드 렌더 헬퍼 (transparent rect hitbox + circle + text) -----
  const renderTreeRootGlyph = (
    glyph: string,
    cx: number,
    cy: number,
    polarity: Polarity,
    label?: string,
  ) => {
    const color = polarityColor(polarity);
    const op = opacityFor(glyph);
    const active = isActive(glyph);
    return (
      <motion.g
        key={glyph}
        variants={stage2Node}
        onMouseEnter={() => setHovered(glyph)}
        onMouseLeave={() => setHovered(null)}
        animate={{ scale: active ? 1.15 : 1, opacity: op }}
        transition={{ type: "spring", stiffness: 300, damping: 22 }}
        style={{ transformOrigin: `${cx}px ${cy}px`, transformBox: "fill-box", cursor: "pointer" }}
      >
        <circle cx={cx} cy={cy} r={42} fill="none" stroke={color} strokeWidth={2} />
        <text
          x={cx}
          y={cy}
          textAnchor="middle"
          dominantBaseline="central"
          fontSize={44}
          fontWeight={700}
          fill={color}
        >
          {glyph}
        </text>
        {label && (
          <text
            x={cx}
            y={cy + 70}
            textAnchor="middle"
            fontSize={14}
            fill={FOREGROUND}
            opacity={0.6}
          >
            {label}
          </text>
        )}
        {/* 추가 hitbox — 라벨 영역까지 포함 */}
        <rect
          x={cx - 50}
          y={cy - 50}
          width={100}
          height={label ? 130 : 100}
          fill="transparent"
          pointerEvents="all"
        />
      </motion.g>
    );
  };

  /** 단계 4용 글자 노드 (variants만 다름). */
  const renderStage4Glyph = (
    glyph: string,
    cx: number,
    cy: number,
    polarity: Polarity,
  ) => {
    const color = polarityColor(polarity);
    const op = opacityFor(glyph);
    const active = isActive(glyph);
    return (
      <motion.g
        key={glyph}
        variants={stage4Item}
        onMouseEnter={() => setHovered(glyph)}
        onMouseLeave={() => setHovered(null)}
        animate={{ scale: active ? 1.15 : 1, opacity: op }}
        transition={{ type: "spring", stiffness: 300, damping: 22 }}
        style={{ transformOrigin: `${cx}px ${cy}px`, transformBox: "fill-box", cursor: "pointer" }}
      >
        <circle cx={cx} cy={cy} r={42} fill="none" stroke={color} strokeWidth={2} />
        <text
          x={cx}
          y={cy}
          textAnchor="middle"
          dominantBaseline="central"
          fontSize={44}
          fontWeight={700}
          fill={color}
        >
          {glyph}
        </text>
        <rect
          x={cx - 50}
          y={cy - 50}
          width={100}
          height={100}
          fill="transparent"
          pointerEvents="all"
        />
      </motion.g>
    );
  };

  /** 매트릭스 셀 — 글자 + transparent rect hitbox. */
  const renderMatrixCell = (
    glyph: string | null,
    cx: number,
    cy: number,
    polarity: Polarity,
  ) => {
    if (glyph === null) {
      return (
        <text
          x={cx}
          y={cy}
          textAnchor="middle"
          dominantBaseline="central"
          fontSize={44}
          fontWeight={700}
          fill={FOREGROUND}
          opacity={0.3}
        >
          —
        </text>
      );
    }
    const color = polarityColor(polarity);
    const op = opacityFor(glyph);
    const active = isActive(glyph);
    return (
      <motion.g
        onMouseEnter={() => setHovered(glyph)}
        onMouseLeave={() => setHovered(null)}
        animate={{ scale: active ? 1.15 : 1, opacity: op }}
        transition={{ type: "spring", stiffness: 300, damping: 22 }}
        style={{ transformOrigin: `${cx}px ${cy}px`, transformBox: "fill-box", cursor: "pointer" }}
      >
        <text
          x={cx}
          y={cy}
          textAnchor="middle"
          dominantBaseline="central"
          fontSize={56}
          fontWeight={700}
          fill={color}
        >
          {glyph}
        </text>
        <rect
          x={cx - 40}
          y={cy - 40}
          width={80}
          height={80}
          fill="transparent"
          pointerEvents="all"
        />
      </motion.g>
    );
  };

  return (
    <motion.svg
      key={cycleKey}
      role="img"
      aria-label={ARIA_LABEL}
      viewBox="0 0 800 1000"
      preserveAspectRatio="xMidYMid meet"
      width="100%"
      style={{ maxWidth: 800, height: "auto", display: "block" }}
      className={cn(className)}
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      <title>{ARIA_LABEL}</title>

      {/* ===== 단계 1 — 사람 몸 ===== */}
      <motion.g variants={stage1}>
        <ellipse cx={400} cy={40} rx={70} ry={28} fill="none" stroke={FOREGROUND} strokeWidth={1.5} opacity={0.7} />
        <text
          x={400}
          y={40}
          textAnchor="middle"
          dominantBaseline="central"
          fontSize={14}
          fill={FOREGROUND}
        >
          사람 몸
        </text>
      </motion.g>

      {/* ===== 단계 2 — ㄱ/ㄴ 노드 + 연결선 ===== */}
      <motion.g variants={stage2Group}>
        <motion.line
          x1={400}
          y1={68}
          x2={240}
          y2={118}
          stroke={FOREGROUND}
          strokeWidth={2}
          variants={stage2Line}
        />
        <motion.line
          x1={400}
          y1={68}
          x2={560}
          y2={118}
          stroke={FOREGROUND}
          strokeWidth={2}
          variants={stage2Line}
        />
        {renderTreeRootGlyph("ㄱ", 240, 160, "yang", "양뿌리")}
        {renderTreeRootGlyph("ㄴ", 560, 160, "eum", "음뿌리")}
      </motion.g>

      {/* ===== 단계 3 — ㄱ+ㄴ 결합 + 연결선 ===== */}
      <motion.g variants={stage3Group}>
        <motion.line
          x1={240}
          y1={202}
          x2={400}
          y2={252}
          stroke={FOREGROUND}
          strokeWidth={2}
          variants={stage3Line}
        />
        <motion.line
          x1={560}
          y1={202}
          x2={400}
          y2={252}
          stroke={FOREGROUND}
          strokeWidth={2}
          variants={stage3Line}
        />
        <motion.g variants={stage3Node}>
          <ellipse cx={400} cy={280} rx={70} ry={28} fill="none" stroke={FOREGROUND} strokeWidth={1.5} opacity={0.7} />
          <text
            x={400}
            y={280}
            textAnchor="middle"
            dominantBaseline="central"
            fontSize={16}
            fontWeight={600}
            fill={FOREGROUND}
          >
            ㄱ+ㄴ
          </text>
        </motion.g>
      </motion.g>

      {/* ===== 단계 4 — ㅁ ㅇ ㅅ + 연결선 ===== */}
      <motion.g variants={stage4Group}>
        {/* 연결선 3개 (결합 노드 → ㅁ/ㅇ/ㅅ) */}
        <motion.line
          x1={400}
          y1={308}
          x2={280}
          y2={378}
          stroke={FOREGROUND}
          strokeWidth={2}
          variants={stage4Line}
        />
        <motion.line
          x1={400}
          y1={308}
          x2={400}
          y2={378}
          stroke={FOREGROUND}
          strokeWidth={2}
          variants={stage4Line}
        />
        <motion.line
          x1={400}
          y1={308}
          x2={520}
          y2={378}
          stroke={FOREGROUND}
          strokeWidth={2}
          variants={stage4Line}
        />
        {renderStage4Glyph("ㅁ", 280, 420, "eum")}
        {renderStage4Glyph("ㅇ", 400, 420, "eum")}
        {renderStage4Glyph("ㅅ", 520, 420, "yang")}
      </motion.g>

      {/* ===== 호버 path (단일 line, hovered에 따라 좌표만 변경) ===== */}
      {hoverPath && (
        <line
          x1={hoverPath.x1}
          y1={hoverPath.y1}
          x2={hoverPath.x2}
          y2={hoverPath.y2}
          stroke={hoverPath.color}
          strokeWidth={3}
          opacity={0.5}
          strokeDasharray="6 4"
          pointerEvents="none"
        />
      )}

      {/* ===== 단계 5 — 매트릭스 ===== */}
      <motion.g variants={stage5Group}>
        {/* 컬럼 헤더 */}
        <motion.g variants={stage5Header}>
          <text x={COL_X.rootLabel} y={540} textAnchor="middle" fontSize={14} fill={FOREGROUND} opacity={0.6}>
            뿌리
          </text>
          <text x={COL_X.root} y={540} textAnchor="middle" fontSize={14} fill={FOREGROUND} opacity={0.6}>
            초자음
          </text>
          <text x={COL_X.plus1} y={540} textAnchor="middle" fontSize={14} fill={FOREGROUND} opacity={0.6}>
            +1획
          </text>
          <text x={COL_X.plus2} y={540} textAnchor="middle" fontSize={14} fill={FOREGROUND} opacity={0.6}>
            +2획
          </text>
        </motion.g>

        {/* 5행 */}
        {CONSONANT_DATA.map((row) => (
          <motion.g key={row.root + "-row"} variants={stage5Row}>
            {/* 뿌리 라벨 (양/음) */}
            <motion.g variants={stage5Cell}>
              <text
                x={COL_X.rootLabel}
                y={row.rowY}
                textAnchor="middle"
                dominantBaseline="central"
                fontSize={16}
                fill={FOREGROUND}
                opacity={0.6}
              >
                ({row.polarity === "yang" ? "양" : "음"})
              </text>
            </motion.g>
            {/* 초자음 */}
            <motion.g variants={stage5Cell}>
              {renderMatrixCell(row.root, COL_X.root, row.rowY, row.polarity)}
            </motion.g>
            {/* +1획 */}
            <motion.g variants={stage5Cell}>
              {renderMatrixCell(row.plus1, COL_X.plus1, row.rowY, row.polarity)}
            </motion.g>
            {/* +2획 */}
            <motion.g variants={stage5Cell}>
              {renderMatrixCell(row.plus2, COL_X.plus2, row.rowY, row.polarity)}
            </motion.g>
          </motion.g>
        ))}
      </motion.g>
    </motion.svg>
  );
}
