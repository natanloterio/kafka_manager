import kafka from 'kafka-node'

export class topics {
    constructor (kafkaHost = null) {
        if(kafkaHost) {
            this.client = new kafka.KafkaClient({ kafkaHost: kafkaHost })
        }
    }
}
