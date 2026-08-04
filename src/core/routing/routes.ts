import { actorAreas } from '@/config/actors';

// Les écrans d'authentification vivent dans le groupe (auth) : le segment n'apparaît pas dans l'URL.
export const routes = {
  home: '/',
  login: '/login',
  register: '/register',
  institutionRegister: '/institution-register',
  institutionOnboarding: '/institution-register',
  forgotPassword: '/forgot-password',
  resetPassword: '/reset-password',
  accountPending: '/account-pending',
  legal: '/mentions-legales',
  actors: actorAreas,
} as const;
