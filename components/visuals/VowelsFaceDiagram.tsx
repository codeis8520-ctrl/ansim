import { cn } from "@/lib/cn";
import { YANG, EUM, FOREGROUND } from "@/lib/colors";

export interface VowelsFaceDiagramProps {
  className?: string;
}

/**
 * VowelsFaceDiagram — 모음 섹션 전용 얼굴 도식.
 *
 * 320×360 viewBox. 안경 쓴 얼굴 + 코(ㅣ 양) + 입(ㅡ 음) + 인중(• 인) + 라벨.
 * Hero의 FaceDiagram과 라벨/안경/색상 정책/viewBox가 모두 다르므로 분리.
 *
 * 코 = yang 오렌지 수직선 (ㅣ).
 * 입 = eum 인디고 수평선 (ㅡ).
 * 인중 = foreground 중성 점 (•).
 * 안경 = foreground/50 — 캐릭터성 부여, 핵심 글리프와 시각 충돌 회피.
 */
export default function VowelsFaceDiagram({
  className,
}: VowelsFaceDiagramProps) {
  const label =
    "얼굴 도식 — 코는 ㅣ(양), 입은 ㅡ(음), 인중은 점(인). 천지인 삼재가 얼굴에 들어 있습니다.";

  return (
    <svg
      role="img"
      aria-label={label}
      viewBox="0 0 320 360"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("text-foreground w-full h-auto", className)}
    >
      <title>{label}</title>

      {/* 얼굴 윤곽 */}
      <ellipse cx={160} cy={170} rx={90} ry={110} />

      {/* 안경 — foreground/50, 약하게 */}
      <g className="text-foreground/50" stroke="currentColor">
        <circle cx={130} cy={150} r={22} />
        <circle cx={190} cy={150} r={22} />
        {/* 안경 다리 — 두 렌즈 사이 짧은 가로선 (코 위) */}
        <line x1={152} y1={150} x2={168} y2={150} />
      </g>

      {/* 코 (ㅣ, 양) — 수직선 */}
      <line
        x1={160}
        y1={180}
        x2={160}
        y2={220}
        stroke={YANG}
        strokeWidth={3}
      />

      {/* 입 (ㅡ, 음) — 수평선 */}
      <line
        x1={135}
        y1={250}
        x2={185}
        y2={250}
        stroke={EUM}
        strokeWidth={3}
      />

      {/* 인중 점 (•, 인) — 중성 */}
      <circle cx={160} cy={234} r={2.5} fill={FOREGROUND} stroke="none" />

      {/* 라벨 — SVG <text> */}
      {/* ㅣ (양) — 코 우측 */}
      <text
        x={200}
        y={200}
        stroke="none"
        fill={YANG}
        fontFamily='"Pretendard Variable", Pretendard, sans-serif'
        fontWeight={700}
        fontSize={20}
        dominantBaseline="middle"
      >
        ㅣ
      </text>
      <text
        x={216}
        y={202}
        stroke="none"
        fill={YANG}
        fontFamily='"Pretendard Variable", Pretendard, sans-serif'
        fontWeight={700}
        fontSize={14}
        dominantBaseline="middle"
      >
        (양)
      </text>

      {/* • (인) — 인중 우측 */}
      <text
        x={200}
        y={234}
        stroke="none"
        fill={FOREGROUND}
        fontFamily='"Pretendard Variable", Pretendard, sans-serif'
        fontWeight={700}
        fontSize={18}
        dominantBaseline="middle"
      >
        •
      </text>
      <text
        x={214}
        y={235}
        stroke="none"
        fill={FOREGROUND}
        fontFamily='"Pretendard Variable", Pretendard, sans-serif'
        fontWeight={700}
        fontSize={14}
        dominantBaseline="middle"
      >
        (인)
      </text>

      {/* ㅡ (음) — 입 우측 */}
      <text
        x={200}
        y={250}
        stroke="none"
        fill={EUM}
        fontFamily='"Pretendard Variable", Pretendard, sans-serif'
        fontWeight={700}
        fontSize={20}
        dominantBaseline="middle"
      >
        ㅡ
      </text>
      <text
        x={218}
        y={252}
        stroke="none"
        fill={EUM}
        fontFamily='"Pretendard Variable", Pretendard, sans-serif'
        fontWeight={700}
        fontSize={14}
        dominantBaseline="middle"
      >
        (음)
      </text>
    </svg>
  );
}
