ARG UI_IMAGE

FROM nginx:1.29.0-alpine-slim

COPY nginx.conf /etc/nginx/nginx.conf

ARG CONF_FILE=prod.conf
COPY $CONF_FILE /etc/nginx/conf.d/default.conf

COPY --from=$UI_IMAGE /ui/dist /var/www/skiff/ui/

