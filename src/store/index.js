import Vue from "vue";
import Vuex from "vuex";
import * as types from "./mutation-types";

Vue.use(Vuex);
const debug = process.env.NODE_ENV !== "production";
// mutations
const mutations = {
  [types.add_server] (state, { url }) {
      state.server_url = url.url;

  },
  [types.remove_server] (state, { url }) {
      state.server_url = null;

  }
};

// initial state
const state = {
  server_url: null
}
// getters
const getters = {
  getServer: state => state.server_url

};
// actions
const actions = {
  add_server({ commit }, server_url) {
    commit(types.add_server, {
      url: server_url
    })
  },
  remove_server({ commit }, server_url) {
    commit(types.remove_server, {
      url: server_url
    })
  }
}


// one store for entire application
export default new Vuex.Store({
  state,
  strict: debug,
  getters,
  actions,
  mutations
});
