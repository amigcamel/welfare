FROM node:13.14.0-alpine3.11 AS build
WORKDIR /frontend
ADD . .
RUN npm install -g @angular/cli && npm install && ng build

FROM nginx:1.18.0-alpine
COPY --from=build /frontend/dist/fuse /usr/share/nginx/html
