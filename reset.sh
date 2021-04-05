#!/usr/bin/sh

docker container rm -f $(docker container ls -qa)
docker image rm -f $(docker image ls -q)

