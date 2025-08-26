ARG UI_IMAGE
FROM $UI_IMAGE as ui

ENV NODE_ENV=production
RUN yarn build

FROM nginx:1.27.3-alpine

COPY nginx.conf /etc/nginx/nginx.conf

ARG CONF_FILE=prod.conf
COPY $CONF_FILE /etc/nginx/conf.d/default.conf

COPY --from=ui /ui/dist /var/www/skiff/ui/

