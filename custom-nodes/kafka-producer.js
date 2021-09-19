async function sendMessage(node, msg){
    await node.producer.connect()
    node.producer
        .send({topic: node.topic, messages: [{value: msg.payload}], acks: -1})
        .catch(e => node.warn(`[producer] ${e.message}`, e))
}

module.exports = function(RED) {
    function KafkaProducerNode(config) {
        RED.nodes.createNode(this, config)
        let connection = RED.nodes.getNode(config.connection)
        if(!connection)
            return
        let node = this
        node.topic = config.topic
        node.producer = connection.getKafka().producer({idempotent: true})

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