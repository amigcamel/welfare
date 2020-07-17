FROM python:3.8.3-alpine3.11
ENV TZ Asia/Taipei
WORKDIR /websocket
ADD . .
RUN apk update \
  && apk add --no-cache python3-dev build-base linux-headers pcre-dev libffi-dev openssl-dev musl-dev tzdata \
  && pip install pipenv==2018.11.26 \
  && pipenv install --system \
  && ln -sfn /usr/share/zoneinfo/$TZ /etc/localtime \
  && echo $TZ > /etc/timezone
EXPOSE 6789
ENTRYPOINT ["python"]
CMD ["server.py"]
