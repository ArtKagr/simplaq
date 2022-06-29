export const state = () => ({
  receipts: [],
  currentReceipt: {}
})

export const getters = {
  getReceipts: state => JSON.parse(JSON.stringify(state.receipts)),
  getCurrentReceipt: state => JSON.parse(JSON.stringify(state.currentReceipt))
}

export const mutations = {
  SAVE_RECEIPTS (state, payload) {
    state.receipts = payload
  },
  SAVE_CURRENT_RECEIPT (state, payload) {
    state.currentReceipt = JSON.parse(JSON.stringify(payload))
  },
  UPDATE_CURRENT_RECEIPT (state, payload) {
    state.currentReceipt[payload.field] = payload.value
  }
}

export const actions = {
  async fetchReceipts ({ commit, rootGetters }) {
    await commit('dictionaries/SAVE_STATUS', 'fetch', { root: true })
    try {
      const { data } = await this.$axios.get('/api/receipts', {
        headers: {
          Authorization: `Bearer ${rootGetters['authorization/getAccessToken']}`
        },
        params: rootGetters['dictionaries/getRouteParams']
      })
      if (data.status === 'success') {
        await commit('SAVE_RECEIPTS', data.data.data)
        await commit('dictionaries/SAVE_STATUS', 'receipts-successfully-fetched', { root: true })
        await commit('dictionaries/UPDATE_PAGINATION', data.data, { root: true })
      } else {
        await commit('dictionaries/SAVE_STATUS', 'receipts-not-fetched', { root: true })
        if (data.httpCode === 401) {
          await commit('dictionaries/SAVE_STATUS', 'unauthorized', { root: true })
        }
      }
    } catch (e) {
      console.log('error', e)
    }
  },
  async fetchCurrentReceipt ({ commit, rootGetters }, receiptId) {
    await commit('dictionaries/SAVE_STATUS', 'fetch', { root: true })
    try {
      const { data } = await this.$axios.get(`/api/receipts/${receiptId}`, {
        headers: {
          Authorization: `Bearer ${rootGetters['authorization/getAccessToken']}`
        },
        params: rootGetters['dictionaries/getRouteParams']
      })
      if (data.status === 'success') {
        await commit('SAVE_CURRENT_RECEIPT', data.data)
        await commit('dictionaries/SAVE_STATUS', 'current-receipt-successfully-fetched', { root: true })
        await commit('dictionaries/UPDATE_PAGINATION', data.data, { root: true })
      } else {
        await commit('dictionaries/SAVE_STATUS', 'current-receipt-not-fetched', { root: true })
        if (data.httpCode === 401) {
          await commit('dictionaries/SAVE_STATUS', 'unauthorized', { root: true })
        }
      }
    } catch (e) {
      console.log('error', e)
    }
  },
  async updateReceipt ({ dispatch, getters, rootGetters, commit }, payload) {
    const receipt = Object.fromEntries(Object.entries(payload).filter(([_, v]) => v != null))
    try {
      const { data } = await this.$axios.put(`api/receipts/${getters.getCurrentReceipt.id}`, receipt, {
        headers: {
          Authorization: `Bearer ${rootGetters['authorization/getAccessToken']}`
        }
      })
      if (data.status === 'success') {
        await commit('dictionaries/SAVE_STATUS', 'receipt-successfully-updated', { root: true })
        await commit('SAVE_CURRENT_RECEIPT', data.data)
      } else {
        await commit('dictionaries/SAVE_STATUS', 'receipt-not-updated', { root: true })
        if (data.httpCode === 401) {
          await commit('dictionaries/SAVE_STATUS', 'unauthorized', { root: true })
        }
      }
    } catch (e) {
      console.log('error', e)
    }
  },
  async approveReceipt ({ dispatch, commit, rootGetters }, receiptId) {
    try {
      const { data } = await this.$axios.patch(`/api/receipts/approve/${receiptId}`, {}, {
        headers: {
          Authorization: `Bearer ${rootGetters['authorization/getAccessToken']}`
        }
      })
      if (data.status === 'success') {
        await commit('dictionaries/SAVE_STATUS', 'receipt-successfully-approved', { root: true })
        await dispatch('fetchCurrentReceipt', receiptId)
      } else {
        await commit('dictionaries/SAVE_STATUS', 'receipt-not-approved', { root: true })
        if (data.httpCode === 401) {
          await commit('dictionaries/SAVE_STATUS', 'unauthorized', { root: true })
        }
      }
    } catch (e) {
      console.log('error', e)
    }
  },
  async rejectReceipt ({ dispatch, commit, rootGetters }, receiptId) {
    try {
      const { data } = await this.$axios.patch(`/api/receipts/reject/${receiptId}`, {}, {
        headers: {
          Authorization: `Bearer ${rootGetters['authorization/getAccessToken']}`
        }
      })
      if (data.status === 'success') {
        await commit('dictionaries/SAVE_STATUS', 'receipt-successfully-rejected', { root: true })
        await dispatch('fetchCurrentReceipt', receiptId)
      } else {
        await commit('dictionaries/SAVE_STATUS', 'receipt-not-rejected', { root: true })
        if (data.httpCode === 401) {
          await commit('dictionaries/SAVE_STATUS', 'unauthorized', { root: true })
        }
      }
    } catch (e) {
      console.log('error', e)
    }
  },
  async resetReceipt ({ dispatch, commit, rootGetters }, receiptId) {
    try {
      const { data } = await this.$axios.patch(`/api/receipts/reset/${receiptId}`, {}, {
        headers: {
          Authorization: `Bearer ${rootGetters['authorization/getAccessToken']}`
        }
      })
      if (data.status === 'success') {
        await commit('dictionaries/SAVE_STATUS', 'receipt-successfully-reset', { root: true })
        await dispatch('fetchCurrentReceipt', receiptId)
      } else {
        await commit('dictionaries/SAVE_STATUS', 'receipt-not-reset', { root: true })
        if (data.httpCode === 401) {
          await commit('dictionaries/SAVE_STATUS', 'unauthorized', { root: true })
        }
      }
    } catch (e) {
      console.log('error', e)
    }
  }
}
