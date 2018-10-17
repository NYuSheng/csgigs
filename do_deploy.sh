#!/bin/bash

zip -r apps.zip server
scp -v -r ./apps.zip APPS@$DROPLET_IP:/home/apps
ssh -v APPS@$DROPLET_IP "unzip -o apps.zip"
ssh -v APPS@$DROPLET_IP "pm2 stop ./server/server.js"
ssh -v APPS@$DROPLET_IP "pm2 start ./server/server.js"