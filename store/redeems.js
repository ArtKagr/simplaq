export const state = () => ({
  redeems: [],
  currentRedeem: {}
})

export const getters = {
  getRedeems: state => JSON.parse(JSON.stringify(state.redeems)),
  getCurrentRedeem: state => JSON.parse(JSON.stringify(state.currentRedeem))
}

export const mutations = {
  SAVE_REDEEMS (state, redeems) {
    state.redeems = redeems
  },
  SAVE_CURRENT_REDEEM (state, currentRedeem) {
    state.currentRedeem = currentRedeem
  }
}

export const actions = {
  async fetchRedeems ({ commit, rootGetters }) {
    await commit('dictionaries/SAVE_STATUS', 'fetch', { root: true })
    try {
      const { data } = await this.$axios.get('api/customer-rewards', {
        headers: {
          Authorization: `Bearer ${rootGetters['authorization/getAccessToken']}`
        },
        params: rootGetters['dictionaries/getRouteParams']
      })
      if (data.status === 'success') {
        await commit('dictionaries/SAVE_STATUS', 'redeems-successfully-fetched', { root: true })
        await commit('SAVE_REDEEMS', data.data.data)
        await commit('dictionaries/UPDATE_PAGINATION', data.data, { root: true })
      } else {
        await commit('dictionaries/SAVE_STATUS', 'redeems-not-fetched', { root: true })
        if (data.httpCode === 401) {
          await commit('dictionaries/SAVE_STATUS', 'unauthorized', { root: true })
        }
      }
    } catch (e) {
      console.log('error', e)
    }
  },
  async cancelCurrentRedeem ({ dispatch, getters, rootGetters, commit }) {
    await commit('dictionaries/SAVE_STATUS', 'fetch', { root: true })
    try {
      const { data } = await this.$axios.patch(`api/customer-rewards/cancel/${getters.getCurrentRedeem.id}`, null, {
        headers: {
          Authorization: `Bearer ${rootGetters['authorization/getAccessToken']}`
        }
      })
      if (data.status === 'success') {
        await commit('dictionaries/SAVE_STATUS', 'redeem-successfully-updated', { root: true })
        await dispatch('fetchRedeems', {
          page: rootGetters['dictionaries/getPagination'].current_page,
          perPage: rootGetters['dictionaries/getPagination'].per_page
        })
      } else {
        await commit('dictionaries/SAVE_STATUS', 'redeem-not-updated', { root: true })
        if (data.httpCode === 401) {
          await commit('dictionaries/SAVE_STATUS', 'unauthorized', { root: true })
        }
      }
    } catch (e) {
      console.log('error', e)
    }
  }
}
