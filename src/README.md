# Structure Front-end Medtrack

Cette base utilise une clean architecture simple, volontairement légère.

- `app/` : routes Next.js, layouts et points d'entrée publics/protégés.
- `config/` : registres stables comme les acteurs institutionnels.
- `core/` : briques techniques transversales : API, auth, erreurs, routing.
- `features/` : modules métier alignés avec les services Back-end.
- `shared/` : composants et types réutilisables.

Les espaces protégés sont :

- `/student`
- `/university`
- `/hospital`
- `/ordre-de-medecin`
- `/ministere`
- `/medtrack`

Le Front-end doit communiquer avec le Back-end uniquement via l'API publique exposée par Kong/Nginx, par exemple `https://localhost/api`.
