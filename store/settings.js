export const state = () => ({
  loyaltySettings: {
    block_receipts_before: {
      value: null
    },
    limit_get_rewards_per_day: {
      value: null
    },
    limit_get_rewards_per_month: {
      value: null
    },
    limit_get_rewards_per_year: {
      value: null
    },
    points_to_czk: {
      value: null
    }
  },
  valuePointsList: [],
  currentValuePoint: null
})

export const getters = {
  getLoyaltySettings: state => JSON.parse(JSON.stringify(state.loyaltySettings)),
  getValuePointsList: state => JSON.parse(JSON.stringify(state.valuePointsList)),
  getCurrentValuePoint: state => state.currentValuePoint
}

export const mutations = {
  SAVE_LOYALTY_SETTINGS (state, payload) {
    state.loyaltySettings = payload
  },
  SAVE_CURRENT_LOYALTY_SETTING (state, payload) {
    state.loyaltySettings[payload.field].value = payload.value
  },
  SAVE_VALUE_POINTS_LIST (state, payload) {
    state.valuePointsList = payload
  },
  SAVE_CURRENT_VALUE_POINT (state, payload) {
    state.currentValuePoint = payload.value
  },
  UPDATE_VALUE_POINT (state, payload) {
    state.valuePointsList[payload.index].settings[0].value = payload.value
  }
}

export const actions = {
  async fetchSettings ({ commit, rootGetters }) {
    await commit('dictionaries/SAVE_STATUS', 'fetch', { root: true })
    try {
      const { data } = await this.$axios.get('api/settings/loyalty', {
        headers: {
          Authorization: `Bearer ${rootGetters['authorization/getAccessToken']}`
        }
      })
      if (data.status === 'success') {
        await commit('dictionaries/SAVE_STATUS', 'settings-successfully-fetched', { root: true })
        await commit('SAVE_LOYALTY_SETTINGS', data.data)
        await commit('SAVE_CURRENT_VALUE_POINT', { id: null, value: data.data.points_to_czk.value })
      } else {
        console.warn('error')
      }
    } catch {
      console.warn('error')
    }
  },
  async fetchValuePointsList ({ commit, rootGetters }) {
    try {
      const { data } = await this.$axios.get('api/settings/loyalty/points_to_czk/company', {
        headers: {
          Authorization: `Bearer ${rootGetters['authorization/getAccessToken']}`
        },
        params: rootGetters['dictionaries/getRouteParams']
      })
      if (data.status === 'success') {
        await commit('dictionaries/SAVE_STATUS', 'value-points-successfully-fetched', { root: true })
        await commit('SAVE_VALUE_POINTS_LIST', data.data.data)
        await commit('dictionaries/UPDATE_PAGINATION', data.data, { root: true })
      } else {
        console.warn('error')
      }
    } catch {
      console.warn('error')
    }
  },
  async fetchCurrentValuePoints ({ commit, rootGetters }, companyId) {
    const { data } = await this.$axios.get(`api/settings/loyalty/points_to_czk/company/${companyId}`, {
      headers: {
        Authorization: `Bearer ${rootGetters['authorization/getAccessToken']}`
      }
    })
    if (data.status === 'success') {
      await commit('dictionaries/SAVE_STATUS', 'current-value-point-successfully-fetched', { root: true })
      await commit('SAVE_CURRENT_VALUE_POINT', { id: companyId, value: data.data.value })
      await commit('dictionaries/UPDATE_PAGINATION', data.data, { root: true })
    }
  },
  async updateCurrentPointValue ({ commit, rootGetters }, payload) {
    await commit('dictionaries/SAVE_STATUS', 'fetch', { root: true })
    try {
      const { data } = await this.$axios.put(`api/settings/loyalty/points_to_czk/company/${payload.id}`, { value: payload.value }, {
        headers: {
          Authorization: `Bearer ${rootGetters['authorization/getAccessToken']}`
        }
      })
      if (data.status === 'success') {
        await commit('dictionaries/SAVE_STATUS', 'current-point-value-successfully-updated', { root: true })
      } else {
        console.warn('error')
      }
    } catch {

    }
  },
  async updateCurrentSetting ({ commit, rootGetters }, payload) {
    try {
      const { data } = await this.$axios.put(`api/settings/loyalty/${payload.field}`, { value: payload.value }, {
        headers: {
          Authorization: `Bearer ${rootGetters['authorization/getAccessToken']}`
        }
      })
      if (data.status === 'success') {
        await commit('dictionaries/SAVE_STATUS', 'current-setting-successfully-updated', { root: true })
        commit('SAVE_CURRENT_LOYALTY_SETTING', {
          field: payload.field,
          value: data.data.value
        })
      } else {
        console.warn('error')
      }
    } catch {

    }
  }
}
