import { cn } from "../lib/utils";

/** Single nav wordmark style site-wide (matches landing). */
const variantClassName = {
  nav: "text-2xl font-black text-orange-400 italic tracking-tighter",
  footer: "text-orange-400 italic text-xl font-black",
} as const;

export type UpNextWordmarkVariant = keyof typeof variantClassName;

type UpNextWordmarkProps = {
  variant?: UpNextWordmarkVariant;
  className?: string;
  as?: "div" | "span";
};

export function UpNextWordmark({
  variant = "nav",
  className,
  as: Component = "div",
}: UpNextWordmarkProps) {
  return (
    <Component className={cn(variantClassName[variant], className)}>
      UpNext
    </Component>
  );
}
