export const state = () => ({
  authStatus: null,
  formData: {
    email: null,
    password: null
  },
  authData: {},
  errorAuthData: {
    email: null,
    password: null
  },
  authToken: null,
  permissions: {
    menu: {
      data_assets: {
        items: {
          tenants: false,
          customers: false
        }
      },
      loyalty: {
        items: {
          setup: false,
          rewards: false,
          receipts: false,
          redeems: false,
          vouchers: false
        }
      },
      marketings: {
        items: {
          news: false,
          events: false
        }
      }
    }
  }
})

export const getters = {
  getAuthStatus: state => state.authStatus,
  getFormData: state => JSON.parse(JSON.stringify(state.formData)),
  getAuthData: state => JSON.parse(JSON.stringify(state.authData)),
  getErrorAuthData: state => JSON.parse(JSON.stringify(state.errorAuthData)),
  getAuthToken: state => state.authToken,
  getAccessToken (state) {
    const storageToken = localStorage.getItem('access_token')
    if (state.authToken) {
      return state.authToken
    } else {
      return storageToken
    }
  },
  getPermissions (state) {
    const storagePermissions = localStorage.getItem('permissions')
    if (storagePermissions) {
      return Object.assign(JSON.parse(JSON.stringify(state.permissions)), JSON.parse(storagePermissions))
    } else {
      return state.permissions
    }
  }
}

export const mutations = {
  SAVE_STATUS (state, status) {
    state.authStatus = status
  },
  UPDATE_FORM_DATA (state, payload) {
    state.formData[payload.field] = payload.value
  },
  SAVE_AUTH_DATA (state, authData) {
    localStorage.removeItem('access_token')
    localStorage.setItem('access_token', authData.access_token)
    localStorage.setItem('permissions', JSON.stringify(authData.permissions))
    state.authData = authData
    state.authToken = authData.access_token
    state.permissions = authData.permissions
  },
  SAVE_ERROR_AUTH_DATA (state, errorAuthData) {
    if (errorAuthData.email && errorAuthData.email.length) {
      state.errorAuthData.email = errorAuthData.email[0]
    } else {
      state.errorAuthData.email = errorAuthData.email
    }
    if (errorAuthData.password && errorAuthData.password.length) {
      state.errorAuthData.password = errorAuthData.password[0]
    } else {
      state.errorAuthData.password = errorAuthData.password
    }
  },
  CLEAR_ERROR_AUTH_DATA (state) {
    state.errorAuthData = {
      email: null,
      password: null
    }
  },
  CLEAR_AUTH_TOKEN (state) {
    localStorage.removeItem('access_token')
    localStorage.removeItem('permissions')
    state.authToken = null
    state.authData = {}
  },
  CLEAR_FORM_DATA (state) {
    state.formData = {
      email: null,
      password: null
    }
  }
}

export const actions = {
  async login ({ getters, commit }) {
    await commit('CLEAR_ERROR_AUTH_DATA')
    await commit('dictionaries/SAVE_STATUS', 'fetch', { root: true })
    try {
      const { data } = await this.$auth.loginWith('local', { data: getters.getFormData })
      await commit('dictionaries/SAVE_STATUS', 'auth-success', { root: true })
      if (data.status === 'success') {
        await commit('SAVE_AUTH_DATA', data.data)
        await commit('CLEAR_FORM_DATA')
      } else {
        await commit('SAVE_ERROR_AUTH_DATA', data.data)
      }
    } catch (e) {
      await commit('dictionaries/SAVE_STATUS', 'error', { root: true })
    }
  },
  async logout ({ commit, getters }) {
    await commit('dictionaries/SAVE_STATUS', 'fetch', { root: true })
    try {
      await this.$axios.get('/api/logout', {
        headers: {
          Authorization: `Bearer ${getters.getAccessToken}`
        }
      })
      await commit('dictionaries/SAVE_STATUS', 'logout-success', { root: true })
      await commit('CLEAR_AUTH_TOKEN')
    } catch (e) {
      await commit('dictionaries/SAVE_STATUS', 'error', { root: true })
    }
  }
}
