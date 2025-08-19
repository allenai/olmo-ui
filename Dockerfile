FROM node:22-alpine AS base

FROM base AS dependencies

WORKDIR /ui

COPY package.json yarn.lock panda.config.ts ./
RUN --mount=type=cache,target=/root/.yarn YARN_CACHE_FOLDER=/root/.yarn yarn install --frozen-lockfile

FROM base AS runner

COPY --from=dependencies /ui/node_modules ./node_modules
COPY --from=dependencies /ui/.yarn ./.yarn

COPY . .

FROM runner AS prod 

ARG SKIFF_ENV_ARG
ENV SKIFF_ENV=$SKIFF_ENV_ARG
ENV NODE_ENV=production
ENV VITE_API_URL=https://olmo-api.allen.ai
ENV VITE_DOLMA_API_URL=/api

RUN yarn build
