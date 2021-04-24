const express = require('express')
const app = express()
const path = require('path')
const kafka = require('kafka-node')
const bodyParser = require('body-parser')
const dist = path.join(__dirname, 'dist')

const kafkaHost = process.env.KAFKA_SERVERS || '192.168.100.10:8083'
const cors = require('cors')
const http = require('http').Server(app)
const io = require('socket.io')(http)

const client = new kafka.KafkaClient({ kafkaHost: kafkaHost })

client.on('error', function (err) {
    console.log(err)
})

client.once('connect', function () {
    console.log('connected to kafka host')
    client.loadMetadataForTopics([], function (error, results) {
        if(error) {
            return console.error(error)
        }
    })
})

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.get('/', function (req, res) {
    res.sendFile(path.join(dist, 'index.html'))
})

app.get('/status', function (req, res) {
    res.send('GET request to the homepage')
})

app.post('/topic', function (req, res) {
    let e = []

    if(typeof req.body === 'undefined') { req.body = {} }
    if(typeof req.body.topic === 'undefined') { e.push(`parameter [topic] required`) }
    if(typeof req.body.partitions === 'undefined') { e.push(`parameter [partitions] required`) }
    if(typeof req.body.replication === 'undefined') { e.push(`parameter [replication] required`) }

    if(e.length > 0) {
        return res.send(e.join('<br>'))
    }

    let topic = req.body.topic
    let partitions = req.body.partitions
    let replicationFactor = req.body.replication

    var topics = [{
        topic: topic,
        partitions: partitions,
        replicationFactor: replicationFactor
    }]

    const admin = new kafka.Admin(client)

    admin.createTopics(topics, (err, response) => {
        if(err) {
            return res.send(err)
        }

        return res.send(response)
    })
})

app.get('/topic', function (req, res) {
    client.loadMetadataForTopics([], function (error, results) {
        if(error) {
            return res.send(error)
        }

        let ts = []

        for(let t in results[1].metadata) {
            ts.push(t)
        }

        ts.sort()

        return res.send(ts)
    })
})

app.get('/topic/offsets/:topic', function (req, res) {
    let t = req.params.topic

    let payloads = [
        {
            topic: t,
            offset: 0
        }
    ]

    let options = {
        autoCommit: true,
        fromOffset: true,
        offset: 0
    }

    let client = new kafka.KafkaClient({ kafkaHost: kafkaHost, idleConnection: '1000' })
    let offset = new kafka.Offset(client)

    offset.fetchLatestOffsets([t], function (err, offsets) {
        if(err) {
            console.log(err)
        }

        // current offset from topic
        let o = offsets[t]

        res.json(o)
    })
})

app.get('/topicdata/:topic', function (req, res) {

})

app.use('/', express.static(dist))

const port = process.env.PORT || 8081

http.listen(port, function () {
    console.log('Kafka Manager started and is accessible via http://localhost:%s', port)
})

process.on('SIGINT', () => { console.log('Bye bye!'); process.exit() })
