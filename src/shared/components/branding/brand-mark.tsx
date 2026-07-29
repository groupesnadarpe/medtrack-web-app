import { HeartPulse } from "lucide-react";
import { cn } from "@/shared/ui/utils";

type BrandMarkProps = {
  /** Sous-titre optionnel affiché sous le nom de la plateforme. */
  tagline?: string;
  tone?: "light" | "dark";
  className?: string;
};

/** Logotype MEDTRACK-RDC réutilisable (auth, shells, emails internes). */
export function BrandMark({ tagline, tone = "light", className }: BrandMarkProps) {
  const isLight = tone === "light";

  return (
    <div className={cn("flex items-center gap-4", className)}>
      <span
        aria-hidden="true"
        className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/25"
      >
        <HeartPulse className="size-6" strokeWidth={2.25} />
      </span>
      <span className="flex flex-col">
        <span
          className={cn(
            "font-display text-2xl font-extrabold tracking-tight",
            isLight ? "text-navy-foreground" : "text-navy",
          )}
        >
          MEDTRACK<span className="text-primary">-RDC</span>
        </span>
        {tagline ? (
          <span className="text-xs font-semibold tracking-[0.18em] text-primary uppercase">{tagline}</span>
        ) : null}
      </span>
    </div>
  );
}
