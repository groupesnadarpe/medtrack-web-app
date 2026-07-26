# Medtrack — guide rapide du projet

Ce document est le point d'entrée pour toute personne ou tout agent IA qui
commence à travailler sur Medtrack.

## 1. Objectif

Medtrack est une plateforme de gestion du parcours médical et académique :

- identité et permissions ;
- institutions universitaires et hospitalières ;
- dossiers académiques ;
- admissions ;
- stages et rotations ;
- plannings et présences ;
- évaluations ;
- paiements ;
- médias ;
- notifications et emails.

Le Back-end est composé de microservices Laravel accessibles derrière Nginx et
Kong. Les services communiquent de manière asynchrone avec NATS lorsqu'un échange
HTTP direct créerait un couplage indésirable.

## 2. Acteurs de la plateforme

Medtrack met en relation six catégories d'acteurs. Chaque acteur n'accède qu'aux
données et aux actions autorisées par son rôle, ses permissions et son périmètre
organisationnel.

### Étudiants

Les étudiants utilisent un espace personnel Web ou mobile, et non un tableau de
bord administratif. Cet espace leur permet notamment de consulter ou gérer :

- leur profil et leur parcours académique ;
- leurs candidatures et admissions ;
- leurs stages, rotations, gardes et plannings ;
- leurs présences, évaluations et paiements ;
- leurs notifications.

Le rôle principal est `STUDENT`. Un étudiant ne doit jamais pouvoir sélectionner
librement une université ou un hôpital afin d'étendre son périmètre d'accès.

### Universités

Chaque université bénéficie d'un tableau de bord dédié pour :

- administrer ses agents et ses étudiants ;
- gérer les informations académiques qui relèvent de son périmètre ;
- suivre les admissions, stages, rotations et évaluations ;
- consulter ses indicateurs et obligations.

Les rôles concernés incluent `UNIVERSITY_ADMIN`, `UNIVERSITY_AGENT` et
`INTERNSHIP_COORDINATOR`. Les autorisations sont limitées au scope `UNIVERSITY`
et à l'UUID de l'université concernée.

### Hôpitaux

Chaque hôpital bénéficie d'un tableau de bord dédié pour :

- administrer son personnel autorisé ;
- gérer ses capacités d'accueil et les admissions relevant de son périmètre ;
- organiser les stages, rotations, gardes et plannings ;
- valider les présences et contribuer aux évaluations ;
- suivre les obligations financières autorisées.

Les rôles concernés incluent `HOSPITAL_ADMIN`, `DEPARTMENT_HEAD`,
`INTERNSHIP_SUPERVISOR` et `FINANCE_OFFICER`. Les autorisations sont limitées au
scope `HOSPITAL` et à l'UUID de l'hôpital concerné.

### Ordre des médecins

L'Ordre des médecins bénéficie d'un tableau de bord réglementaire dédié pour :

- administrer ses agents autorisés ;
- consulter les profils, dossiers et indicateurs explicitement permis ;
- exercer les fonctions de contrôle prévues par la plateforme.

Le rôle principal est `MEDICAL_ORDER_ADMIN`. Son accès est limité au scope
`MEDICAL_ORDER` et à l'UUID de son organisation. Ce rôle ne donne aucun accès
global implicite aux données médicales ou académiques.

### Ministère

Le Ministère bénéficie d'un tableau de bord de supervision dédié pour :

- consulter des indicateurs agrégés ;
- suivre les tendances relatives aux admissions, stages et capacités ;
- accéder aux informations réglementaires explicitement autorisées.

Le rôle principal est `MINISTRY_AGENT`. Son accès est limité au scope `MINISTRY`
et à l'UUID de son organisation. Les vues agrégées doivent être privilégiées ;
tout accès à une donnée nominative doit être justifié par une permission précise.

### Medtrack

L'équipe Medtrack bénéficie d'un tableau de bord d'administration de la
plateforme pour :

- valider les comptes nécessitant un contrôle renforcé ;
- administrer les rôles, permissions, institutions et intégrations ;
- assurer le support en s'appuyant sur les `request_id` ;
- superviser l'état opérationnel de l'infrastructure ;
- exécuter les opérations globales explicitement autorisées.

Ces comptes utilisent le type `MEDTRACK_ADMIN` et généralement le rôle
`SUPER_ADMIN`. Ils sont hautement sensibles : privilèges minimaux, traçabilité,
authentification renforcée et interdiction d'utiliser un compte administrateur
pour les opérations courantes.

### Séparation des espaces Front-end

Organisation recommandée des espaces applicatifs, sans imposer ces chemins aux
routes de l'API :

