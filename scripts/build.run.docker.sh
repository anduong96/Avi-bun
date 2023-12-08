#! /bin/bash

NAME=avi-bun

docker build \
  --progress=plain\
  --no-cache\
  -t $NAME:latest  .


docker run --env-file .env $NAME
