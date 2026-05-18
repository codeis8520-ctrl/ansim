"use client";

import { cn } from "@/lib/cn";

/**
 * ConsonantSongSheet — 안심 한글 노래 (자음 14자) 깔끔한 디지털 악보.
 *
 * 작사·작곡 김윤규. 가락은 전래 아리랑 흐름을 따른다.
 * 4단 보표(높은음자리표, F장조 1♭, 4/4박자), 각 단 11~12 음표 + 가사.
 *
 * 보표 좌표계 — 한 단 내부:
 *   y=0 이 맨 윗줄(F5). 줄 간격 LINE_GAP=8 (총 보표 높이 32).
 *   각 음높이는 PITCH_Y 매핑. 위/아래 덧줄은 노트 헤드 위치로 자동 계산.
 *
 * 스템 방향: 가운데 줄(B4, y=16) 위쪽 음표는 스템 아래, 아래쪽 음표는 스템 위.
 * 8분음표 두 개는 빔으로 연결.
 */

const LINE_GAP = 8;
const STAFF_HEIGHT = LINE_GAP * 4; // 32
const NOTE_RX = 4.2;
const NOTE_RY = 3.0;
const STEM_LEN = 26;
const STEM_OFFSET = 4; // 노트헤드 가장자리에서 스템까지

// 음높이 → y. 한 칸(줄/줄사이) = LINE_GAP/2 = 4.
const PITCH_Y: Record<string, number> = {
  C6: -12,
  B5: -10,
  A5: -8,
  G5: -4,
  F5: 0,   // 5번 줄(맨 위)
  E5: 4,
  D5: 8,   // 4번 줄
  C5: 12,
  B4: 16,  // 3번 줄(가운데)
  A4: 20,
  G4: 24,  // 2번 줄
  F4: 28,
  E4: 32,  // 1번 줄(맨 아래)
  D4: 36,
  C4: 40,
};

type Duration = "w" | "h" | "q" | "e";

interface NoteEvent {
  kind: "note";
  pitch: keyof typeof PITCH_Y;
  dur: Duration;
  lyric?: string;
  beamWithNext?: boolean;
}
interface RestEvent {
  kind: "rest";
  dur: Duration;
}
type Event = NoteEvent | RestEvent;

interface Stave {
  label: string;
  events: Event[];
}

