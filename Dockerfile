FROM node:10-alpine

WORKDIR /opt/app
RUN mkdir -p /opt/app/client/build

# Frontend
COPY /client/. client/.
RUN npm install --prefix client/
RUN npm run build --prefix client/

# Backend
COPY /server/. server/.
RUN npm install --prefix server/

COPY client/build/. server/public/

RUN rm -rf client/

CMD ["node", "server/server.js"]