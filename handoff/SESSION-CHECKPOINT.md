# Session Checkpoint

## Current State

- **Last completed:** Sprint 7 (BRIEF 단계 8 — ConsonantTree) + 인터랙션 자동 루프 리팩토링 (key-remount) + 모바일 줄바꿈 CSS
- **Reviewer status:** Sprint 5/6/7 모두 clear
- **Currently in:** Sprint 8 (BRIEF 단계 9 — Numbers W·△·M·○)

## Narrative arc 현재까지 (7개 섹션 완성)

Hero → Problem → BigIdea → Vowels → ConsonantRoots → ThreeModes → ConsonantTree

24자 증명 흐름 완료. 다음은 **선택 섹션**:
- Numbers (양·음 한글숫자) — BRIEF에서 "선택사항이지만 포함 권장"
- Founder (창시자 소개)
- Footer

## 잠긴 정책

- 양 (#E85D3C): ㅣ ㄱ ㅅ
- 음 (#2C3E62): ㅡ ㄴ ㅁ ㅇ
- 자음 14자 canonical 매핑: handoff/CONSONANT-TREE-REFERENCE.md
- 시각 언어: 2px stroke, currentColor, 도형 외곽선, eum 본체
- lib/colors.ts (YANG/EUM/FOREGROUND export)

## 자동 루프 패턴 (Sprint 7 후 cross-cutting 변경)

- 모든 시각 데모는 타이머 기반 자동 루프 (스크롤 무관)
- key-remount 패턴 (cycleKey++ → SVG remount → forward animation 깨끗 재생)
- 호버 시에도 즉시 replay
- prefers-reduced-motion: 모든 루프 비활성화, 정적 종료 자세

## 모바일 줄바꿈 정책 (globals.css)

- html: `word-break: keep-all; overflow-wrap: break-word;`
- p: `text-wrap: pretty;`
- h1/h2/h3: `text-wrap: balance;`

## Resume note

If session restarts:
- Read handoff/BUILD-LOG.md
- Read handoff/REVIEW-FEEDBACK.md
- Read handoff/CONSONANT-TREE-REFERENCE.md
- Read BRIEF.md
- Continue: 단계 9 Numbers
