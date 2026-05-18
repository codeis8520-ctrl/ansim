import Image from "next/image";
import { cn } from "@/lib/cn";

/**
 * ConsonantSongSheet — 안심 한글 노래 (자음 14자) 악보.
 *
 * 작사·작곡 김윤규. 사용자 제공 PNG 악보를 그대로 사용.
 * Next/Image 컴포넌트로 width:100% / height:auto 반응형 — 모바일 가로 스크롤 없음.
 */
export interface ConsonantSongSheetProps {
  className?: string;
}

export default function ConsonantSongSheet({
  className,
}: ConsonantSongSheetProps) {
  return (
    <Image
      src="/consonant-song-sheet.png"
      alt="안심 한글 노래 자음 14자 악보 — 작사·작곡 김윤규, 4/4박자 4단 구성"
      width={1400}
      height={700}
      sizes="(max-width: 768px) 100vw, 800px"
      priority={false}
      className={cn("w-full h-auto block rounded-lg", className)}
    />
  );
}