// 음높이 — 사진 상 첫 음 "도"를 C4(중간 도, 보표 아래 덧줄)로 두고
// 본조 아리랑 도-미-솔 골격을 따라 배치. 2·4단 가운데 "고—" "아—"는 2분음표,
// 그 뒤 "개·를" "하·로"는 빔으로 연결된 8분음표 쌍.
//   m1: 도 미 솔 / 쉼      → C4 E4 G4 rest
//   m2: 솔 미 도 / 쉼      → G4 E4 C4 rest   (2·4단: 솔_h + 미_e 도_e [beam] + 쉼)
//   m3: 솔 미 레 도        → G4 E4 D4 C4
const STAVES: Stave[] = [
  {
    label: "1단",
    events: [
      { kind: "note", pitch: "C4", dur: "q", lyric: "아" },
      { kind: "note", pitch: "E4", dur: "q", lyric: "리" },
      { kind: "note", pitch: "G4", dur: "q", lyric: "랑" },
      { kind: "rest", dur: "q" },
      { kind: "note", pitch: "G4", dur: "q", lyric: "아" },
      { kind: "note", pitch: "E4", dur: "q", lyric: "리" },
      { kind: "note", pitch: "C4", dur: "q", lyric: "랑" },
      { kind: "rest", dur: "q" },
      { kind: "note", pitch: "G4", dur: "q", lyric: "아" },
      { kind: "note", pitch: "E4", dur: "q", lyric: "라" },
      { kind: "note", pitch: "D4", dur: "q", lyric: "리" },
      { kind: "note", pitch: "C4", dur: "q", lyric: "요" },
    ],
  },
  {
    label: "2단",
    events: [
      { kind: "note", pitch: "C4", dur: "q", lyric: "아" },
      { kind: "note", pitch: "E4", dur: "q", lyric: "리" },
      { kind: "note", pitch: "G4", dur: "q", lyric: "랑" },
      { kind: "rest", dur: "q" },
      { kind: "note", pitch: "G4", dur: "h", lyric: "고—" },
      { kind: "note", pitch: "E4", dur: "e", lyric: "개", beamWithNext: true },
      { kind: "note", pitch: "C4", dur: "e", lyric: "를" },
      { kind: "rest", dur: "q" },
      { kind: "note", pitch: "G4", dur: "q", lyric: "넘" },
      { kind: "note", pitch: "E4", dur: "q", lyric: "어" },
      { kind: "note", pitch: "D4", dur: "q", lyric: "간" },
      { kind: "note", pitch: "C4", dur: "q", lyric: "다" },
    ],
  },
  {
    label: "3단",
    events: [
      { kind: "note", pitch: "C4", dur: "q", lyric: "가" },
      { kind: "note", pitch: "E4", dur: "q", lyric: "카" },
      { kind: "note", pitch: "G4", dur: "q", lyric: "라" },
      { kind: "rest", dur: "q" },
      { kind: "note", pitch: "G4", dur: "q", lyric: "나" },
      { kind: "note", pitch: "E4", dur: "q", lyric: "다" },
      { kind: "note", pitch: "C4", dur: "q", lyric: "타" },
      { kind: "rest", dur: "q" },
      { kind: "note", pitch: "G4", dur: "q", lyric: "마" },
      { kind: "note", pitch: "E4", dur: "q", lyric: "바" },
      { kind: "note", pitch: "D4", dur: "q", lyric: "파" },
      { kind: "note", pitch: "C4", dur: "q", lyric: "모" },
    ],
  },
  {
    label: "4단",
    events: [
      { kind: "note", pitch: "C4", dur: "q", lyric: "사" },
      { kind: "note", pitch: "E4", dur: "q", lyric: "자" },
      { kind: "note", pitch: "G4", dur: "q", lyric: "차" },
      { kind: "rest", dur: "q" },
      { kind: "note", pitch: "G4", dur: "h", lyric: "아—" },
      { kind: "note", pitch: "E4", dur: "e", lyric: "하", beamWithNext: true },
      { kind: "note", pitch: "C4", dur: "e", lyric: "로" },
      { kind: "rest", dur: "q" },
      { kind: "note", pitch: "G4", dur: "q", lyric: "넘" },
      { kind: "note", pitch: "E4", dur: "q", lyric: "어" },
      { kind: "note", pitch: "D4", dur: "q", lyric: "간" },
      { kind: "note", pitch: "C4", dur: "q", lyric: "다" },
    ],
  },
];

// 보표 폭 계산
const STAVE_INNER_PAD_LEFT = 90; // clef + key sig + time sig
const NOTE_SPACING_Q = 38;       // 4분음표 한 박 폭
const STAVE_INNER_PAD_RIGHT = 18;

function durationBeats(dur: Duration): number {
  return dur === "w" ? 4 : dur === "h" ? 2 : dur === "q" ? 1 : 0.5;
}

function staveTotalWidth(events: Event[]): number {
  const beats = events.reduce((s, e) => s + durationBeats(e.dur), 0);
  return STAVE_INNER_PAD_LEFT + beats * NOTE_SPACING_Q + STAVE_INNER_PAD_RIGHT;
}

function noteHeadFilled(dur: Duration) {
  return dur === "q" || dur === "e";
}
function hasStem(dur: Duration) {
  return dur !== "w";
}
function flagCount(dur: Duration) {
  return dur === "e" ? 1 : 0;
}

interface RenderedNote {
  x: number;
  y: number;
  pitch: keyof typeof PITCH_Y;
  dur: Duration;
  lyric?: string;
  stemUp: boolean;
  beamWithNext?: boolean;
}

