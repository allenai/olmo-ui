#
# This Dockerfile is used for local development only
#
FROM node:18-alpine

ARG SKIFF_ENV_ARG
ENV SKIFF_ENV=$SKIFF_ENV_ARG
WORKDIR /ui

# Create directory for panda local package.json
RUN mkdir styled-system
COPY ./styled-system/package.json ./styled-system/package.json

COPY package.json yarn.lock panda.config.ts ./
RUN --mount=type=cache,target=/root/.yarn YARN_CACHE_FOLDER=/root/.yarn  yarn install --frozen-lockfile
COPY . .

ENTRYPOINT [ "yarn", "start" ]

