FROM node:22-alpine

WORKDIR /app

ENV NEXT_TELEMETRY_DISABLED=1
ENV HOSTNAME=0.0.0.0
ENV PORT=3000

# Les dépendances sont préparées dans l'image pour amorcer rapidement le volume node_modules.
# En développement, le code source reste monté depuis l'hôte, mais node_modules/.next restent dans Docker.
COPY package*.json /tmp/medtrack-app/
RUN cd /tmp/medtrack-app \
    && npm ci --prefer-offline --no-audit \
    && mkdir -p /opt/medtrack-app \
    && cp -a node_modules /opt/medtrack-app/node_modules

COPY docker-entrypoint.sh /usr/local/bin/medtrack-web-entrypoint
RUN chmod +x /usr/local/bin/medtrack-web-entrypoint

EXPOSE 3000

ENTRYPOINT ["medtrack-web-entrypoint"]
CMD ["npm", "run", "dev", "--", "--hostname", "0.0.0.0"]