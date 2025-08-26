FROM node:18-alpine AS build

WORKDIR /ui

COPY package.json yarn.lock panda.config.ts ./
RUN --mount=type=cache,target=/root/.yarn YARN_CACHE_FOLDER=/root/.yarn yarn install --frozen-lockfile
COPY . .

ARG SKIFF_ENV_ARG
ENV SKIFF_ENV=$SKIFF_ENV_ARG
ENV NODE_ENV=production
ENV VITE_API_URL=https://olmo-api.allen.ai
ENV VITE_DOLMA_API_URL=/api
RUN yarn build

FROM nginx:1.17.0-alpine

COPY nginx/nginx.conf /etc/nginx/nginx.conf

ARG CONF_FILE=nginx/prod.conf
COPY $CONF_FILE /etc/nginx/conf.d/default.conf

COPY --from=build /ui/build /var/www/ui/