# 
#   Frontend-User Dockerfile - Multi-stage React+Vite+Nginx      
#   Build: node:20-alpine | Production: nginx:alpine (léger+sûr)    
# 

# ─────────────────────────────────────────────────────────────────
# STAGE 1: Builder (node:20-alpine)
# ─────────────────────────────────────────────────────────────────
FROM node:20-alpine AS builder

LABEL stage=builder

WORKDIR /app

#  Copier les fichiers de dépendances
COPY package*.json ./

#  npm ci = déterministe, rapide, sûr
RUN npm ci && \
    npm cache clean --force && \
    rm -rf /tmp/* /root/.npm

ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL
RUN echo "🌐 Building with VITE_API_URL: $VITE_API_URL".


#  Copier la source et construire
COPY . .
RUN npm run build

# ─────────────────────────────────────────────────────────────────
# STAGE 2: Production (nginx:alpine)
# ─────────────────────────────────────────────────────────────────
FROM nginx:1.27-alpine

LABEL maintainer="ticketing@example.com"
LABEL version="1.0"
LABEL description="Frontend-User React SPA"

#  Créer utilisateur non-root pour nginx


#  Répertoire nginx
WORKDIR /etc/nginx

#  Copier la config nginx personnalisée
COPY nginx.conf /etc/nginx/nginx.conf

#  Répertoire pour les fichiers statiques
RUN mkdir -p /usr/share/nginx/html && \
    chown -R nginx:nginx /usr/share/nginx/html && \
    chmod -R 755 /usr/share/nginx/html

#  Copier les fichiers buildés depuis le builder
COPY --from=builder --chown=nginx:nginx /app/dist /usr/share/nginx/html

#  Permissions pour nginx cache/logs
RUN chown -R nginx:nginx /var/cache/nginx /var/log/nginx && \
    touch /var/run/nginx.pid && \
    chown nginx:nginx /var/run/nginx.pid

#  Utilisateur non-root
USER nginx

#  Exposer le port
EXPOSE 80

#  Healthcheck
HEALTHCHECK --interval=30s --timeout=10s --start-period=15s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:80/ || exit 1

#  Démarrer nginx
CMD ["nginx", "-g", "daemon off;"]