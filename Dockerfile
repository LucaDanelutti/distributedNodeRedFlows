FROM nodered/node-red
COPY ./custom-nodes /custom-nodes
RUN npm install /custom-nodes