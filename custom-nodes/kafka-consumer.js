async function consume(node){
    await node.consumer.connect()
    await node.consumer.subscribe({topic: node.topic})
    await node.consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
            node.warn("[consumer] RECEIVED: #"+topic+"# "+message.value)
            const msg = {payload: message.value};
            node.send(msg)
        }
    })
}


module.exports = function(RED) {
    const {logLevel, Kafka} = require("kafkajs")

    function KafkaConsumerNode(config) {
        RED.nodes.createNode(this, config)
        let connection = RED.nodes.getNode(config.connection)
        if(!connection)
            return
        //TODO: maybe make it global to reuse it
        const kafka = new Kafka(connection.options)

        let node = this
        node.consumer = kafka.consumer({ groupId: config.groupId })
        node.topic = config.topic

        consume(node)
            .catch(e => node.error("Consumer error",e.message))

        node.on('close', function (done) {
            consumer.disconnect()
                .then(done())
                .catch(e => node.error("Consumer error",e.message))
        })


    }
    RED.nodes.registerType("kafka-consumer",KafkaConsumerNode)
}