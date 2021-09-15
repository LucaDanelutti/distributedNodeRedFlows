// This is a very simple example of the usage of the library kafkaJS to consume messages from a Kafka topic

const ip = require('ip')
const { Kafka, logLevel } = require('kafkajs')
const host = process.env.HOST_IP || ip.address()

// we set the connection to a kafka broker
const kafka = new Kafka({
    logLevel: logLevel.INFO,
    brokers: [`${host}:29092`],
    clientId: 'example-consumer',
})

//we created a consumer, connected it and subscribed to a topic (we ask to start from the beginning offset)
const consumer = kafka.consumer({ groupId: 'test-group' })
const topic = 'test-topic'
const run = async () => {
    await consumer.connect()
    await consumer.subscribe({ topic, fromBeginning: true })
    await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
            const prefix = `${topic}[${partition} | ${message.offset}] / ${message.timestamp}`
            console.log(`- ${prefix} ${message.key}#${message.value}`)
        },
    })
}

run().catch(e => console.error(`[example/consumer] ${e.message}`, e))