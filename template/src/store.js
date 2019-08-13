import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default function createStore() {
  return new Vuex.Store({
    state: {
      count: 1
    },
    actions: {
      fetchCount({ commit }, count) {
        console.log('count')
        return new Promise(resolve =>
          resolve(
            setTimeout(() => {
              commit('setCount', { count: count + 1 })
            }, 1000)
          )
        )
      }
    },
    mutations: {
      setCount(state, { count }) {
        state.count = count
      }
    }
  })
}
