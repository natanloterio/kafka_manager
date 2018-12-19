const axios = require('axios')
class Servers {
    constructor (connectServer = null, restServer = null) {
        this.connect_server = connectServer
        this.rest_server = restServer
    }

    async checkRestServer () {
        try {
            let u = this.rest_server
            let r = await axios.get(u)

            if(r.status !== 200) {
                return false
            }

            console.debug(`rest server connected: ${this.rest_server}`)

            return true
        } catch {
            return false
        }
    }

    async checkConnectServer () {
        try {
            let u = this.connect_server
            let r = await axios.get(u)

            if(r.status !== 200) {
                return false
            }

            console.debug(`connect server connected: ${this.connect_server}`)

            return true
        } catch {
            return false
        }
    }
}

export default Servers
