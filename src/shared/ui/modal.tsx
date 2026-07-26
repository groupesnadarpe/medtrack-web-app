import type { ReactNode } from "react";
import { Button } from "@/shared/ui/button";

type ModalProps = {
  open: boolean;
  title: string;
  description?: string;
  children: ReactNode;
  onClose?: () => void;
};

export function Modal({ open, title, description, children, onClose }: ModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4" role="dialog" aria-modal="true">
      <section className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-950">{title}</h2>
            {description ? <p className="mt-1 text-sm text-slate-500">{description}</p> : null}
          </div>
          {onClose ? (
            <Button variant="ghost" onClick={onClose} aria-label="Fermer la modale">
              ×
            </Button>
          ) : null}
        </div>
        <div className="mt-4">{children}</div>
      </section>
    </div>
  );
}