"use client";

import { motion } from "framer-motion";
import Container from "@/components/ui/Container";
import NumberGlyph from "@/components/visuals/NumberGlyph";
import DigitGlyph, { type DigitValue } from "@/components/visuals/DigitGlyph";

const YANG_DIGITS: DigitValue[] = [1, 2, 3, 4, 5];
const EUM_DIGITS: DigitValue[] = [6, 7, 8, 9, 0];

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
 * NumbersSection — 양·음 한글숫자 보너스 섹션. 24자 증명 종료 후 시스템
 * 일관성을 가볍게 보여주는 코다. min-h-screen 미사용 (보너스 톤 — 본문
 * 자연 높이 + 적절한 padding으로 한 화면에 안착).
 */
export default function NumbersSection() {
  return (
    <section
      id="numbers"
      aria-label="양·음 한글숫자"
      className="pt-24 md:pt-32 pb-20 md:pb-24 bg-background-muted"
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
            숫자도 같은 원리로
          </motion.h2>

          <motion.p
            variants={fadeUp}
            className="text-base md:text-lg text-foreground/80 text-center max-w-2xl mx-auto mt-4 md:mt-6"
          >
            이 시스템은 한글 자모음에서 그치지 않습니다. 숫자 0부터 9까지도 같은 양·음 구조로 새롭게 표현됩니다.
          </motion.p>

          <motion.div
            variants={fadeUp}
            className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 lg:gap-10 mt-12 md:mt-16"
          >
            {/* 양수 카드 */}
            <div className="flex flex-col items-center text-center gap-4 p-6 md:p-8 rounded-2xl bg-background border border-foreground/10">
              <div className="w-full max-w-[240px] text-yang">
                <NumberGlyph variant="yang" />
              </div>
              <p className="text-lg md:text-xl font-bold text-yang">
                양수 1·2·3·4·5
              </p>
            </div>

            {/* 음수 카드 */}
            <div className="flex flex-col items-center text-center gap-4 p-6 md:p-8 rounded-2xl bg-background border border-foreground/10">
              <div className="w-full max-w-[240px] text-eum">
                <NumberGlyph variant="eum" />
              </div>
              <p className="text-lg md:text-xl font-bold text-eum">
                음수 6·7·8·9·0
              </p>
            </div>
          </motion.div>

          <motion.p
            variants={fadeUp}
            className="text-base md:text-lg text-foreground/80 text-center max-w-3xl mx-auto leading-relaxed mt-12 md:mt-16"
          >
            W는 하늘에서 출발해 땅으로 내려왔다 다시 올라가며 1·2·3·4를 한 글자에 담습니다. △은 양의 완성 — 5. M은 땅에서 출발해 하늘로 올라갔다 다시 내려오며 6·7·8·9를 담습니다. ○은 음의 완성 — 0. 획 수가 그대로 숫자의 값입니다.
          </motion.p>

          {/* 각론 — 1~10 개별 글리프 */}
          <motion.div
            variants={fadeUp}
            className="mt-16 md:mt-24"
          >
            <h3 className="text-2xl md:text-3xl font-bold text-center">
              각론 — 0부터 9까지, 한 자씩
            </h3>
            <p className="text-base md:text-lg text-foreground/80 text-center max-w-2xl mx-auto mt-3 md:mt-4">
              획을 하나씩 더할 때마다 값이 1씩 올라갑니다. 한 글자, 한 획,
              한 숫자.
            </p>

            <div className="mt-8 md:mt-12 grid grid-cols-1 gap-6 md:gap-8">
              {/* 양 행 — 1·2·3·4·5 */}
              <div className="p-4 md:p-6 rounded-2xl bg-background border border-foreground/10">
                <p className="text-sm md:text-base font-bold text-yang text-center mb-3 md:mb-4">
                  양 — W 누적 + △
                </p>
                <div className="grid grid-cols-5 gap-2 md:gap-4 max-w-2xl mx-auto">
                  {YANG_DIGITS.map((d) => (
                    <div
                      key={d}
                      className="aspect-[11/13] w-full max-w-[110px] mx-auto"
                    >
                      <DigitGlyph value={d} />
                    </div>
                  ))}
                </div>
              </div>

              {/* 음 행 — 6·7·8·9·0 */}
              <div className="p-4 md:p-6 rounded-2xl bg-background border border-foreground/10">
                <p className="text-sm md:text-base font-bold text-eum text-center mb-3 md:mb-4">
                  음 — M 누적 + ○
                </p>
                <div className="grid grid-cols-5 gap-2 md:gap-4 max-w-2xl mx-auto">
                  {EUM_DIGITS.map((d) => (
                    <div
                      key={d}
                      className="aspect-[11/13] w-full max-w-[110px] mx-auto"
                    >
                      <DigitGlyph value={d} />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <p className="text-sm md:text-base text-foreground/70 text-center max-w-3xl mx-auto leading-relaxed mt-8 md:mt-10 italic">
              1획 = 1, 2획 = 2, … 4획이 모이면 W(=4) 또는 M(=9). 그 다음 완성
              부호 △(5) · ○(0)으로 양·음이 닫힙니다.
            </p>
          </motion.div>
        </motion.div>
      </Container>
    </section>
  );
}
