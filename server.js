const express = require('express')
const app = express()

app.use(express.static('dist'))

const port = process.env.PORT || 8080

app.listen(port, function () {
    console.log('Kafka Manager started and is accessible via http://localhost:%s', port)
})
