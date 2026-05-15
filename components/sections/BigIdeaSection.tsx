"use client";

import { motion } from "framer-motion";
import { MousePointer2 } from "lucide-react";
import Container from "@/components/ui/Container";
import AnnotatedBodyDiagram from "@/components/visuals/AnnotatedBodyDiagram";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0 },
};

export default function BigIdeaSection() {
  return (
    <section
      id="big-idea"
      aria-label="큰 발상"
      className="min-h-screen pt-40 pb-20 bg-background-muted flex flex-col justify-center"
    >
      <Container>
        <motion.div
          initial="hidden"
          animate="show"
          transition={{ staggerChildren: 0.18 }}
          className="flex flex-col items-center text-center"
        >
          <motion.p
            variants={fadeUp}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="text-base md:text-lg leading-relaxed text-foreground/70 max-w-2xl mx-auto mb-8 md:mb-10"
          >
            한글교육을 더이상 주입식·암기식으로 힘들고 어렵게 익힐 필요가 없습니다. 누구나 알고 있는 사람의 형상으로 한글을 연상해서 기억하면, 더욱 쉽고 간단하게 한글을 익힐 수 있습니다.
          </motion.p>

          <motion.h2
            variants={fadeUp}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight tracking-[-0.03em]"
          >
            <span className="block">사람의 얼굴과 몸 안에</span>
            <span className="block">한글이 전부 들어 있습니다</span>
          </motion.h2>

          <motion.p
            variants={fadeUp}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="mt-8 text-lg md:text-xl leading-relaxed text-foreground/80 max-w-2xl mx-auto"
          >
            한글 모음 10자는 얼굴에서, 자음 14자는 몸의 자세에서 태어납니다. 학습자는 자기 몸을 들여다보면서 글자를 발견합니다. 외부에서 주입되는 정보가 아니라, 이미 가진 것의 재발견입니다.
          </motion.p>

          <motion.div
            variants={fadeUp}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="mt-14 w-full max-w-[320px] md:max-w-[420px] lg:max-w-[480px] mx-auto text-foreground"
          >
            <AnnotatedBodyDiagram />
          </motion.div>

          <motion.p
            variants={fadeUp}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="mt-6 text-sm text-foreground/70 flex items-center justify-center gap-2"
          >
            <MousePointer2 size={14} aria-hidden="true" />
            각 부위에 마우스를 올리거나 탭하면 한글이 드러납니다
          </motion.p>
        </motion.div>
      </Container>
    </section>
  );
}
