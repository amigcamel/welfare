FROM alpine:3.11
WORKDIR /backup
RUN apk add --no-cache mongodb-tools
COPY cronjobs /etc/crontabs/root
COPY backup.sh /
VOLUME /backup
CMD ["crond", "-f", "-d", "8"]
