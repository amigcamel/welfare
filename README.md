# Welfare
> 

welfare FE and BE.

## Installation

OS X & Linux:

## Usage example

## Development setup

    (cd backend && docker build -t be:latest .)
    docker stack deploy -c docker-stack-test.yml welfare


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
