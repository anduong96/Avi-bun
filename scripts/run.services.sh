#! /bin/bash

docker-compose --project-name=avi-ext --project-directory=../ --env-file=.env -f docker-compose.dev.yaml up -d
