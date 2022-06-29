export const state = () => ({
  tenants: [],
  tenantsList: [],
  activeNewsMenuItem: 'general',
  tenantMenu: [
    { title: 'General', flag: 'general' },
    { title: 'Store', flag: 'store' },
    { title: 'Loyalty', flag: 'loyalty' }
  ],
  currentTenant: {
    title: null,
    floor: null,
    description: null,
    store_name: null,
    phone: null,
    email: null,
    website: null,
    facebook: null,
    instagram: null,
    mall_id: 1,
    company_category_id: null,
    company_identification: {
      company_id: null,
      legal_address: null,
      legal_company_id: null,
      legal_name: null,
      loyalty_company_name: null,
      loyalty_receipt_copy_words: null,
      loyalty_store_name: null,
      loyalty_unique_string: null,
      vat: null
    },
    loyalty_status: null,
    country_id: 1,
    company_type_id: 2,
    non_stop: false,
    temporary_closed: false,
    big_logo: null,
    logo_picture: null,
    open_hours: [
      { from: '09:00:00', to: '21:00:00' },
      { from: '09:00:00', to: '21:00:00' },
      { from: '09:00:00', to: '21:00:00' },
      { from: '09:00:00', to: '21:00:00' },
      { from: '09:00:00', to: '21:00:00' },
      { from: '09:00:00', to: '21:00:00' },
      { from: '09:00:00', to: '21:00:00' }
    ]
  },
  tenantImages: {
    arrayBuffer: {
      big: null,
      small: null
    },
    base64: {
      big: null,
      small: null
    }
  }
})

export const getters = {
  getTenants: state => JSON.parse(JSON.stringify(state.tenants)),
  getTenantMenu: state => JSON.parse(JSON.stringify(state.tenantMenu)),
  getActiveNewsMenuItem: state => state.activeNewsMenuItem,
  getTenantsList: state => JSON.parse(JSON.stringify(state.tenantsList)),
  getCurrentTenant: state => JSON.parse(JSON.stringify(state.currentTenant)),
  getTenantImages: state => state.tenantImages,
  getBase64images: state => JSON.parse(JSON.stringify(state.tenantImages.base64))
}

export const mutations = {
  SAVE_TENANTS (state, tenants) {
    state.tenants = tenants
  },
  SAVE_TENANTS_LIST (state, tenantList) {
    state.tenantsList = tenantList
  },
  UPDATE_CURRENT_TENANT (state, payload) {
    if (payload.subfield) {
      state.currentTenant[payload.field][payload.subfield] = payload.value
    } else if (payload.field === 'title') {
      state.currentTenant.title = payload.value
      state.currentTenant.store_name = payload.value
    } else {
      state.currentTenant[payload.field] = payload.value
    }
  },
  CLEAR_CURRENT_TENANT (state) {
    state.currentTenant = {
      title: null,
      floor: null,
      description: null,
      store_name: null,
      phone: null,
      email: null,
      website: null,
      facebook: null,
      instagram: null,
      mall_id: 1,
      company_category_id: null,
      company_identification: {
        company_id: null,
        legal_address: null,
        legal_company_id: null,
        legal_name: null,
        loyalty_company_name: null,
        loyalty_receipt_copy_words: null,
        loyalty_store_name: null,
        loyalty_unique_string: null,
        vat: null
      },
      loyalty_status: null,
      country_id: 1,
      company_type_id: 2,
      non_stop: false,
      temporary_closed: false,
      big_logo: null,
      logo_picture: null,
      open_hours: [
        { from: '09:00:00', to: '21:00:00' },
        { from: '09:00:00', to: '21:00:00' },
        { from: '09:00:00', to: '21:00:00' },
        { from: '09:00:00', to: '21:00:00' },
        { from: '09:00:00', to: '21:00:00' },
        { from: '09:00:00', to: '21:00:00' },
        { from: '09:00:00', to: '21:00:00' }
      ]
    }
    state.tenantImages.arrayBuffer.big = null
    state.tenantImages.arrayBuffer.small = null
    state.tenantImages.base64.big = null
    state.tenantImages.base64.small = null
  },
  SAVE_CURRENT_TENANT (state, currentTenant) {
    state.currentTenant = JSON.parse(JSON.stringify(currentTenant))
    if (!state.currentTenant.company_identification) {
      state.currentTenant.company_identification = {
        company_id: null,
        legal_address: null,
        legal_company_id: null,
        legal_name: null,
        loyalty_company_name: null,
        loyalty_receipt_copy_words: null,
        loyalty_store_name: null,
        loyalty_unique_string: null,
        vat: null
      }
    }
  },
  SAVE_TENANT_LOGO (state, payload) {
    state.tenantImages[payload.field][payload.type] = payload.image
  },
  SET_ACTIVE_NEWS_MENU_ITEM (state, payload) {
    state.activeNewsMenuItem = payload
  }
}

