FROM node:13.14.0-alpine3.11 AS build
WORKDIR /frontend
ADD . .
RUN npm install && npm run-script build

FROM nginx:1.18.0-alpine
COPY --from=build /frontend/dist/rwelfare /usr/share/nginx/html
COPY robots.txt /usr/share/nginx/html
