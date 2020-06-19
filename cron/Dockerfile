FROM alpine:3.11
ENV TZ Asia/Taipei
WORKDIR /backup
RUN apk add --no-cache tzdata mongodb-tools certbot \
  && ln -sfn /usr/share/zoneinfo/$TZ /etc/localtime \
  && echo $TZ > /etc/timezone \
  && cd /usr/bin \
  && ls | grep mongo | grep -v dump | xargs rm -f
COPY cronjobs /etc/crontabs/root
COPY backup.sh /
VOLUME /backup
CMD ["crond", "-f", "-d", "8"]
