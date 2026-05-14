"use client";

import { motion } from "framer-motion";
import Container from "@/components/ui/Container";
import PostureMorphGiyeok from "@/components/visuals/PostureMorphGiyeok";
import PostureMorphNieun from "@/components/visuals/PostureMorphNieun";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0 },
};

export default function ConsonantRootsSection() {
  return (
    <section
      id="consonant-roots"
      aria-label="자음의 두 뿌리"
      className="min-h-screen pt-40 pb-20 flex flex-col justify-center bg-background"
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
            몸의 두 자세에서 자음이 태어납니다
          </motion.h2>

          <motion.div
            variants={fadeUp}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 mt-12 md:mt-16"
          >
            {/* 좌측 — ㄱ */}
            <div className="flex flex-col items-center text-center gap-4">
              <PostureMorphGiyeok className="w-full max-w-[240px]" />
              <p className="text-xl md:text-2xl font-bold">
                차렷 + 경례 = <span className="text-yang">ㄱ</span> (양자음)
              </p>
              <p className="text-foreground/80 max-w-xs">
                서서 거수 경례하는 팔의 모양. 한글 자음의 양의 뿌리.
              </p>
            </div>

            {/* 우측 — ㄴ */}
            <div className="flex flex-col items-center text-center gap-4">
              <PostureMorphNieun className="w-full max-w-[240px]" />
              <p className="text-xl md:text-2xl font-bold">
                누움 + 앉음 = <span className="text-eum">ㄴ</span> (음자음)
              </p>
              <p className="text-foreground/80 max-w-xs">
                누웠다가 앉는 다리의 모양. 한글 자음의 음의 뿌리.
              </p>
            </div>
          </motion.div>

          <motion.p
            variants={fadeUp}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="text-2xl md:text-3xl font-bold text-center mt-16 md:mt-24 max-w-2xl mx-auto"
          >
            단 두 자세. 여기서 자음 14자가 모두 자라납니다.
          </motion.p>
        </motion.div>
      </Container>
    </section>
  );
}
