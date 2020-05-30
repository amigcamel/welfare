FROM python:3.8.3-alpine3.11
WORKDIR /backend
ADD . .
RUN apk update \
  && apk add python3-dev build-base linux-headers pcre-dev libffi-dev openssl-dev musl-dev \
  && pip install pipenv==2018.11.26 \
  && pipenv install --system \
  && rm -rf ~/.cache
EXPOSE 5000
ENTRYPOINT ["uwsgi"]
CMD ["uwsgi.ini"]
