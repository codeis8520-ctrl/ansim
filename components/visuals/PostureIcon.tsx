import { cn } from "@/lib/cn";

export type PostureVariant =
  | "standing-base"
  | "standing-arm-right"
  | "standing-arm-left"
  | "standing-arms-right"
  | "standing-arms-left"
  | "lying-base"
  | "lying-arm-up"
  | "lying-arm-down"
  | "lying-arms-up"
  | "lying-arms-down";

export interface PostureIconProps {
  variant: PostureVariant;
  className?: string;
}

/**
 * PostureIcon — 모음 10자에 대응하는 막대 인간 글리프.
 *
 * 80×80 viewBox. currentColor stroke 2px. 정적 SVG (no client directive).
 * 다리는 의도적으로 생략 — 모음 글리프와의 직접 대응이 핵심.
 *
 * standing 계열: 몸통 수직선. 머리는 상단.
 * lying 계열: 몸통 수평선. 머리는 좌측.
 * 한 팔 = 직선 1개. 두 팔 = 짧은 평행 직선 2개 (= ㅑㅕㅛㅠ의 두 획).
 * 팔 방향 = 한글 모음 획 방향 (ㅏ=오, ㅓ=좌, ㅗ=위, ㅜ=아래).
 */
export default function PostureIcon({
  variant,
  className,
}: PostureIconProps) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 80 80"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("w-full h-full", className)}
    >
      {renderPosture(variant)}
    </svg>
  );
}

function renderPosture(variant: PostureVariant) {
  // standing 계열: 머리 (40, 16) 작은 원, 몸통 (40, 24) → (40, 64) 수직선
  // 팔 부착점 (40, 38) — 몸통 약 1/3 지점
  // 한 팔 길이 18, 두 팔 짧은 길이 14, 두 팔 간격 10 (위/아래 한 쌍)
  const STAND_HEAD = (
    <circle cx={40} cy={16} r={6} />
  );
  const STAND_BODY = (
    <line x1={40} y1={24} x2={40} y2={64} />
  );

  // lying 계열: 머리 (16, 40) 좌측 원, 몸통 (24, 40) → (64, 40) 수평선
  // 팔 부착점 (38, 40) — 몸통 약 1/3 지점 (머리 가까운 쪽)
  const LIE_HEAD = (
    <circle cx={16} cy={40} r={6} />
  );
  const LIE_BODY = (
    <line x1={24} y1={40} x2={64} y2={40} />
  );

  switch (variant) {
    case "standing-base":
      return (
        <>
          {STAND_HEAD}
          {STAND_BODY}
        </>
      );
    case "standing-arm-right":
      return (
        <>
          {STAND_HEAD}
          {STAND_BODY}
          {/* ㅏ — 오른쪽으로 한 팔 */}
          <line x1={40} y1={38} x2={58} y2={38} />
        </>
      );
    case "standing-arm-left":
      return (
        <>
          {STAND_HEAD}
          {STAND_BODY}
          {/* ㅓ — 왼쪽으로 한 팔 */}
          <line x1={40} y1={38} x2={22} y2={38} />
        </>
      );
    case "standing-arms-right":
      return (
        <>
          {STAND_HEAD}
          {STAND_BODY}
          {/* ㅑ — 오른쪽으로 두 팔 (위/아래 한 쌍) */}
          <line x1={40} y1={33} x2={54} y2={33} />
          <line x1={40} y1={43} x2={54} y2={43} />
        </>
      );
    case "standing-arms-left":
      return (
        <>
          {STAND_HEAD}
          {STAND_BODY}
          {/* ㅕ — 왼쪽으로 두 팔 (위/아래 한 쌍) */}
          <line x1={40} y1={33} x2={26} y2={33} />
          <line x1={40} y1={43} x2={26} y2={43} />
        </>
      );
    case "lying-base":
      return (
        <>
          {LIE_HEAD}
          {LIE_BODY}
        </>
      );
    case "lying-arm-up":
      return (
        <>
          {LIE_HEAD}
          {LIE_BODY}
          {/* ㅗ — 위로 한 팔 */}
          <line x1={38} y1={40} x2={38} y2={22} />
        </>
      );
    case "lying-arm-down":
      return (
        <>
          {LIE_HEAD}
          {LIE_BODY}
          {/* ㅜ — 아래로 한 팔 */}
          <line x1={38} y1={40} x2={38} y2={58} />
        </>
      );
    case "lying-arms-up":
      return (
        <>
          {LIE_HEAD}
          {LIE_BODY}
          {/* ㅛ — 위로 두 팔 (좌/우 한 쌍) */}
          <line x1={33} y1={40} x2={33} y2={26} />
          <line x1={43} y1={40} x2={43} y2={26} />
        </>
      );
    case "lying-arms-down":
      return (
        <>
          {LIE_HEAD}
          {LIE_BODY}
          {/* ㅠ — 아래로 두 팔 (좌/우 한 쌍) */}
          <line x1={33} y1={40} x2={33} y2={54} />
          <line x1={43} y1={40} x2={43} y2={54} />
        </>
      );
  }
}
