import { cn } from "@/lib/cn";

/**
 * ConsonantSongSheet — 안심 한글 노래 (자음 14자) 깔끔한 디지털 악보.
 *
 * 작사·작곡 김윤규. F장조(1♭) 4/4박자, 4단 구성.
 * SVG는 사용자가 정한 음표 좌표 그대로 박아 넣은 정적 마크업이다.
 * viewBox 0 0 950 680 — width:100% / height:auto로 모바일에서도 가로 스크롤 없이 축소.
 */
export interface ConsonantSongSheetProps {
  className?: string;
}

export default function ConsonantSongSheet({
  className,
}: ConsonantSongSheetProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 950 680"
      width="100%"
      height="auto"
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-label="안심 한글 노래 자음 14자 악보. 작사 작곡 김윤규. F장조 4분의 4박자, 4단 구성."
      className={cn("block w-full h-auto bg-white", className)}
      style={{ fontFamily: "'Malgun Gothic','Noto Sans KR',sans-serif" }}
    >
      <title>안심 한글 노래 (자음 14자) 악보</title>

      <style>{`
        .staff-line { stroke: #333333; stroke-width: 1.2; }
        .bar-line { stroke: #222222; stroke-width: 1.5; }
        .double-bar-line { stroke: #222222; stroke-width: 3.5; }
        .note-head { fill: #111111; }
        .note-stem { stroke: #111111; stroke-width: 1.5; fill: none; }
        .note-beam { fill: #111111; }
        .text-lyric { font-size: 15px; fill: #333333; text-anchor: middle; letter-spacing: 1px; }
        .text-time { font-size: 32px; font-weight: bold; fill: #111111; font-family: 'Times New Roman', serif; text-anchor: middle; }
        .clef-flat { font-size: 24px; font-style: italic; font-family: 'Times New Roman', serif; fill: #111111; font-weight: bold; }
        .rest-quarter { fill: none; stroke: #111111; stroke-width: 2.2; stroke-linejoin: round; stroke-linecap: round; }
      `}</style>

      <defs>
        <g id="quarter-head">
          <ellipse cx="0" cy="0" rx="6.5" ry="4.5" transform="rotate(-25)" className="note-head" />
        </g>
        <path
          id="rest-4"
          d="M 0,-15 C 3,-12 5,-9 2,-6 C -2,-3 -4,-1 1,3 C 4,6 1,11 -2,13 M -2,13 C -1,11 1,10 0,9"
          className="rest-quarter"
        />
        <rect id="rest-1" x="-6" y="0" width="12" height="5" fill="#111111" />
        <text id="flat" className="clef-flat" x="0" y="0">♭</text>
      </defs>

      {/* ==================== LINE 1 ==================== */}
      <g transform="translate(0,0)">
        <line x1="30" y1="80" x2="920" y2="80" className="staff-line" />
        <line x1="30" y1="90" x2="920" y2="90" className="staff-line" />
        <line x1="30" y1="100" x2="920" y2="100" className="staff-line" />
        <line x1="30" y1="110" x2="920" y2="110" className="staff-line" />
        <line x1="30" y1="120" x2="920" y2="120" className="staff-line" />
        <line x1="30" y1="80" x2="30" y2="120" className="bar-line" />
        <line x1="250" y1="80" x2="250" y2="120" className="bar-line" />
        <line x1="470" y1="80" x2="470" y2="120" className="bar-line" />
        <line x1="690" y1="80" x2="690" y2="120" className="bar-line" />
        <line x1="920" y1="80" x2="920" y2="120" className="double-bar-line" />
        <use href="#flat" x="42" y="103" />
        <text x="62" y="102" className="text-time">4</text>
        <text x="62" y="124" className="text-time">4</text>

        {/* 마디 1 */}
        <use href="#quarter-head" x="100" y="120" />
        <line x1="106.5" y1="120" x2="106.5" y2="92" className="note-stem" />
        <text x="100" y="145" className="text-lyric">아</text>
        <use href="#quarter-head" x="145" y="115" />
        <line x1="151.5" y1="115" x2="151.5" y2="87" className="note-stem" />
        <text x="145" y="145" className="text-lyric">리</text>
        <use href="#quarter-head" x="190" y="120" />
        <line x1="196.5" y1="120" x2="196.5" y2="92" className="note-stem" />
        <text x="190" y="145" className="text-lyric">랑</text>
        <use href="#rest-4" x="225" y="105" />

        {/* 마디 2 */}
        <use href="#quarter-head" x="290" y="115" />
        <line x1="296.5" y1="115" x2="296.5" y2="87" className="note-stem" />
        <text x="290" y="145" className="text-lyric">아</text>
        <use href="#quarter-head" x="340" y="105" />
        <line x1="346.5" y1="105" x2="346.5" y2="77" className="note-stem" />
        <text x="340" y="145" className="text-lyric">리</text>
        <use href="#quarter-head" x="390" y="95" />
        <line x1="396.5" y1="95" x2="396.5" y2="67" className="note-stem" />
        <text x="390" y="145" className="text-lyric">랑</text>
        <use href="#rest-4" x="440" y="105" />

        {/* 마디 3 */}
        <use href="#quarter-head" x="510" y="105" />
        <line x1="516.5" y1="105" x2="516.5" y2="77" className="note-stem" />
        <text x="510" y="145" className="text-lyric">아</text>
        <use href="#quarter-head" x="560" y="95" />
        <line x1="566.5" y1="95" x2="566.5" y2="67" className="note-stem" />
        <text x="560" y="145" className="text-lyric">라</text>
        <use href="#quarter-head" x="610" y="85" />
        <line x1="616.5" y1="85" x2="616.5" y2="57" className="note-stem" />
        <text x="610" y="145" className="text-lyric">리</text>
        <use href="#quarter-head" x="655" y="95" />
        <line x1="661.5" y1="95" x2="661.5" y2="67" className="note-stem" />
        <text x="655" y="145" className="text-lyric">요</text>

        {/* 마디 4 — 온쉼표 */}
        <use href="#rest-1" x="805" y="90" />
      </g>

      {/* ==================== LINE 2 ==================== */}
      <g transform="translate(0,150)">
        <line x1="30" y1="80" x2="920" y2="80" className="staff-line" />
        <line x1="30" y1="90" x2="920" y2="90" className="staff-line" />
        <line x1="30" y1="100" x2="920" y2="100" className="staff-line" />
        <line x1="30" y1="110" x2="920" y2="110" className="staff-line" />
        <line x1="30" y1="120" x2="920" y2="120" className="staff-line" />
        <line x1="30" y1="80" x2="30" y2="120" className="bar-line" />
        <line x1="250" y1="80" x2="250" y2="120" className="bar-line" />
        <line x1="470" y1="80" x2="470" y2="120" className="bar-line" />
        <line x1="690" y1="80" x2="690" y2="120" className="bar-line" />
        <line x1="920" y1="80" x2="920" y2="120" className="double-bar-line" />
        <use href="#flat" x="42" y="103" />

        {/* 마디 5 — 아리랑 */}
        <use href="#quarter-head" x="100" y="105" />
        <line x1="106.5" y1="105" x2="106.5" y2="77" className="note-stem" />
        <text x="100" y="145" className="text-lyric">아</text>
        <use href="#quarter-head" x="145" y="115" />
        <line x1="151.5" y1="115" x2="151.5" y2="87" className="note-stem" />
        <text x="145" y="145" className="text-lyric">리</text>
        <use href="#quarter-head" x="190" y="120" />
        <line x1="196.5" y1="120" x2="196.5" y2="92" className="note-stem" />
        <text x="190" y="145" className="text-lyric">랑</text>
        <use href="#rest-4" x="225" y="105" />

        {/* 마디 6 — 고-개를 (빔 포함) */}
        <use href="#quarter-head" x="285" y="115" />
        <text x="285" y="145" className="text-lyric">고</text>
        <use href="#quarter-head" x="325" y="120" />
        <text x="325" y="145" className="text-lyric">개</text>
        <line x1="291.5" y1="115" x2="291.5" y2="88" className="note-stem" />
        <line x1="331.5" y1="120" x2="331.5" y2="93" className="note-stem" />
        <polygon points="291.5,88 331.5,93 331.5,88 291.5,83" className="note-beam" />
        <text x="305" y="145" className="text-lyric">ㅡ</text>

        <use href="#quarter-head" x="380" y="115" />
        <line x1="386.5" y1="115" x2="386.5" y2="87" className="note-stem" />
        <text x="380" y="145" className="text-lyric">를</text>
        <use href="#rest-4" x="430" y="105" />

        {/* 마디 7 — 넘어간다 */}
        <use href="#quarter-head" x="510" y="105" />
        <line x1="516.5" y1="105" x2="516.5" y2="77" className="note-stem" />
        <text x="510" y="145" className="text-lyric">넘</text>
        <use href="#quarter-head" x="560" y="95" />
        <line x1="566.5" y1="95" x2="566.5" y2="67" className="note-stem" />
        <text x="560" y="145" className="text-lyric">어</text>
        <use href="#quarter-head" x="610" y="105" />
        <line x1="616.5" y1="105" x2="616.5" y2="77" className="note-stem" />
        <text x="610" y="145" className="text-lyric">간</text>
        <use href="#quarter-head" x="655" y="105" />
        <line x1="661.5" y1="105" x2="661.5" y2="77" className="note-stem" />
        <text x="655" y="145" className="text-lyric">다</text>

        {/* 마디 8 — 온쉼표 */}
        <use href="#rest-1" x="805" y="90" />
      </g>

      {/* ==================== LINE 3 ==================== */}
      <g transform="translate(0,300)">
        <line x1="30" y1="80" x2="920" y2="80" className="staff-line" />
        <line x1="30" y1="90" x2="920" y2="90" className="staff-line" />
        <line x1="30" y1="100" x2="920" y2="100" className="staff-line" />
        <line x1="30" y1="110" x2="920" y2="110" className="staff-line" />
        <line x1="30" y1="120" x2="920" y2="120" className="staff-line" />
        <line x1="30" y1="80" x2="30" y2="120" className="bar-line" />
        <line x1="250" y1="80" x2="250" y2="120" className="bar-line" />
        <line x1="470" y1="80" x2="470" y2="120" className="bar-line" />
        <line x1="690" y1="80" x2="690" y2="120" className="bar-line" />
        <line x1="920" y1="80" x2="920" y2="120" className="double-bar-line" />
        <use href="#flat" x="42" y="103" />

        {/* 마디 9 — 가카라 */}
        <use href="#quarter-head" x="100" y="120" />
        <line x1="106.5" y1="120" x2="106.5" y2="92" className="note-stem" />
        <text x="100" y="145" className="text-lyric">가</text>
        <use href="#quarter-head" x="145" y="120" />
        <line x1="151.5" y1="120" x2="151.5" y2="92" className="note-stem" />
        <text x="145" y="145" className="text-lyric">카</text>
        <use href="#quarter-head" x="190" y="120" />
        <line x1="196.5" y1="120" x2="196.5" y2="92" className="note-stem" />
        <text x="190" y="145" className="text-lyric">라</text>
        <use href="#rest-4" x="225" y="105" />

        {/* 마디 10 — 나다타 */}
        <use href="#quarter-head" x="290" y="85" />
        <line x1="283.5" y1="85" x2="283.5" y2="113" className="note-stem" />
        <text x="290" y="145" className="text-lyric">나</text>
        <use href="#quarter-head" x="340" y="95" />
        <line x1="346.5" y1="95" x2="346.5" y2="67" className="note-stem" />
        <text x="340" y="145" className="text-lyric">다</text>
        <use href="#quarter-head" x="390" y="85" />
        <line x1="383.5" y1="85" x2="383.5" y2="113" className="note-stem" />
        <text x="390" y="145" className="text-lyric">타</text>
        <use href="#rest-4" x="440" y="105" />

        {/* 마디 11 — 마바파요 */}
        <use href="#quarter-head" x="510" y="105" />
        <line x1="516.5" y1="105" x2="516.5" y2="77" className="note-stem" />
        <text x="510" y="145" className="text-lyric">마</text>
        <use href="#quarter-head" x="560" y="115" />
        <line x1="566.5" y1="115" x2="566.5" y2="87" className="note-stem" />
        <text x="560" y="145" className="text-lyric">바</text>
        <use href="#quarter-head" x="610" y="120" />
        <line x1="616.5" y1="120" x2="616.5" y2="92" className="note-stem" />
        <text x="610" y="145" className="text-lyric">파</text>
        <use href="#quarter-head" x="655" y="115" />
        <line x1="661.5" y1="115" x2="661.5" y2="87" className="note-stem" />
        <text x="655" y="145" className="text-lyric">요</text>

        {/* 마디 12 — 온쉼표 */}
        <use href="#rest-1" x="805" y="90" />
      </g>

      {/* ==================== LINE 4 ==================== */}
      <g transform="translate(0,450)">
        <line x1="30" y1="80" x2="920" y2="80" className="staff-line" />
        <line x1="30" y1="90" x2="920" y2="90" className="staff-line" />
        <line x1="30" y1="100" x2="920" y2="100" className="staff-line" />
        <line x1="30" y1="110" x2="920" y2="110" className="staff-line" />
        <line x1="30" y1="120" x2="920" y2="120" className="staff-line" />
        <line x1="30" y1="80" x2="30" y2="120" className="bar-line" />
        <line x1="250" y1="80" x2="250" y2="120" className="bar-line" />
        <line x1="470" y1="80" x2="470" y2="120" className="bar-line" />
        <line x1="690" y1="80" x2="690" y2="120" className="bar-line" />
        <line x1="920" y1="80" x2="920" y2="120" className="double-bar-line" />
        <use href="#flat" x="42" y="103" />

        {/* 마디 13 — 사자차 */}
        <use href="#quarter-head" x="100" y="105" />
        <line x1="106.5" y1="105" x2="106.5" y2="77" className="note-stem" />
        <text x="100" y="145" className="text-lyric">사</text>
        <use href="#quarter-head" x="145" y="95" />
        <line x1="151.5" y1="95" x2="151.5" y2="67" className="note-stem" />
        <text x="145" y="145" className="text-lyric">자</text>
        <use href="#quarter-head" x="190" y="105" />
        <line x1="196.5" y1="105" x2="196.5" y2="77" className="note-stem" />
        <text x="190" y="145" className="text-lyric">차</text>
        <use href="#rest-4" x="225" y="105" />

        {/* 마디 14 — 아-하로 (빔 포함) */}
        <use href="#quarter-head" x="285" y="85" />
        <text x="285" y="145" className="text-lyric">아</text>
        <use href="#quarter-head" x="325" y="95" />
        <text x="325" y="145" className="text-lyric">하</text>
        <line x1="278.5" y1="85" x2="278.5" y2="112" className="note-stem" />
        <line x1="331.5" y1="95" x2="331.5" y2="68" className="note-stem" />
        <polygon points="278.5,112 331.5,68 331.5,63 278.5,107" className="note-beam" />
        <text x="305" y="145" className="text-lyric">ㅡ</text>

        <use href="#quarter-head" x="380" y="105" />
        <line x1="386.5" y1="105" x2="386.5" y2="77" className="note-stem" />
        <text x="380" y="145" className="text-lyric">로</text>
        <use href="#rest-4" x="430" y="105" />

        {/* 마디 15 — 넘어간다 */}
        <use href="#quarter-head" x="510" y="115" />
        <line x1="516.5" y1="115" x2="516.5" y2="87" className="note-stem" />
        <text x="510" y="145" className="text-lyric">넘</text>
        <use href="#quarter-head" x="560" y="120" />
        <line x1="566.5" y1="120" x2="566.5" y2="92" className="note-stem" />
        <text x="560" y="145" className="text-lyric">어</text>
        <use href="#quarter-head" x="610" y="105" />
        <line x1="616.5" y1="105" x2="616.5" y2="77" className="note-stem" />
        <text x="610" y="145" className="text-lyric">간</text>
        <use href="#quarter-head" x="655" y="105" />
        <line x1="661.5" y1="105" x2="661.5" y2="77" className="note-stem" />
        <text x="655" y="145" className="text-lyric">다</text>

        {/* 마디 16 — 온쉼표 */}
        <use href="#rest-1" x="805" y="90" />
      </g>
    </svg>
  );
}
