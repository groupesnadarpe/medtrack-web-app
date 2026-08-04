"use client";

import { AlertCircle, Check, Eye, EyeOff, KeyRound, Loader2, Mail } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { type FormEvent, useId, useState } from "react";
import { env } from "@/config/env";
import { routes } from "@/core/routing/routes";
import { DemoAccounts } from "@/features/auth/ui/demo-accounts";
import { createFormValidator, firstFormFieldError, minLength, required } from "@/shared/forms";
import type { FormFieldErrors } from "@/shared/forms";
import { cn } from "@/shared/ui/utils";

type LoginValues = {
  login: string;
  password: string;
};

// Validation front-end « best effort » : l'API reste la source de vérité des règles métier.
const validateLogin = createFormValidator<LoginValues>([
  { field: "login", validate: required("Renseignez votre email, téléphone ou matricule.") },
  { field: "password", validate: required("Renseignez votre mot de passe.") },
  { field: "password", validate: minLength(8, "Le mot de passe contient au moins 8 caractères.") },
]);

const fieldClassName =
  "w-full rounded-full border border-input bg-background py-3.5 pl-12 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-ring/30";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const loginFieldId = useId();
  const passwordFieldId = useId();

  const [values, setValues] = useState<LoginValues>({ login: "", password: "" });
  const [fieldErrors, setFieldErrors] = useState<FormFieldErrors<LoginValues>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const loginError = firstFormFieldError(fieldErrors, "login");
  const passwordError = firstFormFieldError(fieldErrors, "password");
  const registrationCompleted = searchParams.get("registered") === "1";

  function updateValue(field: keyof LoginValues, value: string) {
    setValues((current) => ({ ...current, [field]: value }));
    setFieldErrors((current) => ({ ...current, [field]: undefined }));
    setFormError(null);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const validation = validateLogin(values);

    if (!validation.isValid) {
      setFieldErrors(validation.errors);

      return;
    }

    setFieldErrors({});
    setFormError(null);
    setSubmitting(true);

    const redirect = searchParams.get("redirect");
    const endpoint = redirect ? `/api/auth/login?redirect=${encodeURIComponent(redirect)}` : "/api/auth/login";

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { Accept: "application/json", "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const payload = await response.json().catch(() => null);

      if (!response.ok) {
        if (payload?.errors) setFieldErrors(payload.errors);
        setFormError(payload?.detail ?? payload?.message ?? payload?.title ?? "Identifiants invalides.");
        setSubmitting(false);
        return;
      }

      router.replace(payload?.data?.redirect_to ?? routes.home);
      router.refresh();
    } catch {
      setFormError("L'API Medtrack est momentanément indisponible.");
      setSubmitting(false);
    }
  }

  return (
    <div className="w-full max-w-md rounded-3xl border border-border/70 bg-card p-8 shadow-[0_24px_60px_-40px_rgba(22,38,74,0.35)] sm:p-10">
      <header className="flex flex-col gap-2">
        <h2 className="font-display text-2xl font-extrabold tracking-tight text-foreground">Connexion</h2>
        <p className="text-sm leading-relaxed text-muted-foreground text-pretty">
          Accédez à votre espace de travail Medtrack.
        </p>
      </header>

      {registrationCompleted ? (
        <p className="mt-6 rounded-2xl bg-success/10 px-4 py-3 text-sm font-semibold text-success">
          Votre compte a été créé. Vous pouvez maintenant vous connecter.
        </p>
      ) : null}

      <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-5" noValidate>
        <div className="flex flex-col gap-2">
          <label htmlFor={loginFieldId} className="text-sm font-semibold text-foreground">
            Email, téléphone ou matricule
          </label>
          <div className="relative">
            <Mail
              className="pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />
            <input
              id={loginFieldId}
              name="login"
              type="text"
              inputMode="email"
              autoComplete="username"
              placeholder="admin.stages@medtrack.cd"
              value={values.login}
              onChange={(event) => updateValue("login", event.target.value)}
              aria-invalid={Boolean(loginError)}
              aria-describedby={loginError ? `${loginFieldId}-error` : undefined}
              className={cn(fieldClassName, "pr-4", loginError && "border-destructive focus:border-destructive")}
            />
          </div>
          {loginError ? (
            <p id={`${loginFieldId}-error`} role="alert" className="text-xs font-medium text-destructive">
              {loginError}
            </p>
          ) : null}
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor={passwordFieldId} className="text-sm font-semibold text-foreground">
            Mot de passe
          </label>
          <div className="relative">
            <KeyRound
              className="pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />
            <input
              id={passwordFieldId}
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              placeholder="••••••••••"
              value={values.password}
              onChange={(event) => updateValue("password", event.target.value)}
              aria-invalid={Boolean(passwordError)}
              aria-describedby={passwordError ? `${passwordFieldId}-error` : undefined}
              className={cn(fieldClassName, "pr-12", passwordError && "border-destructive focus:border-destructive")}
            />
            <button
              type="button"
              onClick={() => setShowPassword((value) => !value)}
              className="absolute top-1/2 right-3 flex size-8 -translate-y-1/2 items-center justify-center rounded-full text-muted-foreground transition hover:bg-muted hover:text-foreground"
            >
              {showPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
              <span className="sr-only">
                {showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
              </span>
            </button>
          </div>
          {passwordError ? (
            <p id={`${passwordFieldId}-error`} role="alert" className="text-xs font-medium text-destructive">
              {passwordError}
            </p>
          ) : null}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            role="checkbox"
            aria-checked={rememberMe}
            onClick={() => setRememberMe((value) => !value)}
            className="group flex items-center gap-2.5 text-sm text-foreground"
          >
            <span
              aria-hidden="true"
              className={cn(
                "flex size-5 items-center justify-center rounded-md border transition",
                rememberMe
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-input bg-background text-transparent group-hover:border-primary/60",
              )}
            >
              <Check className="size-3.5" strokeWidth={3} />
            </span>
            Se souvenir de moi
          </button>
          <Link
            href={routes.forgotPassword}
            className="text-sm font-semibold text-primary-strong transition hover:underline"
          >
            Mot de passe oublié ?
          </Link>
        </div>

        {formError ? (
          <p
            role="alert"
            aria-live="polite"
            className="flex items-start gap-2 rounded-2xl bg-destructive-soft px-4 py-3 text-sm font-medium text-destructive"
          >
            <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
            {formError}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={submitting}
          className="mt-1 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-primary text-base font-semibold text-primary-foreground transition hover:bg-primary-strong focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {submitting ? <Loader2 className="size-5 animate-spin" aria-hidden="true" /> : null}
          {submitting ? "Connexion en cours..." : "Connexion à mon espace"}
        </button>
      </form>

      <div className="mt-6 space-y-2 text-center text-sm text-muted-foreground">
        <p>
          Étudiant sans compte ?{" "}
          <Link href={routes.register} className="font-semibold text-primary-strong transition hover:underline">
            Créer un compte
          </Link>
        </p>
        <p>
          Vous représentez un établissement ?{" "}
          <Link href={routes.institutionOnboarding} className="font-semibold text-primary-strong transition hover:underline">
            Créer un espace institutionnel
          </Link>
        </p>
      </div>
      {env.useMocks ? <DemoAccounts onSelect={(login, password) => setValues({ login, password })} /> : null}
    </div>
  );
}
