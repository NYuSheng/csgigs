#!/usr/bin/bash
scp -v -r ~/server $DROPLET_USER@$DROPLET_IP:/home/apps/server

ssh -v $DROPLET_USER@$DROPLET_IP "node server/server.js"
