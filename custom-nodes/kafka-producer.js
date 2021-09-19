async function sendMessage(node, msg){
    // we connect the producer
    await node.producer.connect()
    // we send the provided message to the assigned topic
    // the acks: -1 option is needed to achieve the exactly-once semantic as specified by KafkaJS docs
    // acks: -1 means that all the in-sync replicas must acknowledge (default)
    node.producer
        .send({topic: node.topic, messages: [{value: msg.payload}], acks: -1})
        .catch(e => node.warn(`[producer] ${e.message}`, e))
}

/*
    This is the custom node dedicated to produce messages to a defined topic
 */
module.exports = function(RED) {
    function KafkaProducerNode(config) {
        RED.nodes.createNode(this, config)
        // we get the kafka-connection node
        let connection = RED.nodes.getNode(config.connection)
        if(!connection)
            return
        let node = this
        node.topic = config.topic
        // we create a producer by using the reference of KafkaJS stored inside of the kafka-connection node
        // we also set the idempotent option to true (still an experimental feature in KafkaJS), this allow us
        // to achieve the exactly-once semantic of Kafka
        node.producer = connection.getKafka().producer({idempotent: true})

        // this is the function that will be called each time the node receives a message from another node
        node.on('input', function(msg) {
            sendMessage(node, msg)
                .then(() => node.warn("[producer] SENT: #"+node.topic+"# "+msg.payload) )
        })

        // this is the function that will be called once we remove the node
        node.on('close', function (done) {
            node.producer.disconnect()
                .then(done())
                .catch(e => node.error("producer error",e.message))
        })

    }
    RED.nodes.registerType("kafka-producer",KafkaProducerNode)
}