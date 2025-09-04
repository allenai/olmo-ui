FROM node:22-alpine AS base

FROM base AS dependencies

WORKDIR /ui

COPY package.json yarn.lock panda.config.ts ./
RUN --mount=type=cache,target=/root/.yarn YARN_CACHE_FOLDER=/root/.yarn yarn install --frozen-lockfile

FROM base AS runner

WORKDIR /ui

COPY --from=dependencies /ui/node_modules ./node_modules

COPY . .

FROM runner AS builder 

WORKDIR /ui

ARG SKIFF_ENV_ARG
ENV SKIFF_ENV=$SKIFF_ENV_ARG
ENV NODE_ENV=production
ENV VITE_API_URL=https://olmo-api.allen.ai
ENV VITE_DOLMA_API_URL=/api

RUN yarn build

FROM nginx:1.29-alpine AS prod

COPY nginx/nginx.conf /etc/nginx/nginx.conf

ARG CONF_FILE=nginx/prod.conf
COPY $CONF_FILE /etc/nginx/conf.d/default.conf

COPY --from=builder /ui/dist /var/www/ui/ 