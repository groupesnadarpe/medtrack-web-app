"use client";

import {
  ArrowLeft,
  Building2,
  Activity,
  Check,
  Eye,
  EyeOff,
  GraduationCap,
  Hash,
  KeyRound,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import Link from "next/link";
import { type FormEvent, useId, useState } from "react";
import { routes } from "@/core/routing/routes";
import {
  congoProvinces,
  type CredentialsValues,
  type InstitutionIdentityValues,
  type InstitutionType,
  institutionTypeOptions,
  passwordRules,
} from "@/features/auth/domain/registration";
import { createFormValidator, email, firstFormFieldError, minLength, required } from "@/shared/forms";
import type { FormFieldErrors } from "@/shared/forms";
import { cn } from "@/shared/ui/utils";

type Step = 1 | 2 | 3;

const totalSteps = 3;

const typeIcons: Record<InstitutionType, typeof Activity> = {
  hospital: Activity,
  university: GraduationCap,
};

const fieldClassName =
  "w-full rounded-full border border-input bg-background py-3.5 pl-12 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-ring/30";

// Validation front-end « best effort » : l'API restera la source de vérité des règles métier.
const validateIdentity = createFormValidator<InstitutionIdentityValues>([
  { field: "name", validate: required("Renseignez le nom de l'établissement.") },
  { field: "officialId", validate: required("Renseignez le numéro d'agrément officiel.") },
  { field: "email", validate: required("Renseignez l'email institutionnel.") },
  { field: "email", validate: email("Format d'email invalide.") },
  { field: "phone", validate: required("Renseignez un numéro de téléphone.") },
  { field: "province", validate: required("Sélectionnez la province.") },
  { field: "responsibleName", validate: required("Renseignez le nom du responsable.") },
]);

const validateCredentials = createFormValidator<CredentialsValues>([
  { field: "password", validate: required("Définissez un mot de passe.") },
  { field: "password", validate: minLength(8, "Le mot de passe contient au moins 8 caractères.") },
  { field: "passwordConfirmation", validate: required("Confirmez votre mot de passe.") },
]);

export function RegisterForm() {
  const [step, setStep] = useState<Step>(1);
  const [institutionType, setInstitutionType] = useState<InstitutionType>("hospital");

  const [identity, setIdentity] = useState<InstitutionIdentityValues>({
    name: "",
    officialId: "",
    email: "",
    phone: "",
    province: "",
    responsibleName: "",
  });
  const [identityErrors, setIdentityErrors] = useState<FormFieldErrors<InstitutionIdentityValues>>({});

  const [credentials, setCredentials] = useState<CredentialsValues>({ password: "", passwordConfirmation: "" });
  const [credentialsErrors, setCredentialsErrors] = useState<FormFieldErrors<CredentialsValues>>({});

  function handleIdentitySubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const validation = validateIdentity(identity);

    if (!validation.isValid) {
      setIdentityErrors(validation.errors);

      return;
    }

    setIdentityErrors({});
    setStep(3);
  }

  function handleCredentialsSubmit(event: FormEvent<HTMLFormElement>) {
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
    // TODO(api) : soumission vers `/api/auth/register` à brancher une fois l'API disponible.
  }

  return (
    <div className="w-full rounded-3xl border border-border/70 bg-card p-8 shadow-[0_24px_60px_-40px_rgba(22,38,74,0.35)] sm:p-10">
      <span className="inline-flex rounded-full bg-primary-soft px-4 py-1.5 text-sm font-semibold text-primary-strong">
        {step === 3 ? "Étape 2/2" : `Étape ${step}/${totalSteps}`}
      </span>

      {step === 1 ? (
        <StepInstitutionType
          value={institutionType}
          onChange={setInstitutionType}
          onNext={() => setStep(2)}
        />
      ) : null}

      {step === 2 ? (
        <StepIdentity
          institutionType={institutionType}
          values={identity}
          errors={identityErrors}
          onChange={(field, value) => {
            setIdentity((current) => ({ ...current, [field]: value }));
            setIdentityErrors((current) => ({ ...current, [field]: undefined }));
          }}
          onBack={() => setStep(1)}
          onSubmit={handleIdentitySubmit}
        />
      ) : null}

      {step === 3 ? (
        <StepCredentials
          values={credentials}
          errors={credentialsErrors}
          onChange={(field, value) => {
            setCredentials((current) => ({ ...current, [field]: value }));
            setCredentialsErrors((current) => ({ ...current, [field]: undefined }));
          }}
          onBack={() => setStep(2)}
          onSubmit={handleCredentialsSubmit}
        />
      ) : null}
    </div>
  );
}

