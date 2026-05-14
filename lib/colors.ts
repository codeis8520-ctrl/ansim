/**
 * Shared SVG color constants — yang/eum/foreground.
 *
 * Mirror values declared in `app/globals.css` `@theme` block:
 *   --color-yang        #E85D3C
 *   --color-eum         #2C3E62
 *   --color-foreground  #1A1A1A
 *
 * Used by SVG visual components where Framer Motion needs literal hex values
 * for color interpolation (Tailwind classes can't drive `fill`/`stroke`
 * animations). Keep these in sync with the CSS tokens.
 */

export const YANG = "#E85D3C";
export const EUM = "#2C3E62";
export const FOREGROUND = "#1A1A1A";
