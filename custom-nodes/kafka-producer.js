async function sendMessage(node, msg){
    await node.producer.connect()
    node.producer
        .send({topic: node.topic, messages: [{value: msg.payload}], acks: -1})
        .catch(e => node.warn(`[producer] ${e.message}`, e))
}
//TODO: edit common connection like kafka-consumer
//TODO: move kafka creation inside of the kafka-connection node and use it to return producer/consumer

module.exports = function(RED) {
    const {logLevel, Kafka} = require("kafkajs")

    function KafkaProducerNode(config) {
        RED.nodes.createNode(this, config)

        let node = this;
        const kafka = new Kafka({
            logLevel: logLevel.INFO,
            brokers: [config.brokers], //TODO: implement splitting
            clientId: config.clientId,
        }) //TODO: maybe make it global to reuse it
        node.topic = config.topic
        node.producer = kafka.producer({idempotent: true})

        node.on('input', function(msg) {
            sendMessage(node, msg)
                .then(() => node.warn("[producer] SENT: #"+node.topic+"# "+msg.payload) )
        })

        node.on('close', function (done) {
            node.producer.disconnect()
                .then(done())
                .catch(e => node.error("producer error",e.message))
        })

    }
    RED.nodes.registerType("kafka-producer",KafkaProducerNode)
}