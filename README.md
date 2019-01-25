# csgigs

Open-sourced Event Management System

### Development Setup

#### Server

Create a new `.env` file in the server project root (next to `server\package.json`) with the following contents (**\*update as required**):

```
CSGIGS_ROCKET_API_USER=gigsbot
CSGIGS_ROCKET_API_PASSWORD=gigsbotpassword
CSGIGS_ROCKET_BROADCAST_CHANNEL=broadcast
CSGIGS_ROCKET_API_URL=http://localhost:3000/api/v1/
```

### Production Setup

The CI deploy script requires that the following environment variables are defined:

- `DROPLET_USER`
- `DROPLET_IP`
- `CSGIGS_ROCKET_API_USER`
- `CSGIGS_ROCKET_API_PASSWORD`
- `CSGIGS_ROCKET_BROADCAST_CHANNEL`
- `CSGIGS_ROCKET_API_URL`
