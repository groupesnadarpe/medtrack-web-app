import type { HTMLAttributes } from "react";
import { cn } from "@/shared/ui/utils";

type BadgeTone = "neutral" | "success" | "warning" | "danger" | "info";

type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  tone?: BadgeTone;
};

const tones: Record<BadgeTone, string> = {
  neutral: "bg-slate-100 text-slate-700",
  success: "bg-emerald-100 text-emerald-700",
  warning: "bg-amber-100 text-amber-800",
  danger: "bg-red-100 text-red-700",
  info: "bg-blue-100 text-blue-700",
};

export function Badge({ className, tone = "neutral", ...props }: BadgeProps) {
  return <span className={cn("inline-flex rounded-full px-2 py-0.5 text-xs font-medium", tones[tone], className)} {...props} />;
}