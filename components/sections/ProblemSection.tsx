"use client";

import { motion } from "framer-motion";
import Container from "@/components/ui/Container";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0 },
};

const lines = [
  "한글을 처음 배우는 사람에게,",
  "가장 큰 벽은 단어나 문법이 아닙니다.",
  "ㄱ, ㄴ, ㅁ, ㅅ, ㅇ을",
  "처음 만나는 그 순간입니다.",
];

const emphasis = "이걸 외우게 할 게 아니라, 알아차리게 해야 합니다.";

export default function ProblemSection() {
  return (
    <section
      id="problem"
      aria-label="문제 제기"
      className="min-h-screen pt-40 pb-20 flex flex-col justify-center"
    >
      <Container>
        <motion.div
          initial="hidden"
          animate="show"
          transition={{ staggerChildren: 0.18 }}
          className="space-y-6 md:space-y-8"
        >
          {lines.map((line, i) => (
            <motion.p
              key={i}
              variants={fadeUp}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="text-3xl md:text-5xl lg:text-6xl font-bold leading-tight text-foreground"
            >
              {line}
            </motion.p>
          ))}
          <motion.p
            variants={fadeUp}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-3xl md:text-5xl lg:text-6xl font-bold leading-tight text-yang"
          >
            {emphasis}
          </motion.p>
        </motion.div>
      </Container>
    </section>
  );
}
