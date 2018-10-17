#!/usr/bin/bash
scp -v -r ~/server $DROPLET_USER@$DROPLET_IP:/home/apps

ssh -v $DROPLET_USER@$DROPLET_IP "node server/server.js"
