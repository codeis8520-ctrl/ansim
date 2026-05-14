import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: "안심 양·음 한글교육 — 사람의 몸이 곧 한글이다",
  description:
    "외울 것 없이, 자기 몸으로 한글을 발견하는 새로운 교수법. 한글 자음 14자와 모음 10자가 사람의 얼굴과 자세에서 어떻게 자라나는지 5분 만에 이해하세요.",
  openGraph: {
    title: "안심 양·음 한글교육",
    description: "사람의 몸이 곧 한글이다",
    type: "website",
    locale: "ko_KR",
    // og:image / twitter:image는 app/opengraph-image.tsx가 자동으로 채움.
  },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="h-full antialiased">
      <head>
        {/* Pretendard CDN preconnect — render-blocking stylesheet 단축. */}
        <link
          rel="preconnect"
          href="https://cdn.jsdelivr.net"
          crossOrigin="anonymous"
        />
        <link rel="dns-prefetch" href="https://cdn.jsdelivr.net" />
        {/*
          dynamic-subset 변형: 페이지에 실제 출현한 글리프만 서브셋으로 받는
          variable font 묶음. 풀 정적 ~1.2MB → ~수십 KB. font-display: swap 내장.
        */}
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.css"
        />
      </head>
      <body className="min-h-full flex flex-col font-pretendard bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}
