"use client";

import { motion } from "framer-motion";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import { MAILTO_HREF } from "@/lib/constants";

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
 * FounderSection — 페이지 정서적 정점. 김윤규 장로(안심)를 사람으로 등장시켜
 * 24자 증명 흐름의 신뢰 앵커 역할. 사진 placeholder + 약력 + 본문 두 단락 + CTA 2개.
 * 본문 두 단락은 BRIEF.md 180-182 verbatim.
 */
export default function FounderSection() {
  return (
    <section
      id="founder"
      aria-label="창시자 소개"
      className="min-h-screen pt-24 pb-20 flex flex-col justify-center bg-background"
    >
      <Container>
        <motion.div
          variants={parentVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-1 lg:grid-cols-[1fr_1.4fr] gap-12 lg:gap-20 items-center"
        >
          {/* Left: photo placeholder */}
          <motion.div
            variants={fadeUp}
            className="order-1 mx-auto lg:mx-0"
          >
            <div
              role="img"
              aria-label="김윤규 장로 사진 (준비 중)"
              className="aspect-[4/5] w-full max-w-[360px] rounded-2xl bg-gradient-to-br from-eum/15 to-yang/10 flex flex-col items-center justify-center gap-3"
            >
              <span className="text-6xl md:text-7xl font-bold text-foreground/40">
                안심
              </span>
              <span className="text-base md:text-lg text-foreground/40 tracking-widest">
                金 潤奎
              </span>
            </div>
          </motion.div>

          {/* Right: text column (shares parent stagger via own child variants) */}
          <div className="order-2 flex flex-col">
            <motion.p
              variants={fadeUp}
              className="text-xs md:text-sm font-medium tracking-widest text-yang uppercase"
            >
              Founder
            </motion.p>

            <motion.h2
              variants={fadeUp}
              className="mt-2 text-3xl md:text-4xl font-bold text-foreground"
            >
              김윤규 (안심)
            </motion.h2>

            <motion.p
              variants={fadeUp}
              className="mt-3 text-sm md:text-base text-foreground/60"
            >
              교육학 석사 · 정교사 · 전 대학·대학원 강의 · 40년 외길 연구
            </motion.p>

            <motion.p
              variants={fadeUp}
              className="mt-6 text-base md:text-lg text-foreground/80 leading-relaxed"
            >
              40여 년 전, 어머니께 한글을 가르치다 깨달았습니다. 글자를 외우게 하는 것은 자식의 도리가 아니라는 것을. 그 후 한 평생을 한글에 바쳐, 누구나 자기 몸을 보면서 한글을 알아차릴 수 있는 양·음 교수법을 다듬어 왔습니다.
            </motion.p>

            <motion.p
              variants={fadeUp}
              className="mt-4 text-base md:text-lg text-foreground/80 leading-relaxed"
            >
              이 작업이 더 많은 학습자, 특히 한글이라는 문이 너무 무겁게 느껴졌던 이들에게 — 처음 글자를 만나는 아이든, 다른 언어를 모어로 가진 어른이든 — 가볍게 열려, 그들의 첫 한글 경험이 짓누름이 아니라 발견이 되기를 바랍니다.
            </motion.p>

            <motion.div
              variants={fadeUp}
              className="mt-8 flex flex-col sm:flex-row gap-3"
            >
              <Button
                variant="secondary"
                size="lg"
                disabled
                aria-disabled="true"
                title="준비 중"
              >
                방법론 영상 보기
              </Button>
              <Button
                as="a"
                href={MAILTO_HREF}
                variant="primary"
                size="lg"
                aria-label="이메일로 소식 받기, 메일 클라이언트 열림"
              >
                이메일로 소식 받기
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
