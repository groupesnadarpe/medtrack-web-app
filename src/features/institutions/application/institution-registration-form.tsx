"use client";

import {
  Activity,
  Building2,
  BriefcaseBusiness,
  Check,
  Clock,
  GraduationCap,
  Mail,
  Phone,
  ShieldCheck,
  UserRound,
  UsersRound,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { type FormEvent, type ReactNode, useId, useState } from "react";
import { routes } from "@/core/routing/routes";
import {
  type AdminIdentityValues,
  genderOptions,
  institutionNamePlaceholder,
  type InstitutionSecurityValues,
  type InstitutionTypeValues,
  requestableInstitutionTypes,
  type RequestableInstitutionType,
  reviewDelayLabel,
} from "@/features/institutions/domain/institution-registration";
import { PasswordField, SelectField, TextField } from "@/shared/components/forms/form-fields";
import { createFormValidator, email, firstFormFieldError, minLength, required } from "@/shared/forms";
import type { FormFieldErrors } from "@/shared/forms";

type OnboardingResponse = {
  request_uuid: string;
  claim_token: string;
  claim_token_expires_at: string;
  status: string;
};
import { cn } from "@/shared/ui/utils";

type Step = 1 | 2 | 3;

// Validation front-end « » : l'API restera la source de vérité.
const validateIdentity = createFormValidator<AdminIdentityValues>([
  { field: "lastName", validate: required("Renseignez votre nom.") },
  { field: "postName", validate: required("Renseignez votre post-nom.") },
  { field: "firstName", validate: required("Renseignez votre prénom.") },
  { field: "gender", validate: required("Sélectionnez votre genre.") },
  { field: "email", validate: required("Renseignez votre email professionnel.") },
  { field: "email", validate: email() },
  { field: "phone", validate: required("Renseignez votre numéro de téléphone.") },
  { field: "personalIdentifier", validate: required("Renseignez votre identifiant personnel.") },
  { field: "jobTitle", validate: required("Renseignez votre poste ou fonction.") },
]);

const validateSecurity = createFormValidator<InstitutionSecurityValues>([
  { field: "institutionName", validate: required("Renseignez le nom de votre établissement.") },
  { field: "password", validate: required("Définissez un mot de passe.") },
  { field: "password", validate: minLength(8, "Le mot de passe contient au moins 8 caractères.") },
  { field: "passwordConfirmation", validate: required("Confirmez votre mot de passe.") },
]);

const primaryButtonClassName =
  "inline-flex h-14 w-full items-center justify-center gap-2 rounded-full bg-primary text-base font-semibold text-primary-foreground transition hover:bg-primary-strong focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:ring-offset-2";

const secondaryButtonClassName =
  "inline-flex h-14 w-full items-center justify-center gap-2 rounded-full border border-primary bg-card text-base font-semibold text-primary-strong transition hover:bg-primary-soft focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:ring-offset-2";

export function InstitutionRegistrationForm() {
  const router = useRouter();
  const [step, setStep] = useState<Step>(1);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [onboarding, setOnboarding] = useState<OnboardingResponse | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [typeValues, setTypeValues] = useState<InstitutionTypeValues>({ institutionType: "" });
  const [typeError, setTypeError] = useState<string | undefined>(undefined);

  const [identity, setIdentity] = useState<AdminIdentityValues>({
    lastName: "",
    postName: "",
    firstName: "",
    gender: "",
    email: "",
    phone: "",
    personalIdentifier: "",
    jobTitle: "",
  });
  const [identityErrors, setIdentityErrors] = useState<FormFieldErrors<AdminIdentityValues>>({});

  const [security, setSecurity] = useState<InstitutionSecurityValues>({
    institutionName: "",
    password: "",
    passwordConfirmation: "",
    termsAccepted: false,
  });
  const [securityErrors, setSecurityErrors] = useState<FormFieldErrors<InstitutionSecurityValues>>({});

  function handleTypeSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!typeValues.institutionType) {
      setTypeError("Sélectionnez le type d'établissement que vous représentez.");
      return;
    }

    // L'étape 1 ne crée aucune ressource côté serveur : elle sert uniquement
    // à mémoriser le choix de l'utilisateur avant de poursuivre le formulaire.
    setTypeError(undefined);
    setFormError(null);
    setStep(2);
  }

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

  async function handleSecuritySubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const validation = validateSecurity(security);
    const errors: FormFieldErrors<InstitutionSecurityValues> = { ...validation.errors };

    if (security.password && security.password !== security.passwordConfirmation) {
      errors.passwordConfirmation = ["Les deux mots de passe ne correspondent pas."];
    }

    if (!security.termsAccepted) {
      errors.termsAccepted = ["Vous devez attester l'exactitude des informations fournies."];
    }

    if (Object.keys(errors).length > 0) {
      setSecurityErrors(errors);
      // Affiche une erreur globale pour rendre le refus local immédiatement visible.
      setFormError("Veuillez corriger les champs signalés avant de soumettre votre demande.");
      return;
    }

    setSecurityErrors({});
    setFormError(null);
    setSubmitting(true);

    try {
      let currentOnboarding = onboarding;

      if (!currentOnboarding) {
        // La demande est créée uniquement à la soumission finale, lorsque les
        // trois étapes ont été entièrement renseignées et validées côté client.
        const onboardingResponse = await fetch("/api/institution/onboarding-requests", {
          method: "POST",
          headers: { Accept: "application/json", "Content-Type": "application/json" },
          body: JSON.stringify({
            institution_name: security.institutionName,
            institution_type: typeValues.institutionType.toLowerCase(),
            admin_first_name: identity.firstName,
            admin_middle_name: identity.postName || null,
            admin_last_name: identity.lastName,
            admin_email: identity.email,
            admin_phone_number: identity.phone || null,
            metadata: {
              staff_identifier: identity.personalIdentifier || null,
              job_title: identity.jobTitle || null,
              ui_flow: "institution_registration_v2",
            },
          }),
        });

        const onboardingPayload = await onboardingResponse.json().catch(() => null);

        if (!onboardingResponse.ok) {
          setFormError(
            onboardingPayload?.detail ??
              onboardingPayload?.message ??
              onboardingPayload?.title ??
              "Impossible de créer la demande institutionnelle.",
          );
          return;
        }

        // Le proxy peut envelopper la réponse dans `data`. Cette compatibilité
        // permet aussi de gérer temporairement la réponse directe du service.
        currentOnboarding = onboardingPayload?.data ?? onboardingPayload;

        if (!currentOnboarding?.request_uuid || !currentOnboarding?.claim_token) {
          setFormError("La réponse du service institutionnel est incomplète.");
          return;
        }

        // Le jeton est gardé pour éviter une demande en double si auth-service
        // échoue et que l'utilisateur soumet à nouveau le formulaire.
        setOnboarding(currentOnboarding);
      }

      const response = await fetch("/api/auth/institution-account-validations", {
        method: "POST",
        headers: { Accept: "application/json", "Content-Type": "application/json" },
        body: JSON.stringify({
          onboarding_request_uuid: currentOnboarding.request_uuid,
          claim_token: currentOnboarding.claim_token,
          institution_type: typeValues.institutionType.toLowerCase(),
          institution_name: security.institutionName,
          admin_first_name: identity.firstName,
          admin_middle_name: identity.postName || null,
          admin_last_name: identity.lastName,
          admin_gender: identity.gender,
          admin_email: identity.email,
          admin_phone_number: identity.phone || null,
          staff_identifier: identity.personalIdentifier || null,
          job_title: identity.jobTitle || null,
          password: security.password,
          password_confirmation: security.passwordConfirmation,
          metadata: {
            institution_label: security.institutionName,
            ui_flow: "institution_registration_v2",
          },
        }),
      });

      const payload = await response.json().catch(() => null);

      if (!response.ok) {
        setFormError(payload?.detail ?? payload?.message ?? payload?.title ?? "Impossible de transmettre la demande.");
        setSubmitting(false);
        return;
      }

      setSubmitted(true);
      window.sessionStorage.setItem(
        "medtrack.pending-account-validation",
        JSON.stringify({
          ...(payload?.data ?? payload),
          institution_name: security.institutionName,
          email: identity.email,
        }),
      );
      router.push(routes.accountPending);
    } catch {
      setFormError("Le service d'inscription institutionnelle est momentanément indisponible.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="w-full rounded-3xl border border-border/70 bg-card p-8 shadow-[0_24px_60px_-40px_rgba(22,38,74,0.35)] sm:p-10">
      {submitted ? (
        <SubmissionSummary institutionName={security.institutionName} email={identity.email} />
      ) : (
        <>
          <span className="inline-flex rounded-full bg-primary-soft px-4 py-1.5 text-sm font-semibold text-primary-strong">
            Etape {step}/3
          </span>

          {step === 1 ? (
            <StepInstitutionType
              value={typeValues.institutionType}
              error={typeError}
              formError={formError}
              submitting={submitting}
              onSelect={(value) => {
                setTypeValues({ institutionType: value });
                setTypeError(undefined);
                // Un changement de type invalide tout jeton déjà émis.
                setOnboarding(null);
              }}
              onSubmit={handleTypeSubmit}
            />
          ) : null}

          {step === 2 ? (
            <StepAdminIdentity
              values={identity}
              errors={identityErrors}
              onChange={(field, value) => {
                setIdentity((current) => ({ ...current, [field]: value }));
                setIdentityErrors((current) => ({ ...current, [field]: undefined }));
                // Les informations signées doivent rester identiques entre les deux services.
                setOnboarding(null);
              }}
              onBack={() => setStep(1)}
              onSubmit={handleIdentitySubmit}
            />
          ) : null}

          {step === 3 ? (
            <StepAccountSecurity
              values={security}
              errors={securityErrors}
              formError={formError}
              submitting={submitting}
              onChange={(field, value) => {
                setSecurity((current) => ({ ...current, [field]: value }));
                setSecurityErrors((current) => ({ ...current, [field]: undefined }));
                if (field === "institutionName") {
                  // Le nom est inclus dans le jeton signé : toute modification exige un nouveau jeton.
                  setOnboarding(null);
                }
              }}
              onBack={() => setStep(2)}
              onSubmit={handleSecuritySubmit}
            />
          ) : null}
        </>
      )}
    </div>
  );
}