```text
/student         espace personnel étudiant
/university      tableau de bord des universités
/hospital        tableau de bord des hôpitaux
/medical-order   tableau de bord de l'Ordre des médecins
/ministry        tableau de bord du Ministère
/medtrack        administration interne Medtrack
```

Ces espaces peuvent appartenir à une même application déployée, mais doivent
conserver des layouts, navigations et modules clairement séparés. Après la
connexion, le Front-end charge les autorisations depuis
`GET /api/auth/v1/users/{user_uuid}/authorizations` et détermine l'espace
disponible avec :

- le rôle et les permissions ;
- `scope_type` et `scope_uuid` ;
- le statut du compte.

Un utilisateur possédant plusieurs périmètres doit sélectionner explicitement
son espace actif. Le Back-end reste toujours l'autorité finale : masquer un menu
ou une page dans le Front-end ne constitue jamais un contrôle de sécurité.

## 3. Architecture générale

```text
Client Web ou mobile
        |
        | HTTPS / WSS
        v
      Nginx
        |
        +----> Kong ----> services Laravel
        |
        +----> Reverb pour le temps réel

Services Laravel <----> NATS / Redis / bases de données
```

### Rôle des composants

| Composant | Responsabilité |
|---|---|
| Nginx | TLS, limites, nettoyage des en-têtes et WebSocket |
| Kong | Routage public, validation JWT et identité Gateway |
| Services Laravel | Logique métier de chaque domaine |
| NATS | Événements asynchrones entre services |
| Redis | Cache, anti-rejeu, files et état temporaire |
| Reverb | Notifications privées en temps réel |

Le client ne doit jamais appeler directement Kong, un service Laravel, Redis,
NATS ou Reverb.

## 4. Services

| Service | Domaine | Préfixe public |
|---|---|---|
| `auth-service` | Identité, sessions, rôles et permissions | `/api/auth/v1` |
| `institution-service` | Institutions et unités | `/api/institution/v1` |
| `academic-service` | Étudiants et parcours académique | `/api/academic/v1` |
| `admission-service` | Admissions et capacités | `/api/admission/v1` |
| `internship-service` | Stages et rotations | `/api/internship/v1` |
| `scheduling-service` | Planning et présences | `/api/scheduling/v1` |
| `assessment-service` | Évaluations et rapports | `/api/assessment/v1` |
| `payment-service` | Finance et paiements | `/api/payment/v1` |
| `media-service` | Médias et sessions d'upload | `/api/media/v1` |
| `notification-service` | Notifications et Reverb | `/api/notifications/v1` |
| `mail-service` | Emails | `/api/mails/v1` |

Exemple important :

```text
POST https://localhost/api/auth/v1/auth/login
```

Le chemin `/api/auth/v1/login` n'est pas la route publique de connexion.

## 5. Sécurité

### Côté public

- Les routes protégées utilisent un JWT RS256 :

  ```http
  Authorization: Bearer <access_token>
  ```

- Les routes anonymes sont explicitement déclarées dans Kong.
- Les webhooks utilisent la signature de leur fournisseur.
- Toutes les requêtes externes passent par HTTPS.

### Entre Kong et les services

Kong reconstruit une identité interne et signe la requête avec
`MEDTRACK-HMAC-V1`. Ce mécanisme est interne.

Un client ne doit jamais envoyer :

- `X-Gateway-*`
- `X-User-UUID`
- `X-Permissions`
- un secret ou une signature HMAC interservices

Ne jamais contourner un middleware de sécurité pour faire passer un test.

## 6. Dossiers importants

```text
api-docs/                    # Copies et contrat OpenAPI unifié
docker/
├── kong/                    # Configuration et plugins Kong
├── nginx/                   # TLS et reverse proxy
├── nats/                    # Comptes et permissions NATS
└── scripts/                 # Initialisation, génération et tests
docs/
├── example/                 # Guides et architectures Front-end
├── infrastructure/          # Contrats d'infrastructure
└── security/                # Contrat d'authentification Gateway
services/                    # Les onze applications Laravel
docker-compose.yml           # Environnement local complet
```

Chaque service Laravel garde ses propres :

- routes ;
- modèles et migrations ;
- cas d'utilisation et services métier ;
- tests ;
- variables d'environnement ;
- documentation OpenAPI générée.

## 7. Démarrage local

Prérequis :

- Docker Desktop ;
- PowerShell ;
- PHP et Composer pour les contrôles locaux facultatifs ;
- Python pour générer la documentation unifiée.

Les scripts d'initialisation refusent normalement d'écraser les clés existantes.
Ne les relancer que si l'artefact correspondant n'existe pas.

