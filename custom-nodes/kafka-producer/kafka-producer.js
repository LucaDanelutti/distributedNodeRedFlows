const {logLevel, Kafka} = require("kafkajs");

async function sendMessage(node, producer, topic, msg){
    await producer.connect()
    producer
        .send({topic, messages: [{value: msg.payload}]})
        .catch(e => node.warn(`[producer] ${e.message}`, e))
    node.warn("SENT: "+msg.payload)
}

module.exports = function(RED) {
    function KafkaProducerNode(config) {
        RED.nodes.createNode(this, config);

        const node = this
        const kafka = new Kafka({
            logLevel: logLevel.INFO,
            brokers: [`${config.initialBroker}`],
            clientId: config.clientId,
        }) //TODO: maybe make it global to reuse it
        const producer = kafka.producer()

        node.on('input', function(msg) {
            node.warn("SENDING MESSAGE TO KAFKA TOPIC")
            sendMessage(node, producer, config.topic, msg)
                .then(() => node.warn("SEND SUCCESSFUL"))
                .catch(err => node.warn(err, msg))
        })

        node.on('close', function (removed, done) {
            node.producer.close(false, () => {
                node.log('closed')
            })
            done()
        })

    }
    RED.nodes.registerType("kafka-producer",KafkaProducerNode)
}