export const state = () => ({
  customers: []
})

export const getters = {
  getCustomers: state => JSON.parse(JSON.stringify(state.customers))
}

export const mutations = {
  SAVE_CUSTOMERS (state, customers) {
    state.customers = customers
  }
}

export const actions = {
  async fetchCustomers ({ commit, rootGetters }) {
    await commit('dictionaries/SAVE_STATUS', 'fetch', { root: true })
    try {
      const { data } = await this.$axios.get('/api/customers', {
        headers: {
          Authorization: `Bearer ${rootGetters['authorization/getAccessToken']}`
        },
        params: rootGetters['dictionaries/getRouteParams']
      })
      if (data.status === 'success') {
        await commit('SAVE_CUSTOMERS', data.data.data)
        await commit('dictionaries/SAVE_STATUS', 'customers-successfully-fetched', { root: true })
        await commit('dictionaries/UPDATE_PAGINATION', data.data, { root: true })
      } else {
        await commit('dictionaries/SAVE_STATUS', 'customers-not-fetched', { root: true })
        if (data.httpCode === 401) {
          await commit('dictionaries/SAVE_STATUS', 'unauthorized', { root: true })
        }
      }
    } catch (e) {
      console.log('error', e)
    }
  }
}
