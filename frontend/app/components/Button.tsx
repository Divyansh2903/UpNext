"use client";

import * as React from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "../lib/utils";

interface ButtonProps extends Omit<HTMLMotionProps<"button">, "children"> {
  variant?: "primary" | "secondary" | "ghost" | "danger" | "tertiary";
  size?: "sm" | "md" | "lg" | "icon";
  isLoading?: boolean;
  children?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", isLoading, children, ...props }, ref) => {
    const variants = {
      primary: "upnext-btn-primary rounded-full",
      secondary:
        "rounded-full border-0 bg-panel/55 text-foreground shadow-[0_0_0_1px_var(--border-ghost)] backdrop-blur-[var(--glass-blur-float)] hover:bg-chip/70",
      ghost: "rounded-full border-0 bg-transparent text-muted-foreground hover:text-foreground hover:bg-foreground/[0.04]",
      tertiary:
        "rounded-full border-0 bg-transparent text-primary-dim underline-offset-4 decoration-transparent hover:underline hover:decoration-accent",
      danger:
        "rounded-full border-0 bg-danger-fill text-foreground shadow-[var(--shadow-ambient-float)] hover:brightness-110",
    };

    const sizes = {
      sm: "h-8 px-3 text-xs font-label",
      md: "h-10 px-4 py-2 text-sm font-label",
      lg: "h-12 px-8 text-base font-medium font-label",
      icon: "h-10 w-10 flex items-center justify-center p-0",
    };

    return (
      <motion.button
        ref={ref}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={cn(
          "inline-flex items-center justify-center transition-[color,background-color,box-shadow,filter] focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/35 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:opacity-50 disabled:pointer-events-none",
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {isLoading ? (
          <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
        ) : null}
        {children}
      </motion.button>
    );
  }
);

Button.displayName = "Button";
