#!/bin/bash

zip -q -r apps.zip server
scp -v -r ./apps.zip $DROPLET_USER@$DROPLET_IP:/home/apps
ssh -v $DROPLET_USER@$DROPLET_IP "unzip -o apps.zip"
ssh -v $DROPLET_USER@$DROPLET_IP "rm apps.zip"
ssh -v $DROPLET_USER@$DROPLET_IP "pm2 stop ./server/server.js"
ssh -v $DROPLET_USER@$DROPLET_IP "pm2 start ./server/server.js"