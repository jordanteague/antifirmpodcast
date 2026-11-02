import type { ComponentProps } from "react";

type Props = ComponentProps<"a"> & { variant?: "solid" | "outline" };

const base =
  "label inline-flex items-center justify-center gap-3.5 border px-6 py-4 font-semibold transition-colors duration-150";
const variants = {
  solid: "border-brand-lime bg-brand-lime text-background-primary hover:border-text-primary hover:bg-text-primary",
  outline: "border-text-primary text-text-primary hover:border-brand-lime hover:text-brand-lime",
};

export function Button({ variant = "solid", className = "", ...props }: Props) {
  return <a {...props} className={`${base} ${variants[variant]} ${className}`} />;
}
