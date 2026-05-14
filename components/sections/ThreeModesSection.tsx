"use client";

import { motion } from "framer-motion";
import Container from "@/components/ui/Container";
import CombinationCard from "@/components/visuals/CombinationCard";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0 },
};

const glyphPop = {
  hidden: { opacity: 0, scale: 0.7 },
  show: { opacity: 1, scale: 1 },
};

// 마무리 5자 — 순서: ㄱ, ㄴ, ㅁ, ㅅ, ㅇ (BRIEF 마무리 문구 순서 그대로)
const FINAL_GLYPHS: Array<{ glyph: string; polarity: "yang" | "eum" }> = [
  { glyph: "ㄱ", polarity: "yang" },
  { glyph: "ㄴ", polarity: "eum" },
  { glyph: "ㅁ", polarity: "eum" },
  { glyph: "ㅅ", polarity: "yang" },
  { glyph: "ㅇ", polarity: "eum" },
];

export default function ThreeModesSection() {
  return (
    <section
      id="three-modes"
      aria-label="ㄱ과 ㄴ의 세 결합 모드"
      className="min-h-screen pt-40 pb-20 flex flex-col justify-center bg-background-muted"
    >
      <Container>
        <motion.div
          initial="hidden"
          animate="show"
          transition={{ staggerChildren: 0.18 }}
        >
          <motion.h2
            variants={fadeUp}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="text-3xl md:text-5xl lg:text-6xl font-bold leading-tight text-center max-w-3xl mx-auto"
          >
            같은 두 글자, 세 가지 결합 방식
          </motion.h2>

          <motion.p
            variants={fadeUp}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="text-base md:text-lg text-foreground/80 text-center max-w-2xl mx-auto mt-4 md:mt-6"
          >
            ㄱ과 ㄴ을 어떻게 합치느냐에 따라 세 개의 새 자음이 태어납니다. 사람 몸이 그것을 그대로 보여줍니다.
          </motion.p>

          <motion.div
            variants={fadeUp}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mt-12 md:mt-16"
          >
            <CombinationCard
              mode="close-corner"
              result="ㅁ"
              polarity="eum"
              topLabel="직각으로 닫음"
              bottomLabel="몸통의 사각형"
              description="ㄱ과 ㄴ을 직각으로 맞물려 닫으면, 사람의 몸통 모양 ㅁ이 됩니다."
            />
            <CombinationCard
              mode="close-curve"
              result="ㅇ"
              polarity="eum"
              topLabel="곡선으로 닫음"
              bottomLabel="머리의 둥근 원"
              description="ㄱ과 ㄴ의 각을 곡선으로 풀어 닫으면, 사람의 머리 모양 ㅇ이 됩니다."
            />
            <CombinationCard
              mode="open-spread"
              result="ㅅ"
              polarity="yang"
              topLabel="벌림"
              bottomLabel="벌린 두 다리"
              description="ㄱ과 ㄴ을 닫지 않고 벌리면, 두 다리를 벌린 모양 ㅅ이 됩니다."
            />
          </motion.div>

          <motion.div
            variants={fadeUp}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="mt-16 md:mt-24 flex flex-col items-center gap-6"
          >
            <p className="text-xl md:text-2xl font-bold text-foreground/80">
              = 초자음 5개 완성
            </p>
            <motion.div
              initial="hidden"
              animate="show"
              transition={{ staggerChildren: 0.12 }}
              className="flex flex-row items-center gap-4 md:gap-8 text-5xl md:text-7xl font-bold"
            >
              {FINAL_GLYPHS.map(({ glyph, polarity }) => (
                <motion.span
                  key={glyph}
                  variants={glyphPop}
                  transition={{ duration: 0.5, ease: "backOut" }}
                  className={polarity === "yang" ? "text-yang" : "text-eum"}
                >
                  {glyph}
                </motion.span>
              ))}
            </motion.div>
          </motion.div>
        </motion.div>
      </Container>
    </section>
  );
}
