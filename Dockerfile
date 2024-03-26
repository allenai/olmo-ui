FROM node:18-alpine AS build

WORKDIR /ui

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile
COPY . .

ENV NODE_ENV=production
ENV LLMX_API_URL=https://olmo-api.allen.ai
ENV DOLMA_API_URL=/api
RUN yarn build

FROM nginx:1.17.0-alpine

COPY nginx/nginx.conf /etc/nginx/nginx.conf
COPY nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=build /ui/build /var/www/ui/
