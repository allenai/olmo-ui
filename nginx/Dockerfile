ARG UI_IMAGE
FROM $UI_IMAGE AS ui

FROM nginx:1.29.0-alpine-slim

COPY nginx.conf /etc/nginx/nginx.conf

ARG CONF_FILE=prod.conf
COPY $CONF_FILE /etc/nginx/conf.d/default.conf

COPY --from=ui /ui/dist /var/www/skiff/ui/

