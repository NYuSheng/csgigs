#!/bin/bash

zip -q -r apps.zip server
yes | scp -v -r ./apps.zip $DROPLET_USER@$DROPLET_IP:/home/apps
yes | ssh -v $DROPLET_USER@$DROPLET_IP "unzip -o apps.zip"
yes | ssh -v $DROPLET_USER@$DROPLET_IP "pm2 stop ./server/server.js"
yes | ssh -v $DROPLET_USER@$DROPLET_IP "pm2 start ./server/server.js"