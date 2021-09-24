FROM nodered/node-red
COPY ./custom-nodes /custom-nodes
COPY ./demo_flows /demo_flows
RUN npm install /custom-nodes
