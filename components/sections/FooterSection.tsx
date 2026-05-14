import Container from "@/components/ui/Container";
import { MAILTO_HREF } from "@/lib/constants";

/**
 * FooterSection — 사이트 닫음. 미니멀, 3단 grid. 모션 없음 → 서버 컴포넌트.
 * 메뉴 anchor: "소개" → #big-idea, "영상" → 비활성 placeholder, "문의" → MAILTO_HREF
 * (Founder primary CTA와 동일 — 인입 메일이 한 thread로 모임).
 * 소셜 아이콘 2개는 비활성 placeholder (실 계정 URL 없음).
 */
export default function FooterSection() {
  return (
    <footer
      aria-label="사이트 푸터"
      className="bg-background-muted pt-12 md:pt-16 pb-10"
    >
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          {/* Left: lab name */}
          <div>
            <p className="text-base font-bold text-foreground">
              안심 양·음 한글교육 연구소
            </p>
            <p className="text-sm text-foreground/70 mt-1">
              사람의 몸이 곧 한글이다
            </p>
          </div>

          {/* Center: menu */}
          <nav
            aria-label="푸터 메뉴"
            className="md:flex md:justify-center"
          >
            <ul className="flex flex-col gap-2 md:items-center md:text-center">
              <li>
                <a
                  href="#big-idea"
                  className="text-sm text-foreground/70 hover:text-foreground transition-colors"
                >
                  소개
                </a>
              </li>
              <li>
                <span
                  aria-disabled="true"
                  title="준비 중"
                  className="text-sm text-foreground/30 cursor-not-allowed"
                >
                  영상
                </span>
              </li>
              <li>
                <a
                  href={MAILTO_HREF}
                  className="text-sm text-foreground/70 hover:text-foreground transition-colors"
                >
                  문의
                </a>
              </li>
            </ul>
          </nav>

          {/* Right: copyright + social */}
          <div className="flex flex-col md:items-end md:text-right">
            <p className="text-sm text-foreground/70">
              © 2026 안심 양·음 한글교육
            </p>
            <div className="flex gap-3 mt-3">
              <span
                role="img"
                aria-label="유튜브 (준비 중)"
                title="준비 중"
                className="text-foreground/30 cursor-not-allowed"
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <rect x="2" y="5" width="20" height="14" rx="3" />
                  <path d="M10 9l5 3-5 3V9z" fill="currentColor" stroke="none" />
                </svg>
              </span>
              <span
                role="img"
                aria-label="인스타그램 (준비 중)"
                title="준비 중"
                className="text-foreground/30 cursor-not-allowed"
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <rect x="3" y="3" width="18" height="18" rx="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" stroke="none" />
                </svg>
              </span>
            </div>
          </div>
        </div>
      </Container>
    </footer>
  );
}
