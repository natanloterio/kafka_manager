const express = require('express')
const app = express()
const path = require('path')

const dist = path.join(__dirname, 'dist')

app.get('/', function (req, res) {
    res.sendFile(path.join(dist, 'index.html'))
})

app.get('/status', function (req, res) {
    res.send('GET request to the homepage')
})

app.use('/', express.static(dist))

const port = process.env.PORT || 8080

app.listen(port, function () {
    console.log('Kafka Manager started and is accessible via http://localhost:%s', port)
})
