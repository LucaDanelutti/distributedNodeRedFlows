# Notes

The docker-compose file will start these containers:
- Kafka brokers:
  - kafka-1:9092 (ext. 19092)
  - kafka-2:9092 (ext. 29092)
  - kafka-1:9092 (ext. 39092)
- Zookeeper server:
  - zookeeper-1:2181 (ext. 22181)
- Kafka-ui (available at localhost:8080)
- Node-Red instances: 
  - node-red-1:1880 (ext. 1881)
  - node-red-2:1880 (ext. 1882)
  - node-red-3:1880 (ext. 1883)
  
Node.JS is required to run the kafkaJS demos.

In the folder custom-nodes the new Node-Red nodes will be developed.


