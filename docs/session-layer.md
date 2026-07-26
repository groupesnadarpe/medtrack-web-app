# Couche session Front-end

La session Medtrack est gérée côté serveur Next.js avec des cookies `HttpOnly`.

## Cookies

- `medtrack_access_token` : JWT court, utilisé par les Server Components et routes handlers.
- `medtrack_refresh_token` : token opaque optionnel, conservé pour le futur refresh.

Le code client ne lit jamais directement le JWT.

## Helpers serveur

- `getServerAuthSession()` : lit les cookies.
- `getCurrentSession()` : lit les cookies puis appelle `/auth/v1/auth/me`.
- `requireAuth()` : impose une session valide.
- `requireActorAccess(actor)` : impose une session et l'accès à l'espace demandé.

## Routes internes Next

- `POST /api/auth/login` : appelle le Back-end, pose les cookies, retourne `redirect_to`.
- `POST /api/auth/logout` : appelle le Back-end si possible puis supprime les cookies.
- `GET /api/auth/session` : expose un résumé non sensible de la session aux composants client.

## Sécurité

- Pas de token dans `localStorage`.
- Pas de secret Gateway côté Front-end.
- Les redirections venant de query string passent par `safeRedirectPath()` pour éviter les open redirects.
- Le Front-end masque les accès, mais l'autorisation réelle reste côté API/Kong/services.