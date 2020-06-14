FROM alpine:3.11
WORKDIR /backup
RUN apk add --no-cache mongodb-tools \
  && cd /usr/bin \
  && ls | grep mongo | grep -v dump | xargs rm -f
COPY cronjobs /etc/crontabs/root
COPY backup.sh /
VOLUME /backup
CMD ["crond", "-f", "-d", "8"]