function StepHeading({ title, description }: { title: string; description: string }) {
  return (
    <>
      <h1 className="mt-6 font-display text-3xl font-extrabold tracking-tight text-foreground text-balance sm:text-4xl">
        {title}
      </h1>
      <p className="mt-3 text-base leading-relaxed text-muted-foreground text-pretty">{description}</p>
    </>
  );
}

const institutionTypeIcons: Record<RequestableInstitutionType, ReactNode> = {
  HOSPITAL: <Activity className="size-6" aria-hidden="true" />,
  UNIVERSITY: <GraduationCap className="size-6" aria-hidden="true" />,
};

function StepInstitutionType({
  value,
  error,
  formError,
  submitting,
  onSelect,
  onSubmit,
}: {
  value: InstitutionTypeValues["institutionType"];
  error?: string;
  formError: string | null;
  submitting: boolean;
  onSelect: (value: RequestableInstitutionType) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}) {
  const groupLabelId = useId();

  return (
    <>
      <StepHeading
        title="Demande de compte institutionnel"
        description="Sélectionnez le type d'établissement que vous représentez"
      />

      <form onSubmit={onSubmit} className="mt-8 flex flex-col gap-6" noValidate>
        <fieldset className="flex flex-col gap-3">
          <legend id={groupLabelId} className="sr-only">
            Type d&apos;établissement
          </legend>

          <div className="grid gap-4 sm:grid-cols-2">
            {requestableInstitutionTypes.map((option) => {
              const selected = value === option.value;

              return (
                <button
                  key={option.value}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  onClick={() => onSelect(option.value)}
                  className={cn(
                    "flex flex-col items-start gap-4 rounded-2xl border p-5 text-left transition",
                    selected
                      ? "border-primary bg-card shadow-[0_18px_40px_-32px_rgba(13,148,136,0.55)]"
                      : "border-border/70 bg-muted/30 hover:border-primary/50 hover:bg-card",
                  )}
                >
                  <span className="flex w-full items-start justify-between gap-3">
                    <span
                      className={cn(
                        "flex size-12 items-center justify-center rounded-xl transition",
                        selected ? "bg-primary-soft text-primary-strong" : "bg-muted text-muted-foreground",
                      )}
                    >
                      {institutionTypeIcons[option.value]}
                    </span>
                    <span
                      aria-hidden="true"
                      className={cn(
                        "flex size-6 items-center justify-center rounded-full transition",
                        selected ? "bg-primary text-primary-foreground" : "bg-transparent text-transparent",
                      )}
                    >
                      <Check className="size-3.5" strokeWidth={3.5} />
                    </span>
                  </span>

                  <span className="flex flex-col gap-1.5">
                    <span className="font-display text-lg font-bold text-foreground">{option.title}</span>
                    <span className="text-sm leading-relaxed text-muted-foreground text-pretty">
                      {option.description}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>

          {error ? (
            <p role="alert" className="text-xs font-medium text-destructive">
              {error}
            </p>
          ) : null}
        </fieldset>

        {formError ? (
          <p role="alert" className="rounded-2xl bg-destructive-soft px-4 py-3 text-sm font-medium text-destructive">
            {formError}
          </p>
        ) : null}

        <button type="submit" disabled={submitting} className={cn(primaryButtonClassName, "disabled:cursor-not-allowed disabled:opacity-70") }>
          {submitting ? "Création de la demande..." : "Suivant"}
        </button>
      </form>

      <div className="mt-6 space-y-2 text-center">
        <p>
          <Link href={routes.login} className="text-base font-semibold text-primary-strong transition hover:underline">
            Déjà un compte ? Se connecter
          </Link>
        </p>
        <p className="text-sm text-muted-foreground">
          Vous êtes étudiant ?{" "}
          <Link href={routes.register} className="font-semibold text-primary-strong hover:underline">
            Créer un compte étudiant
          </Link>
        </p>
      </div>
    </>
  );
}

function StepAdminIdentity({
  values,
  errors,
  onChange,
  onBack,
  onSubmit,
}: {
  values: AdminIdentityValues;
  errors: FormFieldErrors<AdminIdentityValues>;
  onChange: (field: keyof AdminIdentityValues, value: string) => void;
  onBack: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}) {
  return (
    <>
      <StepHeading
        title="Vos informations personnelles"
        description="Ces informations seront vérifiées par notre équipe"
      />

      <form onSubmit={onSubmit} className="mt-8 flex flex-col gap-5" noValidate>
        <div className="grid gap-5 sm:grid-cols-2">
          <TextField
            label="Nom"
            name="lastName"
            icon={<UserRound aria-hidden="true" />}
            placeholder="Kasongo"
            autoComplete="family-name"
            value={values.lastName}
            error={firstFormFieldError(errors, "lastName")}
            onChange={(value) => onChange("lastName", value)}
          />

          <TextField
            label="Post-nom"
            name="postName"
            icon={<UserRound aria-hidden="true" />}
            placeholder="Mbuyi"
            value={values.postName}
            error={firstFormFieldError(errors, "postName")}
            onChange={(value) => onChange("postName", value)}
          />

          <TextField
            label="Prénom"
            name="firstName"
            icon={<UserRound aria-hidden="true" />}
            placeholder="Grace"
            autoComplete="given-name"
            value={values.firstName}
            error={firstFormFieldError(errors, "firstName")}
            onChange={(value) => onChange("firstName", value)}
          />

          <SelectField
            label="Genre"
            name="gender"
            icon={<UsersRound aria-hidden="true" />}
            value={values.gender}
            error={firstFormFieldError(errors, "gender")}
            onChange={(value) => onChange("gender", value)}
          >
            <option value="">Sélectionnez votre genre</option>
            {genderOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </SelectField>

          <TextField
            label="Email professionnel"
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            icon={<Mail aria-hidden="true" />}
            placeholder="admin@hopital.example"
            value={values.email}
            error={firstFormFieldError(errors, "email")}
            onChange={(value) => onChange("email", value)}
          />

          <TextField
            label="Téléphone"
            name="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            icon={<Phone aria-hidden="true" />}
            placeholder="+243 810000099"
            value={values.phone}
            error={firstFormFieldError(errors, "phone")}
            onChange={(value) => onChange("phone", value)}
          />

          <TextField
            label="Identifiant personnel"
            name="personalIdentifier"
            icon={<BriefcaseBusiness aria-hidden="true" />}
            placeholder="HOSP-ADMIN-002"
            value={values.personalIdentifier}
            error={firstFormFieldError(errors, "personalIdentifier")}
            onChange={(value) => onChange("personalIdentifier", value)}
          />

          <TextField
            label="Poste/Fonction"
            name="jobTitle"
            icon={<BriefcaseBusiness aria-hidden="true" />}
            placeholder="Directrice administrative"
            value={values.jobTitle}
            error={firstFormFieldError(errors, "jobTitle")}
            onChange={(value) => onChange("jobTitle", value)}
          />
        </div>

        <StepActions backLabel="Retour" submitLabel="Suivant" onBack={onBack} />
      </form>
    </>
  );
}

function StepAccountSecurity({
  values,
  errors,
  formError,
  submitting,
  onChange,
  onBack,
  onSubmit,
}: {
  values: InstitutionSecurityValues;
  errors: FormFieldErrors<InstitutionSecurityValues>;
  formError: string | null;
  submitting: boolean;
  onChange: (field: keyof InstitutionSecurityValues, value: string | boolean) => void;
  onBack: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}) {
  const termsError = firstFormFieldError(errors, "termsAccepted");

  return (
    <>
      <StepHeading
        title="Sécurisez votre compte"
        description="Définissez un mot de passe sécurisé pour finaliser votre demande"
      />

      <form onSubmit={onSubmit} className="mt-8 flex flex-col gap-5" noValidate>
        <TextField
          label="Nom de votre établissement"
          name="institutionName"
          icon={<Building2 aria-hidden="true" />}
          placeholder="Nom officiel de votre établissement"
          autoComplete="organization"
          value={values.institutionName}
          error={firstFormFieldError(errors, "institutionName")}
          onChange={(value) => onChange("institutionName", value)}
        />

        <PasswordField
          label="Mot de passe"
          name="password"
          value={values.password}
          error={firstFormFieldError(errors, "password")}
          onChange={(value) => onChange("password", value)}
        />

        <PasswordField
          label="Confirmer le mot de passe"
          name="passwordConfirmation"
          value={values.passwordConfirmation}
          error={firstFormFieldError(errors, "passwordConfirmation")}
          onChange={(value) => onChange("passwordConfirmation", value)}
        />

        <div className="flex flex-col gap-2">
          <button
            type="button"
            role="checkbox"
            aria-checked={values.termsAccepted}
            onClick={() => onChange("termsAccepted", !values.termsAccepted)}
            className="group flex items-start gap-3 text-left text-sm leading-relaxed text-foreground"
          >
            <span
              aria-hidden="true"
              className={cn(
                "mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-md border transition",
                values.termsAccepted
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-input bg-background text-transparent group-hover:border-primary/60",
              )}
            >
              <Check className="size-3.5" strokeWidth={3} />
            </span>
            <span className="text-pretty">
              J&apos;atteste que les informations fournies sont exactes et je m&apos;engage à respecter les conditions
              d&apos;utilisation.
            </span>
          </button>
          {termsError ? (
            <p role="alert" className="text-xs font-medium text-destructive">
              {termsError}
            </p>
          ) : null}
        </div>

        {formError ? (
          <p role="alert" className="rounded-2xl bg-destructive-soft px-4 py-3 text-sm font-medium text-destructive">
            {formError}
          </p>
        ) : null}

        <StepActions
          backLabel="Retour"
          submitLabel={submitting ? "Envoi en cours..." : "Soumettre ma demande"}
          onBack={onBack}
          disabled={submitting}
        />

        <p className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <Clock className="size-4 shrink-0" aria-hidden="true" />
          {reviewDelayLabel}
        </p>
      </form>
    </>
  );
}

function SubmissionSummary({ institutionName, email }: { institutionName: string; email: string }) {
  return (
    <div className="flex flex-col items-center gap-4 py-6 text-center">
      <span className="flex size-16 items-center justify-center rounded-full bg-success/10 text-success">
        <ShieldCheck className="size-8" aria-hidden="true" />
      </span>
      <h1 className="font-display text-3xl font-extrabold tracking-tight text-foreground text-balance">
        Demande transmise
      </h1>
      <p className="max-w-md text-base leading-relaxed text-muted-foreground text-pretty">
        La demande de compte institutionnel pour <strong className="text-foreground">{institutionName}</strong> a été
        enregistrée. Un email de suivi sera envoyé à <strong className="text-foreground">{email}</strong>.
      </p>
      <p className="flex items-center gap-2 text-sm text-muted-foreground">
        <Clock className="size-4 shrink-0" aria-hidden="true" />
        {reviewDelayLabel}
      </p>
      <Link href={routes.login} className={cn(primaryButtonClassName, "mt-2 max-w-xs")}>
        Retour à la connexion
      </Link>
    </div>
  );
}

function StepActions({
  backLabel,
  submitLabel,
  onBack,
  disabled = false,
}: {
  backLabel: string;
  submitLabel: string;
  onBack: () => void;
  disabled?: boolean;
}) {
  return (
    <div className="mt-2 grid gap-4 sm:grid-cols-2">
      <button type="button" onClick={onBack} disabled={disabled} className={secondaryButtonClassName}>
        {backLabel}
      </button>
      <button
        type="submit"
        disabled={disabled}
        className={cn(primaryButtonClassName, "disabled:cursor-not-allowed disabled:opacity-70")}
      >
        {submitLabel}
      </button>
    </div>
  );
}