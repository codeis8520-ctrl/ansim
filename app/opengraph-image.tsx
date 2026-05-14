import { ImageResponse } from "next/og";

// Next.js OG image conventions: file-level exports describe the route output.
// nodejs runtime → static prerender (Next.js OG가 빌드 시점에 1회 생성).
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "안심 양·음 한글교육 — 사람의 몸이 곧 한글이다";

/**
 * 동적 OG 이미지 — 1200×630 PNG.
 *
 * Sprint 1 시점에 /og-image.png placeholder 참조가 비어 있던 carryover 해소.
 * 시스템 sans-serif만 사용 (Pretendard CDN fetch는 ImageResponse 안에서 복잡 →
 * 시각 acceptable로 lock). 색상은 globals.css @theme 토큰의 hex 그대로.
 *
 * Next.js App Router가 이 파일을 인식해 자동으로 og:image / twitter:image
 * 메타 태그를 채워준다. layout.tsx에서 images 배열을 명시할 필요 없음.
 */
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#FAF8F5",
          color: "#1A1A1A",
          fontFamily:
            "ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, 'Apple SD Gothic Neo', 'Noto Sans KR', sans-serif",
          padding: "80px",
        }}
      >
        <div
          style={{
            fontSize: 36,
            fontWeight: 500,
            letterSpacing: "0.06em",
            opacity: 0.7,
            marginBottom: 48,
          }}
        >
          안심 양·음 한글교육
        </div>
        <div
          style={{
            fontSize: 96,
            fontWeight: 800,
            lineHeight: 1.15,
            textAlign: "center",
            letterSpacing: "-0.02em",
          }}
        >
          사람의 몸이 곧 한글이다
        </div>
      </div>
    ),
    { ...size },
  );
}
