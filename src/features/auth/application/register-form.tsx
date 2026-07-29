"use client";

import {
  CalendarDays,
  Check,
  ChevronDown,
  Eye,
  EyeOff,
  GraduationCap,
  KeyRound,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { type FormEvent, type ReactNode, useId, useState } from "react";
import { routes } from "@/core/routing/routes";
import {
  academicYears,
  type CredentialsValues,
  defaultAcademicYear,
  passwordRules,
  type StudentEligibilityValues,
  universities,
} from "@/features/auth/domain/registration";
import { createFormValidator, firstFormFieldError, minLength, required } from "@/shared/forms";
import type { FormFieldErrors } from "@/shared/forms";
import { cn } from "@/shared/ui/utils";

type Step = 1 | 2;

const fieldClassName =
  "w-full rounded-full border border-input bg-background py-3.5 pl-12 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-ring/30";

// Validation front-end « best effort » : l'API restera la source de vérité des règles métier.
const validateEligibility = createFormValidator<StudentEligibilityValues>([
  { field: "matricule", validate: required("Renseignez votre matricule étudiant.") },
  { field: "university", validate: required("Sélectionnez votre université.") },
  { field: "academicYear", validate: required("Sélectionnez l'année académique.") },
]);

const validateCredentials = createFormValidator<CredentialsValues>([
  { field: "password", validate: required("Définissez un mot de passe.") },
  { field: "password", validate: minLength(8, "Le mot de passe contient au moins 8 caractères.") },
  { field: "passwordConfirmation", validate: required("Confirmez votre mot de passe.") },
]);

export function RegisterForm() {
  const router = useRouter();
  const [step, setStep] = useState<Step>(1);

  const [eligibility, setEligibility] = useState<StudentEligibilityValues>({
    matricule: "",
    university: "",
    academicYear: defaultAcademicYear,
  });
  const [eligibilityErrors, setEligibilityErrors] = useState<FormFieldErrors<StudentEligibilityValues>>({});

  const [credentials, setCredentials] = useState<CredentialsValues>({ password: "", passwordConfirmation: "" });
  const [credentialsErrors, setCredentialsErrors] = useState<FormFieldErrors<CredentialsValues>>({});
  const [registrationClaimToken, setRegistrationClaimToken] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  async function handleEligibilitySubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const validation = validateEligibility(eligibility);

    if (!validation.isValid) {
      setEligibilityErrors(validation.errors);

      return;
    }

    setEligibilityErrors({});
    setFormError(null);

    try {
      const response = await fetch("/api/auth/student-registration-claim", {
        method: "POST",
        headers: { Accept: "application/json", "Content-Type": "application/json" },
        body: JSON.stringify({
          student_matricule_number: eligibility.matricule,
          university_uuid: eligibility.university,
          academic_year: eligibility.academicYear,
        }),
      });
      const payload = await response.json().catch(() => null);

      if (!response.ok) {
        setFormError(payload?.detail ?? payload?.message ?? payload?.title ?? "Dossier académique introuvable.");
        return;
      }

      setRegistrationClaimToken(payload?.data?.registration_claim_token ?? null);
      setStep(2);
    } catch {
      setFormError("Academic-service est momentanément indisponible.");
    }
  }

  async function handleCredentialsSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const validation = validateCredentials(credentials);
    const errors = { ...validation.errors };

    if (credentials.password !== credentials.passwordConfirmation) {
      errors.passwordConfirmation = ["Les deux mots de passe ne correspondent pas."];
    }

    if (Object.keys(errors).length > 0) {
      setCredentialsErrors(errors);

      return;
    }

    setCredentialsErrors({});
    setFormError(null);

    if (!registrationClaimToken) {
      setFormError("La preuve d'éligibilité est absente ou expirée. Recommencez la vérification.");
      setStep(1);
      return;
    }

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { Accept: "application/json", "Content-Type": "application/json" },
        body: JSON.stringify({
          registration_claim_token: registrationClaimToken,
          password: credentials.password,
          password_confirmation: credentials.passwordConfirmation,
        }),
      });
      const payload = await response.json().catch(() => null);

      if (!response.ok) {
        if (payload?.errors) setCredentialsErrors(payload.errors);
        setFormError(payload?.detail ?? payload?.message ?? payload?.title ?? "Impossible de créer le compte.");
        return;
      }

      router.replace(`${routes.login}?registered=1`);
    } catch {
      setFormError("Auth-service est momentanément indisponible.");
    }
  }

  return (
    <div className="w-full rounded-3xl border border-border/70 bg-card p-8 shadow-[0_24px_60px_-40px_rgba(22,38,74,0.35)] sm:p-10">
      <span className="inline-flex rounded-full bg-primary-soft px-4 py-1.5 text-sm font-semibold text-primary-strong">
        Étape {step}/2
      </span>

      {step === 1 ? (
        <StepEligibility
          values={eligibility}
          errors={eligibilityErrors}
          onChange={(field, value) => {
            setEligibility((current) => ({ ...current, [field]: value }));
            setEligibilityErrors((current) => ({ ...current, [field]: undefined }));
          }}
          onSubmit={handleEligibilitySubmit}
        />
      ) : (
        <StepCredentials
          values={credentials}
          errors={credentialsErrors}
          onChange={(field, value) => {
            setCredentials((current) => ({ ...current, [field]: value }));
            setCredentialsErrors((current) => ({ ...current, [field]: undefined }));
          }}
          onSubmit={handleCredentialsSubmit}
        />
      )}
    </div>
  );
}

