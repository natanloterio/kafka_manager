import Vue from 'vue'
import Vuex from 'vuex'
import * as types from './mutation-types'

Vue.use(Vuex)

let connectServer = 'http://localhost:8083'
let restServer = 'http://localhost:8084'

if(process.env.NODE_ENV === 'production') {
    connectServer = process.env.VUE_APP_CONNECT_SERVER
    restServer = process.env.REST_SERVER
}

// fix urls with trailing slashes
if(typeof connectServer !== 'undefined') { connectServer = connectServer.replace(/\/+$/, '') }
if(typeof restServer !== 'undefined') { restServer = restServer.replace(/\/+$/, '') }

const debug = process.env.NODE_ENV !== 'production'

// mutations
const mutations = {
    [types.add_server] (state, { url, type = 'connect' }) {
        if(type === 'connect') {
            state.servers.connectors_api = url
            return true
        }
        state.servers.kafka_api = url
        return true
    },
    [types.remove_server] (state, { type = 'connect' }) {
        if(type === 'connect') {
            state.servers.connectors_api = null
            return true
        }
        state.servers.kafka_api = null
        return true
    }
}

// initial state
const state = {
    servers: {
        'connectors_api': '',
        'kafka_api': ''
    },
    connectors: [],
    topics: []
}
// getters
const getters = {
    getConnectorServer: state => state.servers.connectors_api,
    getKafkaServer: state => state.servers.kafka_api

}
// actions
const actions = {
    add_server ({ commit }, url, type) {
        commit(types.add_server, url, type)
    },
    remove_server ({ commit }, type) {
        commit(types.remove_server, type)
    }
}

// init with server environment variables
state.servers.connectors_api = connectServer
state.servers.kafka_api = restServer

// one store for entire application
export default new Vuex.Store({
    state,
    strict: debug,
    getters,
    actions,
    mutations
})
