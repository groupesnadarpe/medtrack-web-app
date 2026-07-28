import { cn } from "@/shared/ui/utils";

type MedtrackLogoProps = {
  compact?: boolean;
  className?: string;
};

export function MedtrackLogo({ compact = false, className }: MedtrackLogoProps) {
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <div className="flex h-[35px] w-[35px] items-center justify-center rounded-lg bg-[#08bfae] shadow-md shadow-teal-900/20">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M12 20s-7-4.5-9.2-9.2C.9 6.7 3.5 3.2 7.3 3.2c2 0 3.5 1 4.7 2.7 1.2-1.7 2.7-2.7 4.7-2.7 3.8 0 6.4 3.5 4.5 7.6C19 15.5 12 20 12 20Z" stroke="white" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M6.6 11.5h2.5l1.3-3.1 2.4 6.2 1.4-3.1h3.2" stroke="white" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      {!compact ? (
        <div>
          <p className="text-[17px] font-extrabold leading-none tracking-tight text-white">
            MEDTRACK<span className="text-[#08bfae]">-RDC</span>
          </p>
          <p className="mt-1 text-[0.55rem] font-bold uppercase tracking-wide text-[#08bfae]">Plateforme sécurisée</p>
        </div>
      ) : null}
    </div>
  );
}