function renderStave(stave: Stave, index: number): React.ReactElement {
  const totalWidth = staveTotalWidth(stave.events);
  let cursor = STAVE_INNER_PAD_LEFT;
  const noteLayouts: RenderedNote[] = [];
  const restLayouts: { x: number; dur: Duration }[] = [];

  for (const ev of stave.events) {
    const slot = durationBeats(ev.dur) * NOTE_SPACING_Q;
    const cx = cursor + slot / 2 - NOTE_SPACING_Q / 2 + 8;
    if (ev.kind === "note") {
      const y = PITCH_Y[ev.pitch];
      const stemUp = y >= 16; // 가운데 줄 이하면 스템 위로
      noteLayouts.push({
        x: cx,
        y,
        pitch: ev.pitch,
        dur: ev.dur,
        lyric: ev.lyric,
        stemUp,
        beamWithNext: ev.beamWithNext,
      });
    } else {
      restLayouts.push({ x: cx, dur: ev.dur });
    }
    cursor += slot;
  }

  return (
    <g key={index} transform={`translate(0 ${index * 110})`}>
      {/* 단 라벨 */}
      <text
        x={0}
        y={-14}
        fontSize={10}
        fontWeight={600}
        fill="currentColor"
        opacity={0.55}
        stroke="none"
      >
        {stave.label}
      </text>

      {/* 5선 */}
      <g stroke="currentColor" strokeWidth={0.8} opacity={0.85}>
        {[0, 1, 2, 3, 4].map((i) => (
          <line
            key={i}
            x1={0}
            y1={i * LINE_GAP}
            x2={totalWidth}
            y2={i * LINE_GAP}
          />
        ))}
      </g>

      {/* 시작 세로 굵은 줄 */}
      <line
        x1={0}
        y1={0}
        x2={0}
        y2={STAFF_HEIGHT}
        stroke="currentColor"
        strokeWidth={1.6}
      />

      {/* 높은음자리표 (Unicode 𝄞) */}
      <text
        x={6}
        y={STAFF_HEIGHT - 1}
        fontSize={44}
        fontFamily="'Bravura Text','Noto Music','Segoe UI Symbol',serif"
        fill="currentColor"
        stroke="none"
        dominantBaseline="alphabetic"
      >
        𝄞
      </text>

      {/* 조표 — 1♭ (Bb) : B4 줄(가운데 줄, y=16) 위치 */}
      <text
        x={42}
        y={20}
        fontSize={26}
        fontFamily="'Bravura Text','Noto Music','Segoe UI Symbol',serif"
        fill="currentColor"
        stroke="none"
        dominantBaseline="alphabetic"
      >
        ♭
      </text>

      {/* 박자표 4/4 */}
      <text
        x={62}
        y={14}
        fontSize={16}
        fontWeight={800}
        fill="currentColor"
        stroke="none"
        dominantBaseline="alphabetic"
      >
        4
      </text>
      <text
        x={62}
        y={30}
        fontSize={16}
        fontWeight={800}
        fill="currentColor"
        stroke="none"
        dominantBaseline="alphabetic"
      >
        4
      </text>

      {/* 마디 구분선 — 4박마다 */}
      {(() => {
        const lines: React.ReactElement[] = [];
        let beat = 0;
        let x = STAVE_INNER_PAD_LEFT;
        for (const ev of stave.events) {
          beat += durationBeats(ev.dur);
          x += durationBeats(ev.dur) * NOTE_SPACING_Q;
          if (beat % 4 === 0) {
            lines.push(
              <line
                key={`bar-${x}`}
                x1={x - 4}
                y1={0}
                x2={x - 4}
                y2={STAFF_HEIGHT}
                stroke="currentColor"
                strokeWidth={0.9}
                opacity={0.7}
              />,
            );
          }
        }
        return lines;
      })()}

      {/* 종결 이중선 */}
      <line
        x1={totalWidth - 5}
        y1={0}
        x2={totalWidth - 5}
        y2={STAFF_HEIGHT}
        stroke="currentColor"
        strokeWidth={0.9}
      />
      <line
        x1={totalWidth - 1}
        y1={0}
        x2={totalWidth - 1}
        y2={STAFF_HEIGHT}
        stroke="currentColor"
        strokeWidth={2}
      />

      {/* 쉼표 (4분쉼표만 사용) */}
      {restLayouts.map((r, i) => (
        <text
          key={`r-${i}`}
          x={r.x}
          y={STAFF_HEIGHT / 2 + 6}
          fontSize={20}
          fontFamily="'Bravura Text','Noto Music','Segoe UI Symbol',serif"
          fill="currentColor"
          stroke="none"
          textAnchor="middle"
        >
          𝄽
        </text>
      ))}

      {/* 음표 + 스템 + 빔 + 가사 + 덧줄 */}
      {noteLayouts.map((n, i) => {
        const headFill = noteHeadFilled(n.dur) ? "currentColor" : "white";
        const stemX = n.stemUp ? n.x + STEM_OFFSET : n.x - STEM_OFFSET;
        const stemY1 = n.y;
        const stemY2 = n.stemUp ? n.y - STEM_LEN : n.y + STEM_LEN;
        const next = noteLayouts[i + 1];
        const beamThis = n.beamWithNext && next;

        // 위쪽 덧줄 (A5, C6 등)
        const ledgerLines: React.ReactElement[] = [];
        if (n.y < 0) {
          for (let ly = -8; ly >= n.y - 1; ly -= 8) {
            ledgerLines.push(
              <line
                key={`ledger-up-${i}-${ly}`}
                x1={n.x - 7}
                y1={ly}
                x2={n.x + 7}
                y2={ly}
                stroke="currentColor"
                strokeWidth={0.9}
              />,
            );
          }
        }
        if (n.y > 32) {
          for (let ly = 40; ly <= n.y + 1; ly += 8) {
            ledgerLines.push(
              <line
                key={`ledger-dn-${i}-${ly}`}
                x1={n.x - 7}
                y1={ly}
                x2={n.x + 7}
                y2={ly}
                stroke="currentColor"
                strokeWidth={0.9}
              />,
            );
          }
        }

        return (
          <g key={`n-${i}`}>
            {ledgerLines}
            {/* 노트헤드 */}
            <ellipse
              cx={n.x}
              cy={n.y}
              rx={NOTE_RX}
              ry={NOTE_RY}
              fill={headFill}
              stroke="currentColor"
              strokeWidth={1.1}
              transform={`rotate(-22 ${n.x} ${n.y})`}
            />
            {/* 스템 */}
            {hasStem(n.dur) && (
              <line
                x1={stemX}
                y1={stemY1}
                x2={stemX}
                y2={stemY2}
                stroke="currentColor"
                strokeWidth={1.1}
              />
            )}
            {/* 8분음표 깃발 (빔이 아닐 때만) */}
            {!beamThis && flagCount(n.dur) > 0 && (
              <path
                d={
                  n.stemUp
                    ? `M ${stemX} ${stemY2} q 8 4 7 14`
                    : `M ${stemX} ${stemY2} q 8 -4 7 -14`
                }
                stroke="currentColor"
                strokeWidth={1.2}
                fill="none"
              />
            )}
            {/* 가사 */}
            {n.lyric && (
              <text
                x={n.x}
                y={STAFF_HEIGHT + 22}
                fontSize={13}
                fontWeight={600}
                fill="currentColor"
                stroke="none"
                textAnchor="middle"
              >
                {n.lyric}
              </text>
            )}
          </g>
        );
      })}

      {/* 빔 (8분음표 쌍) */}
      {noteLayouts.map((n, i) => {
        const next = noteLayouts[i + 1];
        if (!n.beamWithNext || !next) return null;
        const stemX1 = n.stemUp ? n.x + STEM_OFFSET : n.x - STEM_OFFSET;
        const stemX2 = next.stemUp ? next.x + STEM_OFFSET : next.x - STEM_OFFSET;
        const stemY1End = n.stemUp ? n.y - STEM_LEN : n.y + STEM_LEN;
        const stemY2End = next.stemUp ? next.y - STEM_LEN : next.y + STEM_LEN;
        return (
          <line
            key={`beam-${i}`}
            x1={stemX1}
            y1={stemY1End}
            x2={stemX2}
            y2={stemY2End}
            stroke="currentColor"
            strokeWidth={3}
          />
        );
      })}
    </g>
  );
}

export interface ConsonantSongSheetProps {
  className?: string;
}

export default function ConsonantSongSheet({
  className,
}: ConsonantSongSheetProps) {
  // 가장 넓은 보표 폭에 맞춰 viewBox 폭 설정
  const maxWidth = Math.max(...STAVES.map((s) => staveTotalWidth(s.events)));
  const padX = 16;
  const padTop = 20;
  const staveStride = 110;
  const totalHeight = padTop + STAVES.length * staveStride + 30;

  return (
    <svg
      role="img"
      aria-label="안심 한글 노래 자음 14자 악보. 작사 작곡 김윤규. F장조 4분의 4박자. 아리랑 가락에 자음 14자 가사를 얹은 두 절 구성."
      viewBox={`${-padX} ${-padTop} ${maxWidth + padX * 2} ${totalHeight}`}
      xmlns="http://www.w3.org/2000/svg"
      className={cn("w-full h-auto text-foreground", className)}
    >
      <title>안심 한글 노래 (자음 14자) 악보</title>
      {STAVES.map((s, i) => renderStave(s, i))}
    </svg>
  );
}
