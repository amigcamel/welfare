# Welfare
> 

welfare FE and BE.

## Installation

OS X & Linux:

## Usage example

## Development setup

Backend:

    docker stack deploy -c docker-stack-test.yml welfare

Frontend:

    cd frontend
    ng serve --proxy-config proxy.conf.json --host 0.0.0.0 --disable-host-check

Insert test data to DB:

    CON=$(docker ps --filter name=welfare_mongo -q) && docker cp data/afternoontea.tgz $CON:/ && docker exec -t $CON mongorestore -d afternoontea --gzip --drop --archive=/afternoontea.tgz


## Deploy

Make sure these files and folders exist:

    .
    ├── nginx 
    │   └── conf.d
    │       └── default.conf
    ├── docker-stack.yml
    ├── backup
    └── docker.env

Run with `sudo`

    sudo docker stack deploy -c docker-stack.yml welfare
