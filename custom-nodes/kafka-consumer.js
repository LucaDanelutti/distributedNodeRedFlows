async function consume(node, consumer, topic){
    await consumer.connect()
    await consumer.subscribe({topic})
    await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
            node.warn("received a message (new version): "+message.value)
            const msg = {payload: message.value};
            node.send(msg)
        }
    })
}


module.exports = function(RED) {
    const {logLevel, Kafka} = require("kafkajs")

    function KafkaConsumerNode(config) {
        RED.nodes.createNode(this, config)
        const node = this

        //kafka settings
        const kafka = new Kafka({
            logLevel: logLevel.INFO,
            brokers: [config.brokers], //TODO: implement splitting
            clientId: config.clientId,
        }) //TODO: maybe make it global to reuse it
        const consumer = kafka.consumer({ groupId: config.groupId })

        consume(node, consumer, config.topic).catch(e => node.error("Consumer error",e.message))

        node.on('close', function (done) {
            consumer.disconnect()
                .then(done())
                .catch(e => node.error("Consumer error",e.message))
        })


    }
    RED.nodes.registerType("kafka-consumer",KafkaConsumerNode)
}