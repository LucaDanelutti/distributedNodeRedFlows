/*
    This is the custom node dedicated to produce messages to a defined topic
 */
module.exports = function(RED) {
    function KafkaProducerNode(config) {
        RED.nodes.createNode(this, config)
        // we get the kafka-connection node
        let connection = RED.nodes.getNode(config.connection)
        if (!connection)
            return
        let node = this
        node.topic = config.topic
        // we create a producer by using the reference of KafkaJS stored inside of the kafka-connection node
        // we also set the idempotent option to true (still an experimental feature in KafkaJS), this allow us
        // to achieve the exactly-once semantic of Kafka
        node.producer = connection.getKafka().producer({idempotent: true})

        // we connect the producer
        connect(node).then(() => node.warn("[producer] connected"))

        // this is the function that will be called each time the node receives a message from another node
        node.on('input', function (msg) {
            // we send the provided message to the assigned topic
            // the acks: -1 option is needed to achieve the exactly-once semantic as specified by KafkaJS docs
            // acks: -1 means that all the in-sync replicas must acknowledge (default)
            node.producer
                .send({topic: node.topic, messages: [{value: JSON.stringify(msg)}], acks: -1})
                .catch(async e => {
                    node.warn(`[producer] ${e.message}`, e)
                    if (e.message.includes("out of order")) {
                        reloadFlow()
                    }
                })
                .then(()=> node.warn("[producer]: #"+node.topic+"# "+JSON.stringify(msg)))
        })

        // this is the function that will be called once we remove the node
        node.on('close', function (done) {
            node.producer.disconnect()
                .then(done())
                .catch(e => node.error("producer error", e.message))
        })

    }
    RED.nodes.registerType("kafka-producer",KafkaProducerNode)
}


async function connect(node){
    await node.producer.connect()
}
function reloadFlow(){
    const http = require('http')
    const options = {
        hostname: 'localhost',
        port: 1880,
        path: '/flows',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            "Node-RED-API-Version": "v2",
            'Node-RED-Deployment-Type': 'reload'
        }
    }
    const data = JSON.stringify({})
    const req = http.request(options)
    req.write(data)
    req.end()
}