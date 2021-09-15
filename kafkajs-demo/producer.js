// This is a very simple example of the usage of the library kafkaJS to send a message to a Kafka Topic

const ip = require('ip')
const { Kafka, logLevel } = require('kafkajs')
const host = process.env.HOST_IP || ip.address()

// Here we setup the connection to the Kafka Broker (we just need one broker to discover all the others)
const kafka = new Kafka({
    logLevel: logLevel.DEBUG,
    brokers: [`${host}:29092`],
    clientId: 'example-producer',
})

// the topic where we will send the message
const topic = 'test-topic'

// initialize the producer
const producer = kafka.producer()

//function that will bee invoked every 3 seconds
const sendMessage = () => {
    return producer
        .send({topic, messages: [{ value: 'Hello KafkaJS user!' }]})
        .then(console.log)
        .catch(e => console.error(`[example/producer] ${e.message}`, e))
}

// we connect the producer and start sending messages
const run = async () => {
    await producer.connect()
    setInterval(sendMessage, 3000)
}

run().catch(e => console.error(`[example/producer] ${e.message}`, e))




