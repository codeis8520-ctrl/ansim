"use client";

import { motion } from "framer-motion";
import Container from "@/components/ui/Container";
import ConsonantTree from "@/components/visuals/ConsonantTree";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: "easeOut" as const },
  },
};

const parentVariants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.18 },
  },
};

/**
 * 14자 자음 enumeration 시각화 + 마무리 강조 박스. 사용자 핵심 비판질문
 * "14자가 다 표현된다는 설득력은 어디서?"의 페이지 차원 답변.
 */

// 마무리 박스 14자 — 양/음 + 그룹 (초자음/+1획/+2획) 메타.
type Polarity = "yang" | "eum";
interface FinalGlyph {
  glyph: string;
  polarity: Polarity;
}

const FINAL_INITIAL: FinalGlyph[] = [
  { glyph: "ㄱ", polarity: "yang" },
  { glyph: "ㄴ", polarity: "eum" },
  { glyph: "ㅁ", polarity: "eum" },
  { glyph: "ㅅ", polarity: "yang" },
  { glyph: "ㅇ", polarity: "eum" },
];
const FINAL_PLUS1: FinalGlyph[] = [
  { glyph: "ㅋ", polarity: "yang" },
  { glyph: "ㄷ", polarity: "eum" },
  { glyph: "ㅂ", polarity: "eum" },
  { glyph: "ㅈ", polarity: "yang" },
  { glyph: "ㅎ", polarity: "eum" },
];
const FINAL_PLUS2: FinalGlyph[] = [
  { glyph: "ㄹ", polarity: "yang" },
  { glyph: "ㅌ", polarity: "eum" },
  { glyph: "ㅍ", polarity: "eum" },
  { glyph: "ㅊ", polarity: "yang" },
];

const polarityClass = (p: Polarity) => (p === "yang" ? "text-yang" : "text-eum");

function GlyphGroup({ glyphs }: { glyphs: FinalGlyph[] }) {
  return (
    <span className="inline-flex items-center gap-x-3">
      {glyphs.map((g) => (
        <span key={g.glyph} className={polarityClass(g.polarity)}>
          {g.glyph}
        </span>
      ))}
    </span>
  );
}

export default function ConsonantTreeSection() {
  return (
    <section
      id="consonant-tree"
      aria-label="14자 자음 트리"
      className="min-h-screen pt-40 pb-20 flex flex-col justify-center bg-background"
    >
      <Container>
        <motion.div
          variants={parentVariants}
          initial="hidden"
          animate="show"
        >
          <motion.h2
            variants={fadeUp}
            className="text-3xl md:text-5xl lg:text-6xl font-bold leading-tight text-center max-w-4xl mx-auto"
          >
            규칙 단 두 개로 14자 모두가 자라납니다
          </motion.h2>

          <motion.p
            variants={fadeUp}
            className="text-base md:text-lg text-foreground/80 text-center max-w-2xl mx-auto mt-4 md:mt-6"
          >
            초자음 5개 각각에 획 하나(+1) 또는 획 둘(+2)을 더하면, 한글 자음 14자 전체가 완성됩니다.
          </motion.p>

          <motion.div
            variants={fadeUp}
            className="mt-12 md:mt-16 mx-auto w-full max-w-[800px]"
          >
            <ConsonantTree />
          </motion.div>

          {/* 하단 강조 박스 */}
          <motion.div
            variants={fadeUp}
            className="mt-16 md:mt-24 mx-auto max-w-3xl p-8 md:p-10 rounded-2xl bg-background-muted border border-foreground/10"
          >
            <div className="text-3xl md:text-4xl font-bold flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
              <GlyphGroup glyphs={FINAL_INITIAL} />
              <span className="text-foreground/20" aria-hidden="true">|</span>
              <GlyphGroup glyphs={FINAL_PLUS1} />
              <span className="text-foreground/20" aria-hidden="true">|</span>
              <GlyphGroup glyphs={FINAL_PLUS2} />
            </div>
            <p className="text-base md:text-lg text-foreground/90 text-center mt-6 md:mt-8 leading-relaxed">
              14자 = 따로 외우는 14개가 아니라,{" "}
              <span className="font-bold text-foreground">2 뿌리 + 3 결합 + 2 획 추가</span>
              의 한 흐름입니다.
            </p>
          </motion.div>
        </motion.div>
      </Container>
    </section>
  );
}
