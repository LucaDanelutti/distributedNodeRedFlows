module.exports = function(RED) {
    function KafkaConnectionNode(config) {
        RED.nodes.createNode(this, config)
        let node = this;
        let options = {}
        options.brokers = config.brokers.replace(" ", "").split(",")
        options.clientId = config.clientId
        node.options = options
    }
    RED.nodes.registerType("kafka-connection",KafkaConnectionNode)
}