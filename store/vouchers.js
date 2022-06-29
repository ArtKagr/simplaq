export const state = () => ({
  vouchers: [],
  currentVoucher: {
    id: null,
    created_at: null,
    loyalty_program: null,
    loyalty_program_id: null,
    points: null,
    qr_code_link: null,
    quantity_issued: null,
    quantity_redeemed: null,
    status: null,
    title: null,
    token: null,
    updated_at: null,
    valid_from: null,
    valid_to: null
  }
})

export const getters = {
  getVouchers: state => JSON.parse(JSON.stringify(state.vouchers)),
  getCurrentVoucher: state => JSON.parse(JSON.stringify(state.currentVoucher))
}

export const mutations = {
  SAVE_VOUCHERS (state, vouchers) {
    state.vouchers = vouchers
  },
  SAVE_CURRENT_VOUCHER (state, currentVoucher) {
    state.currentVoucher = JSON.parse(JSON.stringify(currentVoucher))
  },
  UPDATE_CURRENT_VOUCHER (state, payload) {
    state.currentVoucher[payload.field] = payload.value
  }
}

export const actions = {
  async fetchVouchers ({ commit, rootGetters }, payload) {
    await commit('dictionaries/SAVE_STATUS', 'fetch', { root: true })
    try {
      const { data } = await this.$axios.get(`/api/vouchers?page=${
        payload && payload.page ? payload.page : rootGetters['dictionaries/getPagination'].current_page || 1
      }&per_page=${
        payload && payload.perPage ? payload.perPage : rootGetters['dictionaries/getPagination'].per_page || 10
      }`, {
        headers: {
          Authorization: `Bearer ${rootGetters['authorization/getAccessToken']}`
        },
        params: rootGetters['dictionaries/getRouteParams']
      })
      if (data.status === 'success') {
        await commit('dictionaries/SAVE_STATUS', 'vouchers-successfully-fetched', { root: true })
        await commit('SAVE_VOUCHERS', data.data.data)
        await commit('dictionaries/UPDATE_PAGINATION', data.data, { root: true })
      } else {
        await commit('dictionaries/SAVE_STATUS', 'vouchers-not-fetched', { root: true })
      }
    } catch (e) {
      console.log('error', e)
    }
  },
  async updateVoucher ({ dispatch, getters, rootGetters, commit }) {
    const currentVoucher = Object.fromEntries(Object.entries(getters.getCurrentVoucher).filter(([_, v]) => v != null))
    delete currentVoucher.id
    try {
      const { data } = await this.$axios.put(`api/vouchers/${getters.getCurrentVoucher.id}`, currentVoucher, {
        headers: {
          Authorization: `Bearer ${rootGetters['authorization/getAccessToken']}`
        }
      })
      if (data.status === 'success') {
        await commit('dictionaries/SAVE_STATUS', 'voucher-successfully-updated', { root: true })
        await commit('SAVE_CURRENT_VOUCHER', data.data)
        await dispatch('fetchVouchers', {
          page: rootGetters['dictionaries/getPagination'].current_page,
          perPage: rootGetters['dictionaries/getPagination'].per_page
        })
      } else {
        await commit('dictionaries/SAVE_STATUS', 'voucher-not-updated', { root: true })
      }
    } catch (e) {
      console.log('error', e)
    }
  },
  async createVoucher ({ dispatch, getters, rootGetters, commit }, voucher) {
    await commit('dictionaries/SAVE_STATUS', 'fetch', { root: true })
    try {
      const { data } = await this.$axios.post('api/vouchers', voucher, {
        headers: {
          Authorization: `Bearer ${rootGetters['authorization/getAccessToken']}`
        }
      })
      if (data.status === 'success') {
        await commit('dictionaries/SAVE_STATUS', 'voucher-successfully-created', { root: true })
        await commit('SAVE_CURRENT_VOUCHER', data.data)
        await dispatch('fetchVouchers', {
          page: rootGetters['dictionaries/getPagination'].current_page,
          perPage: rootGetters['dictionaries/getPagination'].per_page
        })
      } else {
        await commit('dictionaries/SAVE_STATUS', 'voucher-not-created', { root: true })
      }
    } catch (e) {
      console.log('error', e)
    }
  },
  async archiveCurrentVoucher ({ commit, dispatch, rootGetters }, voucherId) {
    try {
      const { data } = await this.$axios.patch(`api/vouchers/archive/${voucherId}`, null, {
        headers: {
          Authorization: `Bearer ${rootGetters['authorization/getAccessToken']}`
        }
      })
      if (data.status === 'success') {
        await commit('dictionaries/SAVE_STATUS', 'voucher-successfully-archived', { root: true })
        await commit('SAVE_CURRENT_VOUCHER', data.data)
        await dispatch('fetchVouchers', {
          page: rootGetters['dictionaries/getPagination'].current_page,
          perPage: rootGetters['dictionaries/getPagination'].per_page
        })
      } else {
        await commit('dictionaries/SAVE_STATUS', 'voucher-not-archived', { root: true })
        if (data.httpCode === 401) {
          await commit('dictionaries/SAVE_STATUS', 'unauthorized', { root: true })
        }
      }
    } catch (e) {
      await commit('dictionaries/SAVE_STATUS', 'voucher-not-archived', { root: true })
    }
  },
  async publishCurrentVoucher ({ commit, dispatch, rootGetters }, voucherId) {
    try {
      const { data } = await this.$axios.put(`api/vouchers/publish/${voucherId}`, null, {
        headers: {
          Authorization: `Bearer ${rootGetters['authorization/getAccessToken']}`
        }
      })
      if (data.status === 'success') {
        await commit('dictionaries/SAVE_STATUS', 'voucher-successfully-published', { root: true })
        await commit('SAVE_CURRENT_VOUCHER', data.data)
        await dispatch('fetchVouchers', {
          page: rootGetters['dictionaries/getPagination'].current_page,
          perPage: rootGetters['dictionaries/getPagination'].per_page
        })
      } else {
        await commit('dictionaries/SAVE_STATUS', 'voucher-not-published', { root: true })
        if (data.httpCode === 401) {
          await commit('dictionaries/SAVE_STATUS', 'unauthorized', { root: true })
        }
      }
    } catch (e) {
      await commit('dictionaries/SAVE_STATUS', 'voucher-not-published', { root: true })
    }
  }
}
