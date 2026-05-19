"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/cn";
import { YANG, EUM, FOREGROUND } from "@/lib/colors";

export interface AnnotatedBodyDiagramProps {
  className?: string;
}

/**
 * AnnotatedBodyDiagram — BigIdea 섹션 도식.
 *
 * Hero의 BodyDiagram과 별개의 풍부 도식. viewBox 400×600.
 * 메인 인물 7부위 (머리/코/입/인중/몸통/거수팔/다리)에 한글 자모 라벨이 붙고,
 * 좌측 하단에는 앉은 자세의 cameo 인물(ㄴ)이 추가되어
 * 5초자음(ㄱㄴㅁㅅㅇ)이 한 도식에 모두 표현된다.
 * 각 부위는 호버 시 살짝 확대되며 라벨 색이 양/음/중성으로 변한다.
 *
 * 양 (#E85D3C): ㅣ(코), ㄱ(팔), ㅅ(다리) — 기립/양적 자세
 * 음 (#2C3E62): ㅡ(입), ㅁ(몸통), ㅇ(머리), ㄴ(앉음) — 닫힘/음적 정적
 * 중성: • (인중) — 천지인의 인, 색 변화 없음
 *
 * ㅅ-legs geometry: apex (200, 324) → (140, 540) and (260, 540).
 * 다리 한 쪽이 수직으로부터 atan(60/216) ≈ 15.5° 벌어진다.
 *
 * ㄴ cameo: 좌측 하단(중심 x≈55, y≈515)에 작은 앉은 인물 — 수직 상체 +
 * 수평 다리가 ㄴ 자형을 이룬다. 메인 인물의 ㅅ 다리(좌측 끝 x=140)와
 * 시각적으로 겹치지 않도록 x=20–110 영역에 배치.
 *
 * 인터랙티브 강화:
 * - 부위→라벨 연결선(dashed) — 평소 흐리게, 호버/투어 시 진하게+색
 * - 자동 투어 — viewport 진입 시 7부위 차례로 ~0.7초씩 자동 highlight
 * - 모바일 whileTap — 호버 없이 탭으로 동일 인터랙션
 * - hitbox cursor: pointer
 */

const CONNECTOR_REST = "#6B6B6B";

const partVariants = {
  rest: { scale: 1 },
  hover: { scale: 1.1 },
};

const labelVariants = (toFill: string) => ({
  rest: { scale: 1, fill: FOREGROUND },
  hover: { scale: 1.18, fill: toFill },
});

const neutralLabelVariants = {
  rest: { scale: 1, fill: FOREGROUND },
  hover: { scale: 1.18, fill: FOREGROUND },
};

const connectorVariants = (toStroke: string) => ({
  rest: { stroke: CONNECTOR_REST, opacity: 0.3, strokeWidth: 1 },
  hover: { stroke: toStroke, opacity: 0.95, strokeWidth: 1.5 },
});

const neutralConnectorVariants = {
  rest: { stroke: CONNECTOR_REST, opacity: 0.3, strokeWidth: 1 },
  hover: { stroke: CONNECTOR_REST, opacity: 0.7, strokeWidth: 1.5 },
};

const PART_KEYS = [
  "head",
  "nose",
  "philtrum",
  "mouth",
  "torso",
  "arm",
  "legs",
  "nieun",
] as const;
type PartKey = (typeof PART_KEYS)[number];

