FROM node:13.14.0-alpine3.11 AS build
WORKDIR /frontend
ADD . .
RUN npm install && npm run-script build

FROM nginx:1.18.0-alpine
ENV TZ Asia/Taipei
COPY --from=build /frontend/dist/rwelfare /usr/share/nginx/html
COPY robots.txt /usr/share/nginx/html
RUN apk add --no-cache tzdata \
  && ln -sfn /usr/share/zoneinfo/$TZ /etc/localtime \
  && echo $TZ > /etc/timezone
