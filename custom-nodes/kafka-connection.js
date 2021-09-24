/*
    This custom node is a "config" node. It is used to create the connection to a Kafka Broker.
    kafka-producer and kafka-consumer nodes will use this node to setup the connection.
 */
const {Kafka, logLevel} = require("kafkajs")
module.exports = function(RED) {
    function KafkaConnectionNode(config) {
        RED.nodes.createNode(this, config)
        let node = this
        //create an instance of kafka
        const kafka = new Kafka({
            brokers: config.brokers.replace(" ", "").split(","),
            clientId: config.clientId
        })
        //expose the function to be called by the other custom nodes to call kafka.producer() and kafka.consumer()
        node.getKafka = () => {
            return kafka
        }
    }
    RED.nodes.registerType("kafka-connection",KafkaConnectionNode)
}