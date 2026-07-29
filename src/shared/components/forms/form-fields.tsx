"use client";

import { ChevronDown, Eye, EyeOff, KeyRound } from "lucide-react";
import { type ReactNode, useId, useState } from "react";
import { cn } from "@/shared/ui/utils";

/** Habillage commun des champs du design MEDTRACK-RDC (pilule + icône à gauche). */
export const controlClassName =
  "w-full rounded-full border border-input bg-background py-3.5 pl-12 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-ring/30";

function FieldShell({
  fieldId,
  label,
  error,
  children,
}: {
  fieldId: string;
  label: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={fieldId} className="text-sm font-semibold text-foreground">
        {label}
      </label>
      {children}
      {error ? (
        <p id={`${fieldId}-error`} role="alert" className="text-xs font-medium text-destructive">
          {error}
        </p>
      ) : null}
    </div>
  );
}

function FieldIcon({ children }: { children: ReactNode }) {
  return (
    <span className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-muted-foreground [&>svg]:size-5">
      {children}
    </span>
  );
}

export function TextField({
  label,
  name,
  icon,
  value,
  error,
  onChange,
  placeholder,
  type = "text",
  inputMode,
  autoComplete,
}: {
  label: string;
  name: string;
  icon: ReactNode;
  value: string;
  error?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: "text" | "email" | "tel";
  inputMode?: "text" | "email" | "tel";
  autoComplete?: string;
}) {
  const fieldId = useId();

  return (
    <FieldShell fieldId={fieldId} label={label} error={error}>
      <div className="relative">
        <FieldIcon>{icon}</FieldIcon>
        <input
          id={fieldId}
          name={name}
          type={type}
          inputMode={inputMode}
          autoComplete={autoComplete}
          placeholder={placeholder}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${fieldId}-error` : undefined}
          className={cn(controlClassName, "pr-4", error && "border-destructive focus:border-destructive")}
        />
      </div>
    </FieldShell>
  );
}

export function SelectField({
  label,
  name,
  icon,
  value,
  error,
  onChange,
  children,
}: {
  label: string;
  name: string;
  icon: ReactNode;
  value: string;
  error?: string;
  onChange: (value: string) => void;
  children: ReactNode;
}) {
  const fieldId = useId();

  return (
    <FieldShell fieldId={fieldId} label={label} error={error}>
      <div className="relative">
        <FieldIcon>{icon}</FieldIcon>
        <select
          id={fieldId}
          name={name}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${fieldId}-error` : undefined}
          className={cn(
            controlClassName,
            "appearance-none pr-12",
            !value && "text-muted-foreground",
            error && "border-destructive focus:border-destructive",
          )}
        >
          {children}
        </select>
        <ChevronDown
          className="pointer-events-none absolute top-1/2 right-4 size-5 -translate-y-1/2 text-muted-foreground"
          aria-hidden="true"
        />
      </div>
    </FieldShell>
  );
}

export function PasswordField({
  label,
  name,
  value,
  error,
  onChange,
  autoComplete = "new-password",
}: {
  label: string;
  name: string;
  value: string;
  error?: string;
  onChange: (value: string) => void;
  autoComplete?: string;
}) {
  const fieldId = useId();
  const [visible, setVisible] = useState(false);

  return (
    <FieldShell fieldId={fieldId} label={label} error={error}>
      <div className="relative">
        <FieldIcon>
          <KeyRound aria-hidden="true" />
        </FieldIcon>
        <input
          id={fieldId}
          name={name}
          type={visible ? "text" : "password"}
          autoComplete={autoComplete}
          placeholder="••••••••"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${fieldId}-error` : undefined}
          className={cn(controlClassName, "pr-12", error && "border-destructive focus:border-destructive")}
        />
        <button
          type="button"
          onClick={() => setVisible((current) => !current)}
          className="absolute top-1/2 right-3 flex size-8 -translate-y-1/2 items-center justify-center rounded-full text-muted-foreground transition hover:bg-muted hover:text-foreground"
        >
          {visible ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
          <span className="sr-only">{visible ? "Masquer le mot de passe" : "Afficher le mot de passe"}</span>
        </button>
      </div>
    </FieldShell>
  );
}
