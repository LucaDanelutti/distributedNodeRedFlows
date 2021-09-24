FROM nodered/node-red
COPY --chown=node-red ./custom-nodes /custom-nodes
COPY --chown=node-red ./demo_flows /demo_flows
RUN npm install /custom-nodes
