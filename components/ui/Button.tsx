import type { AnchorHTMLAttributes, ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type ButtonVariant = "primary" | "secondary";
type ButtonSize = "default" | "lg";

type CommonProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
};

type ButtonAsButton = CommonProps & {
  as?: undefined;
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className">;

type ButtonAsAnchor = CommonProps & {
  as: "a";
} & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "className">;

export type ButtonProps = ButtonAsButton | ButtonAsAnchor;

const variantClasses: Record<ButtonVariant, string> = {
  primary: "bg-yang text-white hover:bg-yang/90",
  secondary:
    "border border-foreground/20 text-foreground bg-transparent hover:bg-foreground/5",
};

const sizeClasses: Record<ButtonSize, string> = {
  default: "h-12 px-6 text-base",
  // lg: text-xl (20px) + font-bold (700) → WCAG "large text" 기준 충족 (≥18.66px bold).
  // bg-yang(#C8102E) on text-white 대비비 3.46:1 — large-text 3.0:1 threshold 통과.
  lg: "h-14 px-8 text-xl font-bold",
};

const baseClasses =
  "inline-flex items-center justify-center rounded-full font-semibold transition-colors " +
  "focus-visible:outline-2 focus-visible:outline-yang focus-visible:outline-offset-2 " +
  "disabled:opacity-50 disabled:pointer-events-none";

export default function Button(props: ButtonProps) {
  const { variant = "primary", size = "default", className } = props;
  const classes = cn(
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    className
  );

  if (props.as === "a") {
    // Strip our own props before forwarding to <a>.
    const { as: _as, variant: _v, size: _s, className: _c, ...anchorRest } =
      props;
    void _as;
    void _v;
    void _s;
    void _c;
    return <a className={classes} {...anchorRest} />;
  }

  const { as: _as2, variant: _v, size: _s, className: _c, type, ...buttonRest } =
    props;
  void _as2;
  void _v;
  void _s;
  void _c;
  return <button type={type ?? "button"} className={classes} {...buttonRest} />;
}
