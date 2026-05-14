import { cn } from "@/lib/cn";

export interface BodyDiagramProps {
  className?: string;
}

/**
 * BodyDiagram — Hero 전신 도식.
 * 모든 신체 부위를 외곽선 도형으로 표현 — 머리는 원, 몸통·팔·다리는 직사각형, 발은 타원.
 * 시각 언어 시스템: 2px currentColor stroke, eum 본체, yang ㅣ코/ㅡ입.
 * Hero에서는 라벨이나 자모 도식을 노출하지 않음 — ㄱ 거수, ㅅ 다리, ㅇ 손 같은 강한
 * 아이콘 요소는 후속 섹션(BigIdea, ConsonantRoots, ThreeModes)에서 단계적으로 reveal.
 */
export default function BodyDiagram({ className }: BodyDiagramProps) {
  const label = "사람 전신 도식. 코는 ㅣ, 입은 ㅡ, 몸통은 ㅁ을 형성합니다.";
  return (
    <svg
      role="img"
      aria-label={label}
      viewBox="0 0 320 560"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("text-eum w-full h-auto", className)}
    >
      <title>{label}</title>

      {/* Head — 둥근 원 */}
      <circle cx={160} cy={72} r={44} />

      {/* Eyes — 점 두 개 */}
      <circle cx={144} cy={62} r={2.6} fill="currentColor" stroke="none" />
      <circle cx={176} cy={62} r={2.6} fill="currentColor" stroke="none" />

      {/* Yang accents — 코 ㅣ, 입 ㅡ */}
      <g className="text-yang" stroke="currentColor" strokeWidth={2.8}>
        <line x1={160} y1={78} x2={160} y2={98} />
        <line x1={146} y1={110} x2={174} y2={110} />
      </g>

      {/* Neck — 짧은 직사각형 */}
      <rect x={150} y={116} width={20} height={24} rx={3} ry={3} />

      {/* Torso — 분명한 세로 직사각형 ㅁ. 높이가 폭의 약 2배. */}
      <rect x={108} y={140} width={104} height={210} rx={5} ry={5} />

      {/* Arms — 어깨 코너 기준으로 18° 바깥쪽 회전. 자연스러운 대각선 벌림. */}
      <rect
        x={90}
        y={152}
        width={18}
        height={184}
        rx={4}
        ry={4}
        transform="rotate(18 108 152)"
      />
      <rect
        x={212}
        y={152}
        width={18}
        height={184}
        rx={4}
        ry={4}
        transform="rotate(-18 212 152)"
      />

      {/* Legs — 직사각형, 몸통 아래에서 똑바로 내려옴. 발 사이 좁은 간격. */}
      <rect x={130} y={350} width={22} height={170} rx={4} ry={4} />
      <rect x={168} y={350} width={22} height={170} rx={4} ry={4} />

      {/* Feet — 작은 타원, 양 다리 아래 */}
      <ellipse cx={141} cy={528} rx={20} ry={8} />
      <ellipse cx={179} cy={528} rx={20} ry={8} />
    </svg>
  );
}
