const {logLevel} = require("kafkajs");
const {Kafka} = require('kafkajs')

module.exports = function(RED) {

    function KafkaProducerNode(config) {
        const broker = config.initialBroker
        const id = config.clientId
        const node = this
        const topic = config.topic
        const kafka = new Kafka({
            logLevel: logLevel.DEBUG,
            brokers: [`${broker}`],
            clientId: id,
        }) //TODO: maybe make it global to reuse it
        const producer = kafka.producer()
        const sendMessage = async (topic, msg) => {
            await producer.connect()
            producer
                .send({topic, messages: [{value: msg.payload}]})
                .then(console.log)
                .catch(e => console.error(`[example/producer] ${e.message}`, e))
        }

        RED.nodes.createNode(this,config);

        node.on('input', function(msg) {
            node.log("SENDING MESSAGE TO KAFKA TOPIC")
            sendMessage(topic, msg)
                .then(() => this.log("SEND SUCCESSFUL"))
                .catch(err => this.error(err, msg))
        })

        node.on('close', function(removed, done) {
            node.status({fill: 'red',shape: 'ring',text: 'closed'})
            producer.close(false, () => {
                node.log('closed')
            })
            done()
        })
    }
    RED.nodes.registerType("kafka-producer",KafkaProducerNode)


}