```powershell
# Construit notamment l'image Kong personnalisée.
docker compose build kong

# Initialisation locale, uniquement si les fichiers sont absents.
.\docker\scripts\Initialize-AuthJwtKeys.ps1
.\docker\scripts\Initialize-GatewaySecrets.ps1
.\docker\scripts\Initialize-NatsCredentials.ps1
.\docker\scripts\Initialize-NginxTlsCertificates.ps1

# Démarre APIs, workers, schedulers, NATS, Redis, Kong et Nginx.
docker compose up -d
docker compose ps
```

URL locale :

```text
https://localhost
```

Le certificat
`docker/nginx/certs/localhost.crt` doit être approuvé sur la machine locale. Il
ne faut pas désactiver globalement la validation TLS.

## 8. Documentation API

Contrat unique destiné au Front-end :

```text
api-docs/medtrack-api.openapi.json
```

Guide d'intégration :

```text
docs/api-integration-guide.md
```

Régénération et validation :

```powershell
python docker/scripts/build_unified_openapi.py
python docker/scripts/validate_unified_openapi.py
```

Lorsqu'une route, un payload, un paramètre ou une réponse change :

1. modifier le service concerné ;
2. ajouter ou adapter ses tests ;
3. mettre à jour son OpenAPI ;
4. régénérer le contrat unifié ;
5. vérifier que le Front-end n'est pas cassé.

## 9. Tests principaux

```powershell
# Contrats de routage et de sécurité.
.\docker\scripts\Test-KongRoutingContract.ps1
.\docker\scripts\Test-KongSecurityPlugins.ps1
.\docker\scripts\Test-NginxSecurityContract.ps1

# Scénarios complets : JWT, signature, rejeu, spoofing et webhooks.
.\docker\scripts\Test-InfrastructureSecurityE2e.ps1
```

Pour un service Laravel :

```powershell
Set-Location services\<nom-du-service>
php artisan test
php artisan route:list
```

Ne pas considérer une modification terminée sans une validation proportionnée à
son risque.

## 10. Événements asynchrones

NATS est protégé par comptes et permissions de subjects. Chaque service ne peut
publier ou consommer que les subjects qui lui sont attribués.

Règles :

- ne pas partager les credentials NATS entre services ;
- ne pas appeler un autre service directement par HTTP sans contrat explicite ;
- publier les changements métier importants via l'outbox lorsque le service
  utilise ce modèle ;
- rendre les consommateurs idempotents ;
- ne jamais placer un secret ou un mot de passe dans un événement.

Consulter :

```text
docs/infrastructure/nats-security-and-e2e-v1.md
docs/infrastructure/async-processes-v1.md
```

## 11. Front-end

Deux structures de référence sont disponibles :

```text
docs/example/nextjs-medtrack
docs/example/flutter-medtrack
```

Elles utilisent une architecture en couches :

```text
Présentation -> Application -> Domaine
                       ^
                       |
              Données / Infrastructure
```

Le module Front-end doit reprendre le domaine du service Back-end correspondant.
Les DTO API ne doivent pas devenir directement les modèles d'interface.

## 12. Règles pour les développeurs et agents IA

Avant de modifier le projet :

1. lire ce document ;
2. lire le contrat du domaine concerné ;
3. inspecter les routes, middlewares et tests existants ;
4. vérifier l'état des fichiers avant toute édition ;
5. préserver les changements non liés déjà présents.

Pendant la modification :

- commenter clairement le code en français ;
- considérer la sécurité comme une exigence fonctionnelle ;
- ne jamais afficher ou committer un secret ;
- ne pas affaiblir TLS, JWT, HMAC, les permissions ou l'anti-rejeu ;
- utiliser des UUID publics, jamais les identifiants numériques internes ;
- conserver les frontières entre services ;
- ajouter les tests et la documentation avec le code ;
- ne pas inventer une route : vérifier Laravel, Kong et OpenAPI.

Avant de terminer :

- exécuter les tests concernés ;
- vérifier les routes réellement chargées ;
- valider le JSON OpenAPI ;
- vérifier qu'aucun en-tête interne n'est exposé ;
- signaler clairement les limites ou contrôles non exécutés.

## 13. Documents de référence

- [`Guide d'intégration API`](../api-integration-guide.md)
- [`Contrat d'authentification Gateway`](../security/gateway-authentication-contract-v1.md)
- [`Routage public`](../infrastructure/public-routing-contract-v1.md)
- [`Sécurité Kong`](../infrastructure/kong-public-authentication-routes-v1.md)
- [`Sécurité Nginx`](../infrastructure/nginx-edge-security-v1.md)
- [`Sécurité NATS`](../infrastructure/nats-security-and-e2e-v1.md)
- [`Architecture Next.js`](nextjs-medtrack/ARCHITECTURE.md)
- [`Architecture Flutter`](flutter-medtrack/ARCHITECTURE.md)

