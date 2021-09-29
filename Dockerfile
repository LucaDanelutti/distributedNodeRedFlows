FROM nodered/node-red
COPY --chown=node-red ./custom-nodes /custom-nodes
RUN mkdir -p /data/demo_flows
COPY --chown=node-red ./demo_flows /data/demo_flows
RUN npm install /custom-nodes
