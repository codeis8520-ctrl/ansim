"use client";

import { motion } from "framer-motion";
import Container from "@/components/ui/Container";
import VowelsFaceDiagram from "@/components/visuals/VowelsFaceDiagram";
import PostureIcon, {
  type PostureVariant,
} from "@/components/visuals/PostureIcon";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0 },
};

type Polarity = "yang" | "eum";

interface VowelResult {
  variant: PostureVariant;
  letter: string;
  polarity: Polarity;
}

interface VowelRow {
  baseVariant: PostureVariant;
  basePolarity: Polarity;
  prefixLabel: string;
  results: [VowelResult, VowelResult];
}

const ROWS: VowelRow[] = [
  {
    baseVariant: "standing-base",
    basePolarity: "yang",
    prefixLabel: "(서서) 한 팔 →",
    results: [
      { variant: "standing-arm-right", letter: "ㅏ", polarity: "yang" },
      { variant: "standing-arm-left", letter: "ㅓ", polarity: "eum" },
    ],
  },
  {
    baseVariant: "standing-base",
    basePolarity: "yang",
    prefixLabel: "두 팔 →",
    results: [
      { variant: "standing-arms-right", letter: "ㅑ", polarity: "yang" },
      { variant: "standing-arms-left", letter: "ㅕ", polarity: "eum" },
    ],
  },
  {
    baseVariant: "lying-base",
    basePolarity: "eum",
    prefixLabel: "(누워) 한 팔 →",
    results: [
      { variant: "lying-arm-up", letter: "ㅗ", polarity: "yang" },
      { variant: "lying-arm-down", letter: "ㅜ", polarity: "eum" },
    ],
  },
  {
    baseVariant: "lying-base",
    basePolarity: "eum",
    prefixLabel: "두 팔 →",
    results: [
      { variant: "lying-arms-up", letter: "ㅛ", polarity: "yang" },
      { variant: "lying-arms-down", letter: "ㅠ", polarity: "eum" },
    ],
  },
];

function polarityClass(polarity: Polarity): string {
  return polarity === "yang" ? "text-yang" : "text-eum";
}

function polarityHoverClass(polarity: Polarity): string {
  return polarity === "yang"
    ? "group-hover:text-yang"
    : "group-hover:text-eum";
}

export default function VowelsSection() {
  return (
    <section
      id="vowels"
      aria-label="얼굴 = 모음 10자"
      className="min-h-screen pt-40 pb-20 flex flex-col justify-center"
    >
      <Container>
        <motion.div
          initial="hidden"
          animate="show"
          transition={{ staggerChildren: 0.15 }}
        >
          <motion.h2
            variants={fadeUp}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="text-3xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-[-0.03em]"
          >
            얼굴에는 한글 모음의 시작이 모두 들어 있습니다
          </motion.h2>

          <motion.p
            variants={fadeUp}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="max-w-3xl text-lg md:text-xl text-foreground/80 leading-relaxed mt-6"
          >
            <span className="block">
              코는 위로 선 모양 — 양모음 ㅣ
            </span>
            <span className="block">
              입은 옆으로 누운 모양 — 음모음 ㅡ
            </span>
            <span className="block">그 사이의 점 — 천지인의 인(•)</span>
          </motion.p>

          <motion.p
            variants={fadeUp}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="text-base md:text-lg text-foreground/70 italic mt-4 max-w-3xl"
          >
            세종이 한글을 만들 때 천지인 삼재(•ㅡㅣ)에서 출발했다는 원리가, 지금 거울을 보는 누구에게나 들어 있습니다.
          </motion.p>

          <motion.div
            variants={fadeUp}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="mt-16 grid grid-cols-1 lg:grid-cols-2 gap-12 items-start"
          >
            {/* 좌측 — 얼굴 도식 */}
            <div className="max-w-[280px] md:max-w-[360px] lg:max-w-full mx-auto lg:mx-0">
              <VowelsFaceDiagram />
            </div>

            {/* 우측 — 모음 변환 표 */}
            <ul className="space-y-6">
              {ROWS.map((row, idx) => (
                <li
                  key={idx}
                  className="group rounded-lg p-3 hover:bg-foreground/[0.03] transition-colors"
                >
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-3">
                    {/* 베이스 자세 */}
                    <div
                      className={`w-12 h-12 shrink-0 ${polarityClass(row.basePolarity)}`}
                    >
                      <PostureIcon variant={row.baseVariant} />
                    </div>

                    {/* "→ 한 팔/두 팔" 라벨 */}
                    <span className="text-base md:text-lg text-foreground/75 font-medium">
                      {row.prefixLabel}
                    </span>

                    {/* 결과 모음 2개 */}
                    {row.results.map((result) => (
                      <div
                        key={result.letter}
                        className="flex items-center gap-2"
                      >
                        <div
                          className={`w-12 h-12 shrink-0 text-foreground transition-transform group-hover:scale-110 ${polarityHoverClass(
                            result.polarity
                          )}`}
                        >
                          <PostureIcon variant={result.variant} />
                        </div>
                        <span
                          aria-label={`모음 ${result.letter} — ${
                            result.polarity === "yang" ? "양" : "음"
                          }`}
                          className={`text-3xl md:text-4xl font-bold text-foreground transition-colors ${polarityHoverClass(
                            result.polarity
                          )}`}
                        >
                          {result.letter}
                        </span>
                      </div>
                    ))}
                  </div>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.p
            variants={fadeUp}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="mt-16 text-center text-xl md:text-2xl font-semibold"
          >
            = 모음 10자.{" "}
            <span className="text-yang font-bold">외울 게 아니라</span>{" "}
            <span className="text-eum font-bold">자세로 알아차립니다</span>.
          </motion.p>
        </motion.div>
      </Container>
    </section>
  );
}
