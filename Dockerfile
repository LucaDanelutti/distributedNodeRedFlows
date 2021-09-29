FROM nodered/node-red

COPY ./demo_flows/settings.js /data/settings.js
COPY --chown=node-red ./creds /data/
# RUN   sed -i 's|//credentialSecret: "a-secret-key",|credentialSecret: process.env.NODE_RED_CREDENTIAL_SECRET |g' /data/settings.js

RUN mkdir -p /data/demo_flows
COPY --chown=node-red ./demo_flows /data/demo_flows

COPY --chown=node-red ./custom-nodes /custom-nodes
RUN npm install /custom-nodes

RUN npm install node-red-contrib-telegrambot --save
