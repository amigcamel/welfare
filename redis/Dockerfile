FROM redis:6.0.4-alpine3.11
RUN apk add --no-cache tzdata \
  && ln -sfn /usr/share/zoneinfo/$TZ /etc/localtime \
  && echo $TZ > /etc/timezone