export const actions = {
  async fetchTenantsList ({ commit, rootGetters }) {
    try {
      const { data } = await this.$axios.get('/api/companies?per_page=1000000', {
        headers: {
          Authorization: `Bearer ${rootGetters['authorization/getAccessToken']}`
        }
      })
      if (data.status === 'success') {
        await commit('SAVE_TENANTS_LIST', data.data.data)
      } else if (data.httpCode === 401) {
        await commit('dictionaries/SAVE_STATUS', 'unauthorized', { root: true })
      }
    } catch (e) {
      console.log('error', e)
    }
  },
  async fetchTenants ({ commit, rootGetters }, payload) {
    await commit('dictionaries/SAVE_STATUS', 'fetch', { root: true })
    try {
      const { data } = await this.$axios.get(`/api/companies?page=${
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
        await commit('dictionaries/SAVE_STATUS', 'tenants-successfully-fetched', { root: true })
        await commit('SAVE_TENANTS', data.data.data)
        await commit('dictionaries/UPDATE_PAGINATION', data.data, { root: true })
      } else {
        await commit('dictionaries/SAVE_STATUS', 'tenants-not-fetched', { root: true })
        if (data.httpCode === 401) {
          await commit('dictionaries/SAVE_STATUS', 'unauthorized', { root: true })
        }
      }
    } catch (e) {
      console.log('error', e)
    }
  },
  async fetchCurrentTenant ({ commit, rootGetters }, tenantId) {
    await commit('dictionaries/SAVE_STATUS', 'fetch', { root: true })
    try {
      const { data } = await this.$axios.get(`/api/companies/${tenantId}`, {
        headers: {
          Authorization: `Bearer ${rootGetters['authorization/getAccessToken']}`
        }
      })
      if (data.status === 'success') {
        await commit('SAVE_CURRENT_TENANT', data.data)
        await commit('dictionaries/SAVE_STATUS', 'current-tenant-successfully-fetched', { root: true })
      } else {
        await commit('dictionaries/SAVE_STATUS', 'current-tenant-not-fetched', { root: true })
        if (data.httpCode === 401) {
          await commit('dictionaries/SAVE_STATUS', 'unauthorized', { root: true })
        }
      }
    } catch (e) {
      console.log('error', e)
    }
  },
  async createCurrentTenant ({ state, dispatch, commit, getters, rootGetters }, payload) {
    const currentTenant = Object.fromEntries(Object.entries(payload).filter(([_, v]) => v != null))
    currentTenant.open_hours = JSON.stringify(currentTenant.open_hours)
    try {
      const { data } = await this.$axios.post('/api/companies', currentTenant, {
        headers: {
          Authorization: `Bearer ${rootGetters['authorization/getAccessToken']}`
        }
      })
      if (data.status === 'success') {
        if (state.tenantImages.arrayBuffer.big) {
          await dispatch('uploadCurrentTenantPicture', data.data.id)
        }
        if (state.tenantImages.arrayBuffer.small) {
          await dispatch('uploadCurrentTenantSmallPicture', data.data.id)
        }
        await commit('CLEAR_CURRENT_TENANT')
        await commit('dictionaries/SAVE_STATUS', 'tenant-successfully-created', { root: true })
        await dispatch('fetchTenants', {
          page: rootGetters['dictionaries/getPagination'].current_page,
          perPage: rootGetters['dictionaries/getPagination'].per_page
        })
      } else {
        await commit('dictionaries/SAVE_STATUS', 'tenant-not-created', { root: true })
        if (data.httpCode === 401) {
          await commit('dictionaries/SAVE_STATUS', 'unauthorized', { root: true })
        }
      }
    } catch (e) {
      console.log('error', e)
    }
  },
  async updateCurrentTenant ({ state, dispatch, getters, rootGetters, commit }, payload) {
    try {
      const { data } = await this.$axios.put(`api/companies/${getters.getCurrentTenant.id}`, payload, {
        headers: {
          Authorization: `Bearer ${rootGetters['authorization/getAccessToken']}`
        }
      })
      if (data.status === 'success') {
        if (state.tenantImages.arrayBuffer.big) {
          await dispatch('uploadCurrentTenantPicture')
        }
        if (state.tenantImages.arrayBuffer.small) {
          await dispatch('uploadCurrentTenantSmallPicture')
        }
        await commit('SAVE_CURRENT_TENANT', data.data)
        await commit('dictionaries/SAVE_STATUS', 'tenant-successfully-updated', { root: true })
        await dispatch('fetchTenants', {
          page: rootGetters['dictionaries/getPagination'].current_page,
          perPage: rootGetters['dictionaries/getPagination'].per_page
        })
      } else {
        await commit('dictionaries/SAVE_STATUS', 'tenant-not-updated', { root: true })
        if (data.httpCode === 401) {
          await commit('dictionaries/SAVE_STATUS', 'unauthorized', { root: true })
        }
      }
    } catch (e) {
      console.log('error', e)
    }
  },
  async removeTenant ({ commit, dispatch, getters, rootGetters }) {
    await commit('dictionaries/SAVE_STATUS', 'fetch', { root: true })
    try {
      const { data } = await this.$axios.delete(`api/companies/${getters.getCurrentTenant.id}`, {
        headers: {
          Authorization: `Bearer ${rootGetters['authorization/getAccessToken']}`
        }
      })
      if (data.status === 'success') {
        await commit('dictionaries/SAVE_STATUS', 'tenant-successfully-deleted', { root: true })
        await dispatch('fetchTenants', {
          page: rootGetters['dictionaries/getPagination'].current_page,
          perPage: rootGetters['dictionaries/getPagination'].per_page
        })
      } else {
        await commit('dictionaries/SAVE_STATUS', 'tenant-not-deleted', { root: true })
        if (data.httpCode === 401) {
          await commit('dictionaries/SAVE_STATUS', 'unauthorized', { root: true })
        }
      }
    } catch (e) {
      console.log('error', e)
    }
  },
  async uploadCurrentTenantPicture ({ state, getters, rootGetters }, tenantId) {
    try {
      await this.$axios.put(`api/companies/upload-big-logo/${tenantId || getters.getCurrentTenant.id}`,
        state.tenantImages.arrayBuffer.big, {
          headers: {
            'Content-Type': 'image/png',
            Authorization: `Bearer ${rootGetters['authorization/getAccessToken']}`
          }
        })
    } catch (e) {
      console.log('error', e)
    }
  },
  async uploadCurrentTenantSmallPicture ({ state, getters, rootGetters }, tenantId) {
    try {
      await this.$axios.put(`api/companies/upload-logo/${tenantId || getters.getCurrentTenant.id}`,
        state.tenantImages.arrayBuffer.small, {
          headers: {
            'Content-Type': 'image/png',
            Authorization: `Bearer ${rootGetters['authorization/getAccessToken']}`
          }
        })
    } catch (e) {
      console.log('error', e)
    }
  },
  async archiveCurrentTenant ({ commit, dispatch, rootGetters }, tenantId) {
    try {
      const { data } = await this.$axios.patch(`api/companies/archive/${tenantId}`, null, {
        headers: {
          Authorization: `Bearer ${rootGetters['authorization/getAccessToken']}`
        }
      })
      if (data.status === 'success') {
        await commit('dictionaries/SAVE_STATUS', 'tenant-successfully-archived', { root: true })
        await commit('SAVE_CURRENT_TENANT', data.data)
        await dispatch('fetchTenants', {
          page: rootGetters['dictionaries/getPagination'].current_page,
          perPage: rootGetters['dictionaries/getPagination'].per_page
        })
      } else {
        await commit('dictionaries/SAVE_STATUS', 'tenant-not-archived', { root: true })
        if (data.httpCode === 401) {
          await commit('dictionaries/SAVE_STATUS', 'unauthorized', { root: true })
        }
      }
    } catch (e) {
      await commit('dictionaries/SAVE_STATUS', 'tenant-not-archived', { root: true })
    }
  },
  async publishCurrentTenant ({ commit, dispatch, rootGetters }, eventId) {
    try {
      const { data } = await this.$axios.put(`api/companies/publish/${eventId}`, null, {
        headers: {
          Authorization: `Bearer ${rootGetters['authorization/getAccessToken']}`
        }
      })
      if (data.status === 'success') {
        await commit('dictionaries/SAVE_STATUS', 'tenant-successfully-published', { root: true })
        await commit('SAVE_CURRENT_TENANT', data.data)
        await dispatch('fetchTenants', {
          page: rootGetters['dictionaries/getPagination'].current_page,
          perPage: rootGetters['dictionaries/getPagination'].per_page
        })
      } else {
        await commit('dictionaries/SAVE_STATUS', 'tenant-not-published', { root: true })
        if (data.httpCode === 401) {
          await commit('dictionaries/SAVE_STATUS', 'unauthorized', { root: true })
        }
      }
    } catch (e) {
      await commit('dictionaries/SAVE_STATUS', 'tenant-not-published', { root: true })
    }
  }
}
