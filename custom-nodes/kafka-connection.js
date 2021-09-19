const {Kafka} = require("kafkajs");
module.exports = function(RED) {
    function KafkaConnectionNode(config) {
        RED.nodes.createNode(this, config)
        let node = this;
        const kafka = new Kafka({
            brokers: config.brokers.replace(" ", "").split(","),
            clientId: config.clientId
        })
        node.getKafka = () => {
            return kafka
        }

    }
    RED.nodes.registerType("kafka-connection",KafkaConnectionNode)
}