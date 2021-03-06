#!/bin/bash

zip -q -r apps.zip server
scp -v -r ./apps.zip $DROPLET_USER@$DROPLET_IP:/home/apps
ssh -v $DROPLET_USER@$DROPLET_IP "unzip -o apps.zip"
ssh -v $DROPLET_USER@$DROPLET_IP "rm apps.zip"
ssh -v $DROPLET_USER@$DROPLET_IP "pm2 stop ./server/server.js"

ssh -v $DROPLET_USER@$DROPLET_IP "echo CSGIGS_ROCKET_API_USER=$CSGIGS_ROCKET_API_USER > .env"
ssh -v $DROPLET_USER@$DROPLET_IP "echo CSGIGS_ROCKET_API_PASSWORD=$CSGIGS_ROCKET_API_PASSWORD >> .env"
ssh -v $DROPLET_USER@$DROPLET_IP "echo CSGIGS_ROCKET_BROADCAST_CHANNEL=$CSGIGS_ROCKET_BROADCAST_CHANNEL >> .env"
ssh -v $DROPLET_USER@$DROPLET_IP "echo CSGIGS_ROCKET_API_URL=$CSGIGS_ROCKET_API_URL >> .env"

ssh -v $DROPLET_USER@$DROPLET_IP "NODE_ENV=production pm2 start ./server/server.js"