/* --- Étape 1 : vérification d'éligibilité --- */

function StepEligibility({
  values,
  errors,
  onChange,
  onSubmit,
}: {
  values: StudentEligibilityValues;
  errors: FormFieldErrors<StudentEligibilityValues>;
  onChange: (field: keyof StudentEligibilityValues, value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}) {
  const matriculeFieldId = useId();

  return (
    <>
      <h1 className="mt-6 font-display text-3xl font-extrabold tracking-tight text-foreground text-balance sm:text-4xl">
        Demande d&apos;inscription
      </h1>
      <p className="mt-3 text-base leading-relaxed text-muted-foreground text-pretty">
        Vérifiez votre éligibilité auprès de votre université
      </p>

      <form onSubmit={onSubmit} className="mt-8 flex flex-col gap-5" noValidate>
        <div className="flex flex-col gap-2">
          <label htmlFor={matriculeFieldId} className="text-sm font-semibold text-foreground">
            Matricule étudiant
          </label>
          <div className="relative">
            <UserRound
              className="pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />
            <input
              id={matriculeFieldId}
              name="matricule"
              type="text"
              placeholder="52RGD-6SGT6-V6HZ7"
              value={values.matricule}
              onChange={(event) => onChange("matricule", event.target.value)}
              aria-invalid={Boolean(firstFormFieldError(errors, "matricule"))}
              className={cn(
                fieldClassName,
                "pr-4",
                firstFormFieldError(errors, "matricule") && "border-destructive focus:border-destructive",
              )}
            />
          </div>
          <FieldError message={firstFormFieldError(errors, "matricule")} />
        </div>

        <SelectField
          label="Université"
          name="university"
          icon={<GraduationCap className="size-5" aria-hidden="true" />}
          value={values.university}
          error={firstFormFieldError(errors, "university")}
          onChange={(value) => onChange("university", value)}
        >
          <option value="">Sélectionnez votre université</option>
          {universities.map((university) => (
            <option key={university.uuid} value={university.uuid}>
              {university.name}
            </option>
          ))}
        </SelectField>

        <SelectField
          label="Année académique"
          name="academicYear"
          icon={<CalendarDays className="size-5" aria-hidden="true" />}
          value={values.academicYear}
          error={firstFormFieldError(errors, "academicYear")}
          onChange={(value) => onChange("academicYear", value)}
        >
          {academicYears.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </SelectField>

        <button type="submit" className={primaryButtonClassName}>
          Vérifier mon éligibilité
        </button>
      </form>

      <p className="mt-6 text-center">
        <Link href={routes.login} className="text-base font-semibold text-primary-strong transition hover:underline">
          Déjà un compte ? Se connecter
        </Link>
      </p>
    </>
  );
}

/* --- Étape 2 : création du mot de passe --- */

function StepCredentials({
  values,
  errors,
  onChange,
  onSubmit,
}: {
  values: CredentialsValues;
  errors: FormFieldErrors<CredentialsValues>;
  onChange: (field: keyof CredentialsValues, value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}) {
  return (
    <>
      <h1 className="mt-6 font-display text-3xl font-extrabold tracking-tight text-foreground text-balance sm:text-4xl">
        Créer votre compte
      </h1>
      <p className="mt-3 text-base leading-relaxed text-muted-foreground text-pretty">
        Votre éligibilité a été confirmée. Définissez votre mot de passe.
      </p>

      <p className="mt-6 flex items-center gap-3 rounded-2xl bg-success/10 px-5 py-4 text-base font-semibold text-success">
        <ShieldCheck className="size-5 shrink-0" aria-hidden="true" />
        Éligibilité vérifiée ✓
      </p>

      <form onSubmit={onSubmit} className="mt-6 flex flex-col gap-5" noValidate>
        <PasswordField
          label="Mot de passe"
          name="password"
          autoComplete="new-password"
          value={values.password}
          error={firstFormFieldError(errors, "password")}
          onChange={(value) => onChange("password", value)}
        />

        <PasswordField
          label="Confirmer le mot de passe"
          name="passwordConfirmation"
          autoComplete="new-password"
          value={values.passwordConfirmation}
          error={firstFormFieldError(errors, "passwordConfirmation")}
          onChange={(value) => onChange("passwordConfirmation", value)}
        />

        <ul className="mt-2 flex flex-col gap-2.5">
          {passwordRules.map((rule) => {
            const satisfied = rule.test(values.password);

            return (
              <li key={rule.id} className="flex items-center gap-3 text-sm">
                <span
                  aria-hidden="true"
                  className={cn(
                    "flex size-5 shrink-0 items-center justify-center rounded-full border-2 transition",
                    satisfied
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border text-transparent",
                  )}
                >
                  <Check className="size-3" strokeWidth={3.5} />
                </span>
                <span className={satisfied ? "font-medium text-foreground" : "text-muted-foreground"}>
                  {rule.label}
                </span>
                <span className="sr-only">{satisfied ? "critère respecté" : "critère non respecté"}</span>
              </li>
            );
          })}
        </ul>

        <button type="submit" className={cn(primaryButtonClassName, "mt-4")}>
          Créer mon compte
        </button>
      </form>
    </>
  );
}

/* --- Sous-composants partagés --- */

const primaryButtonClassName =
  "mt-4 inline-flex h-14 w-full items-center justify-center gap-2 rounded-full bg-primary text-base font-semibold text-primary-foreground transition hover:bg-primary-strong focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:ring-offset-2";

function FieldError({ message }: { message?: string }) {
  if (!message) {
    return null;
  }

  return (
    <p role="alert" className="text-xs font-medium text-destructive">
      {message}
    </p>
  );
}

function SelectField({
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
    <div className="flex flex-col gap-2">
      <label htmlFor={fieldId} className="text-sm font-semibold text-foreground">
        {label}
      </label>
      <div className="relative">
        <span className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-muted-foreground">
          {icon}
        </span>
        <select
          id={fieldId}
          name={name}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${fieldId}-error` : undefined}
          className={cn(
            fieldClassName,
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
      {error ? (
        <p id={`${fieldId}-error`} role="alert" className="text-xs font-medium text-destructive">
          {error}
        </p>
      ) : null}
    </div>
  );
}

function PasswordField({
  label,
  name,
  value,
  error,
  onChange,
  autoComplete,
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
    <div className="flex flex-col gap-2">
      <label htmlFor={fieldId} className="text-sm font-semibold text-foreground">
        {label}
      </label>
      <div className="relative">
        <KeyRound
          className="pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2 text-muted-foreground"
          aria-hidden="true"
        />
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
          className={cn(fieldClassName, "pr-12", error && "border-destructive focus:border-destructive")}
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
      {error ? (
        <p id={`${fieldId}-error`} role="alert" className="text-xs font-medium text-destructive">
          {error}
        </p>
      ) : null}
    </div>
  );
}
