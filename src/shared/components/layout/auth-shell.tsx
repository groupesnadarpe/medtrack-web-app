import Link from "next/link";
import type { ReactNode } from "react";
import { MedtrackLogo } from "@/shared/components/brand/medtrack-logo";

type AuthShellProps = Readonly<{
  title: string;
  subtitle: string;
  eyebrow?: string;
  children: ReactNode;
  footer?: ReactNode;
}>;

export function AuthShell({ title, subtitle, children, footer }: AuthShellProps) {
  return (
    <main className="grid min-h-screen bg-white lg:grid-cols-[49.5%_50.5%]">
      <section className="relative hidden overflow-hidden bg-[#1d3156] px-[5.4rem] py-[3.2rem] text-white lg:flex lg:flex-col">
        <div className="relative z-10">
          <Link href="/" aria-label="Retour à l'accueil Medtrack">
            <MedtrackLogo />
          </Link>
        </div>

        <div className="relative z-10 mt-[3.6rem] max-w-[48rem] text-center">
          <h1 className="mt-6 text-[1.35rem] font-extrabold leading-[1.14] tracking-[-0.03em] xl:text-[2rem]">
            Plateforme de gestion des stages médicaux
          </h1>
          <p className="mx-auto mt-5 max-w-[40rem] text-[1rem] leading-7 text-slate-300/90">
            Un accès unique pour suivre, valider et coordonner le parcours clinique des futurs professionnels de santé.
          </p>
        </div>

        <div aria-hidden="true" className="absolute bottom-[8rem] left-[10rem] h-[15.5rem] w-[15.5rem] rounded-[4.5rem] bg-cyan-500/10" />
        <div aria-hidden="true" className="absolute bottom-[7.6rem] left-[13.4rem] h-[19rem] w-[19rem] rounded-full bg-teal-400/10" />
        <div aria-hidden="true" className="absolute bottom-[13rem] right-[10rem] h-[10rem] w-[10rem] rounded-full bg-teal-400/10" />
        <div aria-hidden="true" className="absolute bottom-[5.2rem] left-[8.2rem] h-[10.5rem] w-[10.5rem] rounded-t-[1.7rem] bg-cyan-400/10" />
        <div aria-hidden="true" className="absolute bottom-[7.8rem] left-[21rem] h-[8.8rem] w-[8.8rem] rounded-3xl bg-teal-400/10" />
        <div aria-hidden="true" className="absolute bottom-[16.8rem] left-[21rem] h-[8.8rem] w-[8.8rem] rounded-full bg-white/10" />
        <div aria-hidden="true" className="absolute bottom-[8.8rem] right-[12.7rem] h-4 w-4 rounded-full bg-teal-400/10" />
        <div aria-hidden="true" className="absolute bottom-[6.5rem] right-[10.1rem] h-8 w-8 rounded-full bg-teal-400/10" />

        <p className="relative z-10 mt-auto flex items-center gap-3 text-sm text-slate-300/80">
          <span aria-hidden="true">▣</span>
          Portail hautement sécurisé • Medtrack-RDC
        </p>
      </section>

      <section className="flex min-h-screen flex-col px-8 py-7 sm:px-12 lg:px-[6.5rem] xl:px-[8rem]">
        <div className="flex items-center justify-between lg:hidden">
          <Link href="/" className="flex items-center gap-3 text-slate-950">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#08bfae] text-xs font-black text-white">MT</span>
            <span className="font-black">MEDTRACK-RDC</span>
          </Link>
        </div>

        <div className="flex flex-1 items-center justify-center py-7">
          <div className="w-full max-w-[34rem] rounded-2xl bg-white px-8 py-7 shadow-[0_18px_45px_rgba(15,23,42,0.09)] ring-1 ring-slate-100 sm:px-9 sm:py-8">
            <h2 className="text-[2rem] font-extrabold leading-tight tracking-[-0.03em] text-[#1d3156]">{title}</h2>
            <p className="mt-2 text-base leading-6 text-slate-500">{subtitle}</p>
            <div className="mt-5">{children}</div>
            {footer ? <div className="mt-5 border-t border-slate-100 pt-4">{footer}</div> : null}
          </div>
        </div>

        <footer className="mx-auto w-full max-w-[34rem] border-t border-slate-100 py-4 text-center text-sm text-slate-400">
          Copyright © 2026 MEDTRACK-RDC.
        </footer>
      </section>
    </main>
  );
}