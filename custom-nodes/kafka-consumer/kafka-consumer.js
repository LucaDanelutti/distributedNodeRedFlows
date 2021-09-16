const {logLevel, Kafka} = require("kafkajs");

async function consume(node, consumer, topic){
    await consumer.connect()
    await consumer.subscribe({topic})
    await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
            node.warn("received a message: "+message.value)
            node.send(message)
        }
    })
}


module.exports = function(RED) {
    function KafkaConsumerNode(config) {
        RED.nodes.createNode(this, config);
        const node = this

        //kafka settings
        const kafka = new Kafka({
            logLevel: logLevel.INFO,
            brokers: [`${config.initialBroker}`],
            clientId: config.clientId,
        }) //TODO: maybe make it global to reuse it
        const consumer = kafka.consumer({ groupId: config.groupId })

        node.on('close', function (removed, done) {
            consumer.close(false, () => {
                node.log('closed')
                done()
            })
        })

        consume(node, consumer, config.topic).catch(e => console.error(`[example/consumer] ${e.message}`, e))

    }
    RED.nodes.registerType("kafka-consumer",KafkaConsumerNode)
}