#!/bin/sh
set -eu

# Le bind mount du projet masque les node_modules copiés dans l'image.
# On hydrate donc le volume Docker nommé au premier démarrage, sans écrire node_modules sur Windows.
if [ ! -x /app/node_modules/.bin/next ]; then
  echo "[medtrack-web] Hydratation du volume node_modules depuis l'image..."
  mkdir -p /app/node_modules
  cp -a /opt/medtrack-app/node_modules/. /app/node_modules/
fi

# Le cache Next reste dans un volume Docker nommé afin d'éviter le filesystem Windows lent.
mkdir -p /app/.next

exec "$@"