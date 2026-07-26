# Mapping rôles → espaces Front-end

Ce document décrit le routage Front-end des rôles Auth vers les espaces Medtrack.

La sécurité réelle reste appliquée côté Back-end, Kong et services Laravel. Ce mapping sert uniquement à :

- choisir l'espace de redirection après login ;
- afficher la bonne navigation ;
- masquer les entrées non pertinentes côté UI.

## Mapping canonique

| Rôle Back-end | Espace Front-end | Route |
| --- | --- | --- |
| `SUPER_ADMIN` | Admin Medtrack | `/medtrack` |
| `MEDTRACK_ADMIN` | Admin Medtrack | `/medtrack` |
| `UNIVERSITY_ADMIN` | Université | `/university` |
| `INTERNSHIP_COORDINATOR` | Université | `/university` |
| `UNIVERSITY_AGENT` | Université | `/university` |
| `HOSPITAL_ADMIN` | Hôpital | `/hospital` |
| `DEPARTMENT_HEAD` | Hôpital | `/hospital` |
| `INTERNSHIP_SUPERVISOR` | Hôpital | `/hospital` |
| `FINANCE_OFFICER` | Hôpital | `/hospital` |
| `MEDICAL_ORDER_ADMIN` | Ordre des médecins | `/ordre-de-medecin` |
| `MINISTRY_AGENT` | Ministère | `/ministere` |
| `STUDENT` | Étudiant | `/student` |
| `SERVICE_ACCOUNT` | Aucun espace UI | refusé côté UI |

## Rôles custom

Les rôles custom sont rattachés par convention :

- `UNIVERSITY_*` → `/university`
- `HOSPITAL_*` → `/hospital`
- `MEDICAL_ORDER_*` → `/ordre-de-medecin`
- `MINISTRY_*` → `/ministere`
- `MEDTRACK_*` → `/medtrack`

Si un rôle custom ne respecte pas ces préfixes, il ne donne accès à aucun espace Front-end tant qu'il n'est pas explicitement ajouté au registre.

## Priorité de redirection

Si un utilisateur possède plusieurs rôles, l'espace par défaut est choisi par priorité :

1. Medtrack
2. Université
3. Hôpital
4. Ordre des médecins
5. Ministère
6. Étudiant

Le fichier source est `src/core/auth/role-access.ts`.