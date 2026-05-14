"use client";

import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import BodyDiagram from "@/components/visuals/BodyDiagram";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0 },
};

export default function HeroSection() {
  return (
    <section
      id="hero"
      aria-label="히어로"
      className="relative min-h-screen min-h-[100svh] flex flex-col items-center justify-center"
    >
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-12 items-center">
          {/* Left: text column with staggered entry */}
          <motion.div
            initial="hidden"
            animate="show"
            transition={{ staggerChildren: 0.1, delayChildren: 0.05 }}
            className="order-2 lg:order-1"
          >
            <motion.p
              variants={fadeUp}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="text-sm tracking-widest text-foreground/70 font-medium"
            >
              안심 양·음 한글교육
            </motion.p>

            <motion.h1
              variants={fadeUp}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="mt-4 text-5xl md:text-6xl lg:text-7xl font-bold tracking-[-0.04em] leading-[1.1]"
            >
              사람의 몸이 곧 한글이다
            </motion.h1>

            <motion.h2
              variants={fadeUp}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="mt-6 text-xl md:text-2xl text-foreground/80 font-medium"
            >
              이미 알고 있는 것으로, 한글을 다시 배웁니다
            </motion.h2>

            <motion.p
              variants={fadeUp}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="mt-6 text-base md:text-lg text-foreground/70 leading-[1.7] max-w-prose"
            >
              코와 입, 차렷과 경례, 누움과 앉기 — 우리 몸의 자연스러운 모양과 자세가 한글 자음과 모음 24자 전체를 만듭니다. 외울 것은 없습니다. 알아차릴 뿐입니다.
            </motion.p>

            <motion.div
              variants={fadeUp}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="mt-10 flex flex-col sm:flex-row gap-4"
            >
              <Button
                as="a"
                href="#problem"
                aria-label="원리 보기, 다음 섹션으로 이동"
                variant="primary"
                size="lg"
              >
                원리 보기 ↓
              </Button>
              <Button
                variant="secondary"
                size="lg"
                disabled
                aria-disabled="true"
                title="준비 중"
              >
                방법론 영상 보기
              </Button>
            </motion.div>
          </motion.div>

          {/* Right: SVG figure */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.3 }}
            className="order-1 lg:order-2 mx-auto w-1/2 max-w-[200px] lg:w-full lg:max-w-[300px]"
          >
            <BodyDiagram />
          </motion.div>
        </div>
      </Container>

      {/* ChevronDown pulse — bottom-center scroll affordance */}
      <a
        href="#problem"
        aria-label="아래로 스크롤"
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          className="text-eum/60"
        >
          <ChevronDown size={32} aria-hidden="true" />
        </motion.div>
      </a>
    </section>
  );
}