export default function AnnotatedBodyDiagram({
  className,
}: AnnotatedBodyDiagramProps) {
  const label =
    "사람 몸의 각 부분에 대응하는 한글 자모음 — 코는 ㅣ, 입은 ㅡ, 인중은 점, 머리는 ㅇ, 몸통은 ㅁ, 두 다리는 ㅅ, 거수한 팔은 ㄱ, 좌측 하단 앉은 자세는 ㄴ";

  const [tourPart, setTourPart] = useState<PartKey | null>(null);

  // 타이머 기반 자동 루프 — 7부위 투어 + 잠시 쉬고 다시 반복.
  useEffect(() => {
    let active = true;
    const timeouts: ReturnType<typeof setTimeout>[] = [];

    const runCycle = () => {
      if (!active) return;
      PART_KEYS.forEach((part, i) => {
        timeouts.push(
          setTimeout(() => setTourPart(part), i * 700)
        );
      });
      timeouts.push(
        setTimeout(() => setTourPart(null), PART_KEYS.length * 700)
      );
      // 사이클 종료 후 1.5s 휴지 → 다음 사이클
      timeouts.push(
        setTimeout(runCycle, PART_KEYS.length * 700 + 1500)
      );
    };

    runCycle();

    return () => {
      active = false;
      timeouts.forEach(clearTimeout);
    };
  }, []);

  const animateFor = (key: PartKey) => (tourPart === key ? "hover" : "rest");

  return (
    <svg
      role="img"
      aria-label={label}
      viewBox="0 0 400 600"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("text-eum w-full h-auto", className)}
    >
      <title>{label}</title>

      {/* Passive 차렷 자세 팔 — 몸통 우측 바깥, 라벨/호버 비활성 */}
      <line x1={260} y1={154} x2={260} y2={310} />

      {/* ----- Head (ㅇ, 음) ----- */}
      <motion.g
        initial="rest"
        whileHover="hover"
        whileTap="hover"
        animate={animateFor("head")}
      >
        <rect
          x={140}
          y={0}
          width={120}
          height={140}
          fill="transparent"
          stroke="none"
          pointerEvents="all"
          className="cursor-pointer"
        />
        <motion.circle
          cx={200}
          cy={80}
          r={44}
          variants={partVariants}
          style={{ transformOrigin: "200px 80px", transformBox: "fill-box" }}
        />
        <motion.text
          x={200}
          y={28}
          textAnchor="middle"
          stroke="none"
          fontFamily='"Pretendard Variable", Pretendard, sans-serif'
          fontWeight={700}
          fontSize={26}
          variants={labelVariants(EUM)}
          style={{ transformOrigin: "200px 28px", transformBox: "fill-box" }}
        >
          ㅇ
        </motion.text>
      </motion.g>

      {/* ----- Nose (ㅣ, 양) ----- */}
      <motion.g
        initial="rest"
        whileHover="hover"
        whileTap="hover"
        animate={animateFor("nose")}
      >
        <rect
          x={180}
          y={86}
          width={100}
          height={28}
          fill="transparent"
          stroke="none"
          pointerEvents="all"
          className="cursor-pointer"
        />
        {/* connector: 코 → ㅣ 라벨 */}
        <motion.line
          x1={210}
          y1={100}
          x2={258}
          y2={102}
          strokeDasharray="3 3"
          variants={connectorVariants(YANG)}
        />
        <motion.line
          x1={200}
          y1={90}
          x2={200}
          y2={110}
          stroke={YANG}
          strokeWidth={2.8}
          variants={partVariants}
          style={{ transformOrigin: "200px 100px", transformBox: "fill-box" }}
        />
        <motion.text
          x={264}
          y={106}
          textAnchor="start"
          stroke="none"
          fontFamily='"Pretendard Variable", Pretendard, sans-serif'
          fontWeight={700}
          fontSize={24}
          variants={labelVariants(YANG)}
          style={{ transformOrigin: "264px 106px", transformBox: "fill-box" }}
        >
          ㅣ
        </motion.text>
      </motion.g>

      {/* ----- Philtrum (•, 중성) ----- */}
      <motion.g
        initial="rest"
        whileHover="hover"
        whileTap="hover"
        animate={animateFor("philtrum")}
      >
        <rect
          x={120}
          y={108}
          width={80}
          height={24}
          fill="transparent"
          stroke="none"
          pointerEvents="all"
          className="cursor-pointer"
        />
        {/* connector: • → 라벨 */}
        <motion.line
          x1={190}
          y1={117}
          x2={162}
          y2={122}
          strokeDasharray="3 3"
          variants={neutralConnectorVariants}
        />
        <motion.circle
          cx={200}
          cy={117}
          r={2.6}
          fill="currentColor"
          stroke="none"
          variants={partVariants}
          style={{ transformOrigin: "200px 117px", transformBox: "fill-box" }}
        />
        <motion.text
          x={152}
          y={124}
          textAnchor="end"
          stroke="none"
          fontFamily='"Pretendard Variable", Pretendard, sans-serif'
          fontWeight={700}
          fontSize={24}
          variants={neutralLabelVariants}
          style={{ transformOrigin: "152px 124px", transformBox: "fill-box" }}
        >
          •
        </motion.text>
      </motion.g>

      {/* ----- Mouth (ㅡ, 음) ----- */}
      <motion.g
        initial="rest"
        whileHover="hover"
        whileTap="hover"
        animate={animateFor("mouth")}
      >
        <rect
          x={180}
          y={120}
          width={100}
          height={20}
          fill="transparent"
          stroke="none"
          pointerEvents="all"
          className="cursor-pointer"
        />
        <motion.line
          x1={218}
          y1={128}
          x2={258}
          y2={130}
          strokeDasharray="3 3"
          variants={connectorVariants(EUM)}
        />
        <motion.line
          x1={186}
          y1={128}
          x2={214}
          y2={128}
          stroke={EUM}
          strokeWidth={2.8}
          variants={partVariants}
          style={{ transformOrigin: "200px 128px", transformBox: "fill-box" }}
        />
        <motion.text
          x={264}
          y={134}
          textAnchor="start"
          stroke="none"
          fontFamily='"Pretendard Variable", Pretendard, sans-serif'
          fontWeight={700}
          fontSize={24}
          variants={labelVariants(EUM)}
          style={{ transformOrigin: "264px 134px", transformBox: "fill-box" }}
        >
          ㅡ
        </motion.text>
      </motion.g>

      {/* Neck — 정적, 호버 비활성 */}
      <rect x={190} y={124} width={20} height={22} rx={3} ry={3} />

      {/* ----- Torso (ㅁ, 음) ----- */}
      <motion.g
        initial="rest"
        whileHover="hover"
        whileTap="hover"
        animate={animateFor("torso")}
      >
        <rect
          x={140}
          y={144}
          width={140}
          height={180}
          fill="transparent"
          stroke="none"
          pointerEvents="all"
          className="cursor-pointer"
        />
        <motion.line
          x1={252}
          y1={235}
          x2={268}
          y2={240}
          strokeDasharray="3 3"
          variants={connectorVariants(EUM)}
        />
        <motion.rect
          x={148}
          y={146}
          width={104}
          height={178}
          rx={5}
          ry={5}
          variants={partVariants}
          style={{ transformOrigin: "200px 235px", transformBox: "fill-box" }}
        />
        <motion.text
          x={272}
          y={244}
          textAnchor="start"
          stroke="none"
          fontFamily='"Pretendard Variable", Pretendard, sans-serif'
          fontWeight={700}
          fontSize={28}
          variants={labelVariants(EUM)}
          style={{ transformOrigin: "272px 244px", transformBox: "fill-box" }}
        >
          ㅁ
        </motion.text>
      </motion.g>

      {/* ----- ㄱ-arm raised (ㄱ, 양) — viewBox 좌측 ----- */}
      <motion.g
        initial="rest"
        whileHover="hover"
        whileTap="hover"
        animate={animateFor("arm")}
      >
        <rect
          x={48}
          y={50}
          width={108}
          height={120}
          fill="transparent"
          stroke="none"
          pointerEvents="all"
          className="cursor-pointer"
        />
        <motion.line
          x1={140}
          y1={100}
          x2={114}
          y2={92}
          strokeDasharray="3 3"
          variants={connectorVariants(YANG)}
        />
        <motion.line
          x1={148}
          y1={154}
          x2={148}
          y2={66}
          strokeWidth={6}
          variants={partVariants}
          style={{ transformOrigin: "148px 110px", transformBox: "fill-box" }}
        />
        <motion.line
          x1={148}
          y1={66}
          x2={188}
          y2={66}
          strokeWidth={6}
          variants={partVariants}
          style={{ transformOrigin: "168px 66px", transformBox: "fill-box" }}
        />
        <motion.text
          x={96}
          y={92}
          textAnchor="middle"
          stroke="none"
          fontFamily='"Pretendard Variable", Pretendard, sans-serif'
          fontWeight={700}
          fontSize={28}
          variants={labelVariants(YANG)}
          style={{ transformOrigin: "96px 92px", transformBox: "fill-box" }}
        >
          ㄱ
        </motion.text>
      </motion.g>

      {/* ----- Legs (ㅅ, 양) — V 형태 ----- */}
      <motion.g
        initial="rest"
        whileHover="hover"
        whileTap="hover"
        animate={animateFor("legs")}
      >
        <rect
          x={120}
          y={324}
          width={160}
          height={260}
          fill="transparent"
          stroke="none"
          pointerEvents="all"
          className="cursor-pointer"
        />
        <motion.line
          x1={200}
          y1={548}
          x2={200}
          y2={566}
          strokeDasharray="3 3"
          variants={connectorVariants(YANG)}
        />
        <motion.line
          x1={200}
          y1={324}
          x2={140}
          y2={540}
          strokeWidth={6}
          variants={partVariants}
          style={{ transformOrigin: "170px 432px", transformBox: "fill-box" }}
        />
        <motion.line
          x1={200}
          y1={324}
          x2={260}
          y2={540}
          strokeWidth={6}
          variants={partVariants}
          style={{ transformOrigin: "230px 432px", transformBox: "fill-box" }}
        />
        <motion.text
          x={200}
          y={582}
          textAnchor="middle"
          stroke="none"
          fontFamily='"Pretendard Variable", Pretendard, sans-serif'
          fontWeight={700}
          fontSize={30}
          variants={labelVariants(YANG)}
          style={{ transformOrigin: "200px 582px", transformBox: "fill-box" }}
        >
          ㅅ
        </motion.text>
      </motion.g>

      {/* ----- ㄴ cameo (ㄴ, 음) — 좌측 하단 앉은 보조 인물 -----
          수직 상체 + 수평 다리 = ㄴ 자형. 메인 인물의 좌측 ㅅ 다리(x=140)와
          간섭 없도록 x≈20–110 영역에 배치. */}
      <motion.g
        initial="rest"
        whileHover="hover"
        whileTap="hover"
        animate={animateFor("nieun")}
      >
        <rect
          x={16}
          y={460}
          width={114}
          height={130}
          fill="transparent"
          stroke="none"
          pointerEvents="all"
          className="cursor-pointer"
        />
        {/* connector: 앉은 인물 → ㄴ 라벨 */}
        <motion.line
          x1={55}
          y1={552}
          x2={55}
          y2={566}
          strokeDasharray="3 3"
          variants={connectorVariants(EUM)}
        />
        {/* 머리 */}
        <motion.circle
          cx={55}
          cy={488}
          r={9}
          variants={partVariants}
          style={{ transformOrigin: "55px 488px", transformBox: "fill-box" }}
        />
        {/* 상체 — ㄴ 수직획 */}
        <motion.line
          x1={55}
          y1={497}
          x2={55}
          y2={540}
          strokeWidth={4}
          variants={partVariants}
          style={{ transformOrigin: "55px 518px", transformBox: "fill-box" }}
        />
        {/* 앉은 다리 — ㄴ 수평획 */}
        <motion.line
          x1={55}
          y1={540}
          x2={102}
          y2={540}
          strokeWidth={4}
          variants={partVariants}
          style={{ transformOrigin: "78px 540px", transformBox: "fill-box" }}
        />
        <motion.text
          x={55}
          y={582}
          textAnchor="middle"
          stroke="none"
          fontFamily='"Pretendard Variable", Pretendard, sans-serif'
          fontWeight={700}
          fontSize={28}
          variants={labelVariants(EUM)}
          style={{ transformOrigin: "55px 582px", transformBox: "fill-box" }}
        >
          ㄴ
        </motion.text>
      </motion.g>
    </svg>
  );
}