/* --- Étape 1 : choix du type d'établissement --- */

function StepInstitutionType({
  value,
  onChange,
  onNext,
}: {
  value: InstitutionType;
  onChange: (next: InstitutionType) => void;
  onNext: () => void;
}) {
  return (
    <>
      <h1 className="mt-6 font-display text-3xl font-extrabold tracking-tight text-foreground text-balance sm:text-4xl">
        Demande de compte institutionnel
      </h1>
      <p className="mt-3 text-base leading-relaxed text-muted-foreground text-pretty">
        Sélectionnez le type d&apos;établissement que vous représentez
      </p>

      <fieldset className="mt-8 grid gap-4 sm:grid-cols-2">
        <legend className="sr-only">Type d&apos;établissement</legend>

        {institutionTypeOptions.map((option) => {
          const Icon = typeIcons[option.value];
          const selected = value === option.value;

          return (
            <label
              key={option.value}
              className={cn(
                "relative flex cursor-pointer flex-col gap-4 rounded-2xl border-2 p-5 transition",
                selected
                  ? "border-primary bg-card shadow-[0_18px_40px_-30px_rgba(15,191,163,0.7)]"
                  : "border-border bg-card hover:border-primary/40",
              )}
            >
              <input
                type="radio"
                name="institutionType"
                value={option.value}
                checked={selected}
                onChange={() => onChange(option.value)}
                className="sr-only"
              />

              <span className="flex items-start justify-between">
                <span
                  aria-hidden="true"
                  className={cn(
                    "flex size-12 items-center justify-center rounded-xl transition",
                    selected ? "bg-primary-soft text-primary-strong" : "bg-muted text-muted-foreground",
                  )}
                >
                  <Icon className="size-6" strokeWidth={2.25} />
                </span>
                {selected ? (
                  <span
                    aria-hidden="true"
                    className="flex size-6 items-center justify-center rounded-full bg-primary text-primary-foreground"
                  >
                    <Check className="size-4" strokeWidth={3} />
                  </span>
                ) : null}
              </span>

              <span className="flex flex-col gap-2">
                <span className="font-display text-lg font-bold text-foreground">{option.label}</span>
                <span className="text-sm leading-relaxed text-muted-foreground text-pretty">
                  {option.description}
                </span>
              </span>
            </label>
          );
        })}
      </fieldset>

      <button type="button" onClick={onNext} className={primaryButtonClassName}>
        Suivant
      </button>

      <p className="mt-6 text-center">
        <Link href={routes.login} className="text-base font-semibold text-primary-strong transition hover:underline">
          Déjà un compte ? Se connecter
        </Link>
      </p>
    </>
  );
}

/* --- Étape 2 : identité de l'établissement --- */

