#!/bin/bash

zip -r apps.zip server
scp -v -r ./apps.zip $DROPLET_USER@$DROPLET_IP:/home/apps
ssh -v $DROPLET_USER@$DROPLET_IP "unzip apps.zip"
ssh -v $DROPLET_USER@$DROPLET_IP "node ./server/server.js"
