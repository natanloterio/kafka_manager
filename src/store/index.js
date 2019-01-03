import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

let connectServer = 'http://connect.kafka.10.192.172.103.xip.io'
let ksqlServer = 'http://ksql-server.kafka.10.192.172.103.xip.io/'
let restServer = 'http://localhost:8084'
let apiServer = 'http://localhost:8081'

if(process.env.NODE_ENV === 'production') {
    connectServer = process.env.VUE_APP_CONNECT_SERVER
    restServer = process.env.VUE_APP_REST_SERVER
    ksqlServer = process.env.VUE_APP_KSQL_SERVER
    apiServer = ''
}

// fix urls with trailing slashes
if(typeof connectServer !== 'undefined') { connectServer = connectServer.replace(/\/+$/, '') }
if(typeof restServer !== 'undefined') { restServer = restServer.replace(/\/+$/, '') }
if(typeof ksqlServer !== 'undefined') { ksqlServer = ksqlServer.replace(/\/+$/, '') }

const debug = process.env.NODE_ENV !== 'production'

// mutations
const mutations = {

}

// initial state
const state = {
    servers: {
        'connectors_api': '',
        'kafka_api': '',
        'ksql_api': '',
        'api': ''
    }
}
// getters
const getters = {
    getConnectorServer: state => state.servers.connectors_api,
    getKafkaServer: state => state.servers.kafka_api,
    getKsqlServer: state => state.servers.ksql_api,
    getApiServer: state => state.servers.api

}
// actions
const actions = {

}

// init with server environment variables
state.servers.connectors_api = connectServer
state.servers.kafka_api = restServer
state.servers.ksql_api = ksqlServer
state.servers.api = apiServer

// one store for entire application
export default new Vuex.Store({
    state,
    strict: debug,
    getters,
    actions,
    mutations
})
