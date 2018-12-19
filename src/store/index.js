import Vue from 'vue'
import Vuex from 'vuex'
import * as types from './mutation-types'

Vue.use(Vuex)
const connectServer = process.env.CONNECT_SERVER || 'http://localhost:8083'
const restServer = process.env.REST_SERVER || 'http://localhost:8084'

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
    getters,
    actions,
    mutations
})
