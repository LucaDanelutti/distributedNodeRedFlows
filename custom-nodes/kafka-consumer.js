
async function consume(node){
    // we connect the consumer to the broker
    await node.consumer.connect()
    // we subscribe to the defined topic
    await node.consumer.subscribe({topic: node.topic})
    // we handle messages in a "per-message" fashion, as handling them in batches is out of the scope of the project
    await node.consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
            node.warn("[consumer] RECEIVED: #"+topic+"# "+message.value)
            const msg = JSON.parse(message.value);
            node.send(msg)
        }
    })
}

/*
    This node is the consumer node, it is used to pull messages from a kafka topic
 */
module.exports = function(RED) {
    function KafkaConsumerNode(config) {
        RED.nodes.createNode(this, config)
        // we ask for the connection topic
        let connection = RED.nodes.getNode(config.connection)
        // if it is not set we return
        if(!connection)
            return
        let node = this
        // we create a consumer by using the reference of KafkaJS returned by the kafka-connection node
        node.consumer = connection.getKafka().consumer({ groupId: config.groupId })
        node.topic = config.topic

        //we start the async function to handle new incoming messages
        consume(node)
            .catch(e => node.error("Consumer error",e.message))

        // this is the function that will be called when the node is removed
        node.on('close', function (done) {
            node.consumer.disconnect()
                .then(done())
                .catch(e => node.error("Consumer error",e.message))
        })
    }
    RED.nodes.registerType("kafka-consumer",KafkaConsumerNode)
}