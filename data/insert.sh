#!/bin/bash
set -e

dbs=(
  afternoontea
  app
  staff
)

for db in "${dbs[@]}"; do
  CON=$(docker ps --filter name=welfare_mongo -q)
  docker cp ./$db.gz $CON:/ 
  docker exec -t $CON mongorestore -d $db --gzip --drop --archive=$db.gz
done
