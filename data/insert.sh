#!/bin/bash
set -e

dbs=(
  afternoontea
  app
  staff
)

CON=$(docker ps --filter name=welfare_mongo -q)
docker cp ./mongodemo.gz $CON:/ 

for db in "${dbs[@]}"; do
  docker exec -t $CON mongorestore --drop --archive=$db.gz --gzip --db=$db
done
