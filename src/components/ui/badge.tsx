import React from "react";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "secondary" | "outline" | "success" | "warning" | "error" | "info" | "brand";
}

export const Badge: React.FC<BadgeProps> = ({
  className = "",
  variant = "default",
  children,
  ...props
}) => {
  const baseStyles = "inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold select-none border";

  const variants = {
    default: "bg-stone-800 text-stone-100 border-transparent dark:bg-stone-200 dark:text-stone-800",
    secondary: "bg-[var(--card-border)]/50 text-[var(--foreground)] border-transparent",
    outline: "border-[var(--card-border)] text-[var(--foreground)] bg-transparent",
    success: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/50",
    warning: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900/50",
    error: "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/20 dark:text-rose-400 dark:border-rose-900/50",
    info: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/20 dark:text-blue-400 dark:border-blue-900/50",
    brand: "bg-[var(--accent-light)] text-[var(--accent)] border-[var(--accent)]/20 dark:bg-teal-950/20 dark:text-teal-400 dark:border-teal-900/50"
  };

  return (
    <span className={`${baseStyles} ${variants[variant]} ${className}`} {...props}>
      {children}
    </span>
  );
};
