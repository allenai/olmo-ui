ARG UI_IMAGE
FROM $UI_IMAGE as ui

ENV NODE_ENV=production
RUN yarn build

FROM nginx:1.25.1-alpine

COPY nginx.conf /etc/nginx/nginx.conf
COPY default.conf /etc/nginx/conf.d/default.conf

COPY --from=ui /ui/build /var/www/skiff/ui/

