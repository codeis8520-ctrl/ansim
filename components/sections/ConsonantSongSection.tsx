"use client";

import { motion } from "framer-motion";
import Container from "@/components/ui/Container";
import ConsonantSongSheet from "@/components/visuals/ConsonantSongSheet";

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
 * 안심 한글 노래 (자음 14자) — 작사·작곡 김윤규.
 * 아리랑 가락 위에 14자 자음을 얹어 자음 트리 마무리 후 음악적 코다로 마감.
 * 손글씨 악보를 그대로 깔끔하게 SVG로 새로 그려 보여준다.
 */
export default function ConsonantSongSection() {
  return (
    <section
      id="consonant-song"
      aria-label="안심 한글 노래 자음 14자"
      className="pt-24 md:pt-32 pb-24 md:pb-28 bg-background-muted"
    >
      <Container>
        <motion.div
          variants={parentVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
        >
          <motion.h2
            variants={fadeUp}
            className="text-3xl md:text-5xl lg:text-6xl font-bold leading-tight text-center max-w-3xl mx-auto"
          >
            자음 14자, 노래로 한 번에
          </motion.h2>

          <motion.p
            variants={fadeUp}
            className="text-base md:text-lg text-foreground/80 text-center max-w-2xl mx-auto mt-4 md:mt-6"
          >
            아리랑 가락 위에 14자 자음을 그대로 얹었습니다. 외우려 들지 말고
            한 번 따라 부르면, 자음 전체가 입에 붙습니다.
          </motion.p>

          <motion.div
            variants={fadeUp}
            className="mt-12 md:mt-16 mx-auto max-w-4xl p-6 md:p-10 rounded-2xl bg-background border border-foreground/10 shadow-sm"
          >
            <div className="flex flex-col items-center text-center gap-1 mb-6 md:mb-8">
              <p className="text-xl md:text-2xl font-bold">
                안심 한글 노래{" "}
                <span className="text-foreground/60 font-medium">(자음 14자)</span>
              </p>
              <p className="text-sm md:text-base text-foreground/60">
                작사 · 작곡 김윤규 &nbsp;·&nbsp; 가락: 아리랑
              </p>
            </div>

            <div className="overflow-x-auto">
              <div className="min-w-[640px] md:min-w-0">
                <ConsonantSongSheet />
              </div>
            </div>
          </motion.div>

          <motion.p
            variants={fadeUp}
            className="text-base md:text-lg text-foreground/80 text-center max-w-3xl mx-auto leading-relaxed mt-10 md:mt-14"
          >
            <span className="text-yang font-bold">가 카 라</span>는 ㄱ 가지,{" "}
            <span className="text-eum font-bold">나 다 타</span>는 ㄴ 가지,{" "}
            <span className="text-eum font-bold">마 바 파</span>는 ㅁ 가지,{" "}
            <span className="text-yang font-bold">사 자 차</span>는 ㅅ 가지,{" "}
            <span className="text-eum font-bold">아 하</span>는 ㅇ 가지 —
            트리 그대로 노래에 흐릅니다.
          </motion.p>
        </motion.div>
      </Container>
    </section>
  );
}