function StepIdentity({
  institutionType,
  values,
  errors,
  onChange,
  onBack,
  onSubmit,
}: {
  institutionType: InstitutionType;
  values: InstitutionIdentityValues;
  errors: FormFieldErrors<InstitutionIdentityValues>;
  onChange: (field: keyof InstitutionIdentityValues, value: string) => void;
  onBack: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}) {
  const provinceFieldId = useId();
  const isHospital = institutionType === "hospital";

  return (
    <>
      <h1 className="mt-6 font-display text-3xl font-extrabold tracking-tight text-foreground text-balance sm:text-4xl">
        Informations de l&apos;établissement
      </h1>
      <p className="mt-3 text-base leading-relaxed text-muted-foreground text-pretty">
        Ces données sont vérifiées auprès du Ministère de la Santé Publique avant activation.
      </p>

      <form onSubmit={onSubmit} className="mt-8 flex flex-col gap-5" noValidate>
        <TextField
          label={isHospital ? "Nom de l'hôpital / clinique" : "Nom de l'université / faculté"}
          name="name"
          icon={Building2}
          placeholder={isHospital ? "Cliniques Universitaires de Kinshasa" : "Faculté de Médecine de Kinshasa"}
          value={values.name}
          error={firstFormFieldError(errors, "name")}
          onChange={(value) => onChange("name", value)}
        />

        <TextField
          label="Numéro d'agrément officiel"
          name="officialId"
          icon={Hash}
          placeholder="MSP-RDC-00000"
          value={values.officialId}
          error={firstFormFieldError(errors, "officialId")}
          onChange={(value) => onChange("officialId", value)}
        />

        <TextField
          label="Email institutionnel"
          name="email"
          type="email"
          icon={Mail}
          autoComplete="email"
          placeholder="contact@etablissement.cd"
          value={values.email}
          error={firstFormFieldError(errors, "email")}
          onChange={(value) => onChange("email", value)}
        />

        <TextField
          label="Téléphone"
          name="phone"
          type="tel"
          icon={Phone}
          autoComplete="tel"
          placeholder="+243 800 000 000"
          value={values.phone}
          error={firstFormFieldError(errors, "phone")}
          onChange={(value) => onChange("phone", value)}
        />

        <div className="flex flex-col gap-2">
          <label htmlFor={provinceFieldId} className="text-sm font-semibold text-foreground">
            Province
          </label>
          <div className="relative">
            <MapPin
              className="pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />
            <select
              id={provinceFieldId}
              name="province"
              value={values.province}
              onChange={(event) => onChange("province", event.target.value)}
              aria-invalid={Boolean(firstFormFieldError(errors, "province"))}
              className={cn(
                fieldClassName,
                "appearance-none pr-10",
                firstFormFieldError(errors, "province") && "border-destructive focus:border-destructive",
              )}
            >
              <option value="">Sélectionnez une province</option>
              {congoProvinces.map((province) => (
                <option key={province} value={province}>
                  {province}
                </option>
              ))}
            </select>
          </div>
          {firstFormFieldError(errors, "province") ? (
            <p role="alert" className="text-xs font-medium text-destructive">
              {firstFormFieldError(errors, "province")}
            </p>
          ) : null}
        </div>

        <TextField
          label="Responsable du compte"
          name="responsibleName"
          icon={UserRound}
          placeholder="Dr. Prénom Nom"
          value={values.responsibleName}
          error={firstFormFieldError(errors, "responsibleName")}
          onChange={(value) => onChange("responsibleName", value)}
        />

        <div className="mt-1 flex flex-col gap-3">
          <button type="submit" className={cn(primaryButtonClassName, "mt-0")}>
            Vérifier mon éligibilité
          </button>
          <BackButton onClick={onBack} />
        </div>
      </form>
    </>
  );
}

/* --- Étape 3 : création du mot de passe --- */

function StepCredentials({
  values,
  errors,
  onChange,
  onBack,
  onSubmit,
}: {
  values: CredentialsValues;
  errors: FormFieldErrors<CredentialsValues>;
  onChange: (field: keyof CredentialsValues, value: string) => void;
  onBack: () => void;
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
        Éligibilité vérifiée
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

        <div className="mt-4 flex flex-col gap-3">
          <button type="submit" className={cn(primaryButtonClassName, "mt-0")}>
            Créer mon compte
          </button>
          <BackButton onClick={onBack} />
        </div>
      </form>
    </>
  );
}

/* --- Sous-composants partagés --- */

const primaryButtonClassName =
  "mt-8 inline-flex h-14 w-full items-center justify-center gap-2 rounded-full bg-primary text-base font-semibold text-primary-foreground transition hover:bg-primary-strong focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:ring-offset-2";

function BackButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full border border-border bg-background text-sm font-semibold text-foreground transition hover:bg-muted"
    >
      <ArrowLeft className="size-4" aria-hidden="true" />
      Retour
    </button>
  );
}

function TextField({
  label,
  name,
  icon: Icon,
  value,
  error,
  onChange,
  type = "text",
  placeholder,
  autoComplete,
}: {
  label: string;
  name: string;
  icon: typeof Mail;
  value: string;
  error?: string;
  onChange: (value: string) => void;
  type?: string;
  placeholder?: string;
  autoComplete?: string;
}) {
  const fieldId = useId();

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={fieldId} className="text-sm font-semibold text-foreground">
        {label}
      </label>
      <div className="relative">
        <Icon
          className="pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2 text-muted-foreground"
          aria-hidden="true"
        />
        <input
          id={fieldId}
          name={name}
          type={type}
          autoComplete={autoComplete}
          placeholder={placeholder}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${fieldId}-error` : undefined}
          className={cn(fieldClassName, "pr-4", error && "border-destructive focus:border-destructive")}
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
