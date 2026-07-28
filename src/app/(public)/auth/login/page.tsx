import { LoginForm } from "@/features/auth/application/login-form";
import { AuthShell } from "@/shared/components/layout/auth-shell";

export default function LoginPage() {
  return (
    <AuthShell title="Connexion" subtitle="Accédez à votre espace Medtrack.">
      <LoginForm />
    </AuthShell>
  );
}