"use client";

import { ChevronDown } from "lucide-react";
import { useMemo, useState } from "react";
import { mockAccounts, MOCK_PASSWORD } from "@/mocks/fixtures/auth-users";
import { cn } from "@/shared/ui/utils";

type DemoAccountsProps = {
  onSelect: (login: string, password: string) => void;
};

/**
 * Bloc temporaire de la phase UI : il permet de tester la redirection par rôle
 * sans back-end. À supprimer dès que l'API réelle est branchée.
 */
export function DemoAccounts({ onSelect }: DemoAccountsProps) {
  const [open, setOpen] = useState(false);

  // Un compte représentatif par espace acteur.
  const accounts = useMemo(() => {
    const seen = new Set<string>();

    return mockAccounts.filter((account) => {
      if (seen.has(account.actor)) return false;
      seen.add(account.actor);

      return true;
    });
  }, []);

  return (
    <div className="mt-8 border-t border-border pt-5">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-2 text-left text-xs font-semibold tracking-wide text-muted-foreground uppercase transition hover:text-foreground"
      >
        Comptes de démonstration
        <ChevronDown className={cn("size-4 transition-transform", open && "rotate-180")} aria-hidden="true" />
      </button>

      {open ? (
        <ul className="mt-4 flex flex-col gap-2">
          {accounts.map((account) => (
            <li key={account.user.uuid}>
              <button
                type="button"
                onClick={() => onSelect(account.user.email, account.password)}
                className="flex w-full items-center justify-between gap-3 rounded-xl border border-border bg-muted/50 px-3 py-2 text-left transition hover:border-primary/40 hover:bg-primary-soft"
              >
                <span className="flex min-w-0 flex-col">
                  <span className="truncate text-sm font-medium text-foreground">{account.user.email}</span>
                  <span className="truncate text-xs text-muted-foreground">{account.user.roles.join(", ")}</span>
                </span>
                <span className="shrink-0 rounded-full bg-primary-soft px-2 py-1 text-[11px] font-semibold text-primary-strong">
                  {account.actorLabel}
                </span>
              </button>
            </li>
          ))}
        </ul>
      ) : null}

      <p className="mt-3 text-xs text-muted-foreground">
        Mot de passe commun : <code className="font-mono text-foreground">{MOCK_PASSWORD}</code>
      </p>
    </div>
  );
}
