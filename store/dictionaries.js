export const state = () => ({
  source: null,
  status: null,
  activeNavigationItem: { parent: 'Community', child: null },
  searchMode: false,
  messageToast: {
    title: 'Toast title',
    description: 'Toast description',
    variant: 'warning'
  },
  navigation: [
    // {
    //   title: 'Community',
    //   is_hovered: false,
    //   child: null
    // },
    // {
    //   title: 'Requests',
    //   is_hovered: false,
    //   child: [
    //     { title: 'List' },
    //     { title: 'Templates' }
    //   ]
    // },
    // {
    //   title: 'Maintenance',
    //   is_hovered: false,
    //   child: null
    // },
    // {
    //   title: 'Security',
    //   is_hovered: false,
    //   child: null
    // },
    // {
    //   title: 'Parking',
    //   is_hovered: false,
    //   child: null
    // },
    {
      title: 'Marketing',
      is_hovered: false,
      flag: 'marketing',
      child: [
        // { title: 'Campaigns', flag: 'campaigns' },
        { title: 'News', flag: 'news' },
        { title: 'Events', flag: 'events' }
      ]
    },
    {
      title: 'Loyalty',
      is_hovered: false,
      flag: 'loyalty',
      child: [
        { title: 'Setup', flag: 'setup' },
        // { title: 'Program' },
        { title: 'Rewards', flag: 'rewards' },
        { title: 'Receipts', flag: 'receipts' },
        { title: 'Redeems', flag: 'redeems' },
        { title: 'Vouchers', flag: 'vouchers' }
      ]
    },
    {
      title: 'Data & Assets',
      is_hovered: false,
      flag: 'data-assets',
      child: [
        { title: 'FAQ', flag: 'faq' },
        { title: 'Map', flag: 'map' },
        { title: 'Tenants', flag: 'tenants' },
        // { title: 'Staff', flag: 'staff' },
        // { title: 'Products', flag: 'products' },
        { title: 'Customers', flag: 'customers' }
      ]
    },
    // {
    //   title: 'Analytics',
    //   is_hovered: false,
    //   child: [
    //     { title: 'Dashboard' },
    //     { title: 'Reports' },
    //     { title: 'Live View' }
    //   ]
    // },
    {
      title: 'Company Settings',
      is_hovered: false,
      flag: 'company-settings',
      child: [
        // { title: 'General' },
        // { title: 'Billing' },
        // { title: 'Staff' },
        // { title: 'Contacts' },
        // { title: 'Opening Hours' },
        { title: 'Parking', flag: 'parking' }
        // { title: 'Security' }
      ]
    }
  ],
  pagination: {
    current_page: null,
    per_page: null,
    total: null
  },
  sort: {
    order_by: null,
    asc_desc: null
  },
  filter: {
    status: null,
    company_id: null,
    company_category_id: null,
    reward_id: null,
    date_from: null,
    date_to: null,
    start_from: null,
    start_to: null,
    total_from: null,
    total_to: null,
    store_name: null,
    article: null,
    title: null,
    search_customer: null,
    archived: null
  },
  resetFilter: false,
  companyTypes: [],
  companyCategories: [],
  years: [
    { title: '2021', flag: '2021' },
    { title: '2022', flag: '2022' },
    { title: '2023', flag: '2023' },
    { title: '2024', flag: '2024' },
    { title: '2025', flag: '2025' },
    { title: '2026', flag: '2026' }
  ],
  months: [
    { title: 'January', flag: 'january', number: '01' },
    { title: 'February', flag: 'february', number: '02' },
    { title: 'March', flag: 'march', number: '03' },
    { title: 'April', flag: 'april', number: '04' },
    { title: 'May', flag: 'may', number: '05' },
    { title: 'June', flag: 'june', number: '06' },
    { title: 'July', flag: 'july', number: '07' },
    { title: 'August', flag: 'august', number: '08' },
    { title: 'September', flag: 'september', number: '09' },
    { title: 'October', flag: 'october', number: '10' },
    { title: 'November', flag: 'november', number: '11' },
    { title: 'December', flag: 'december', number: '12' }
  ],
  hours: [
    { title: '00', flag: '00' },
    { title: '01', flag: '01' },
    { title: '02', flag: '02' },
    { title: '03', flag: '03' },
    { title: '04', flag: '04' },
    { title: '05', flag: '05' },
    { title: '06', flag: '06' },
    { title: '07', flag: '07' },
    { title: '08', flag: '08' },
    { title: '09', flag: '09' },
    { title: '10', flag: '10' },
    { title: '11', flag: '11' },
    { title: '12', flag: '12' },
    { title: '13', flag: '13' },
    { title: '14', flag: '14' },
    { title: '15', flag: '15' },
    { title: '16', flag: '16' },
    { title: '17', flag: '17' },
    { title: '18', flag: '18' },
    { title: '19', flag: '19' },
    { title: '20', flag: '20' },
    { title: '21', flag: '21' },
    { title: '22', flag: '22' },
    { title: '23', flag: '23' }
  ],
  minutes: [
    { title: '00', flag: '00' },
    { title: '01', flag: '01' },
    { title: '02', flag: '02' },
    { title: '03', flag: '03' },
    { title: '04', flag: '04' },
    { title: '05', flag: '05' },
    { title: '06', flag: '06' },
    { title: '07', flag: '07' },
    { title: '08', flag: '08' },
    { title: '09', flag: '09' },
    { title: '10', flag: '10' },
    { title: '11', flag: '11' },
    { title: '12', flag: '12' },
    { title: '13', flag: '13' },
    { title: '14', flag: '14' },
    { title: '15', flag: '15' },
    { title: '16', flag: '16' },
    { title: '17', flag: '17' },
    { title: '18', flag: '18' },
    { title: '19', flag: '19' },
    { title: '20', flag: '20' },
    { title: '21', flag: '21' },
    { title: '22', flag: '22' },
    { title: '23', flag: '23' },
    { title: '24', flag: '24' },
    { title: '25', flag: '25' },
    { title: '26', flag: '26' },
    { title: '27', flag: '27' },
    { title: '28', flag: '28' },
    { title: '29', flag: '29' },
    { title: '30', flag: '30' },
    { title: '31', flag: '31' },
    { title: '32', flag: '32' },
    { title: '33', flag: '33' },
    { title: '34', flag: '34' },
    { title: '35', flag: '35' },
    { title: '36', flag: '36' },
    { title: '37', flag: '37' },
    { title: '38', flag: '38' },
    { title: '39', flag: '39' },
    { title: '40', flag: '40' },
    { title: '41', flag: '41' },
    { title: '42', flag: '42' },
    { title: '43', flag: '43' },
    { title: '44', flag: '44' },
    { title: '45', flag: '45' },
    { title: '46', flag: '46' },
    { title: '47', flag: '47' },
    { title: '48', flag: '48' },
    { title: '49', flag: '49' },
    { title: '50', flag: '50' },
    { title: '51', flag: '51' },
    { title: '52', flag: '52' },
    { title: '53', flag: '53' },
    { title: '54', flag: '54' },
    { title: '55', flag: '55' },
    { title: '56', flag: '56' },
    { title: '57', flag: '57' },
    { title: '58', flag: '58' },
    { title: '59', flag: '59' }
  ],
  programs: [],
  companies: [],
  isPreloaderShown: false,
  receiptStatuses: [
    { title: 'In review', flag: '0' },
    { title: 'Approved', flag: '1' },
    { title: 'Rejected', flag: '2' }
  ],
  redeemStatuses: [
    { title: 'Activated', flag: '0' },
    { title: 'Redeemed', flag: '1' },
    { title: 'Canceled', flag: '2' }
  ],
  rewardStatuses: [
    { title: 'Published', flag: '1' },
    { title: 'Archived', flag: '0' },
    { title: 'Scheduled', flag: '3' }
  ],
  voucherStatuses: [
    { title: 'Published', flag: '1' },
    { title: 'Archived', flag: '0' }
  ],
  eventStatuses: [
    { title: 'Archived', flag: '0' },
    { title: 'Published', flag: '1' }
  ],
  testArray: [
    { title: 'Title 1', flag: 'one' },
    { title: 'Title 2', flag: 'two' },
    { title: 'Title 3', flag: 'three' }
  ],
  statuses: [
    { title: 'Archived', name: 'archived', flag: 0 },
    { title: 'Published', name: 'published', flag: 1 },
    { title: 'Draft', name: 'draft', flag: 2 },
    { title: 'Scheduled', name: 'scheduled', flag: 3 },
    { title: 'In review', name: 'in_review', flag: 4 },
    { title: 'Approved', name: 'approved', flag: 5 },
    { title: 'Rejected', name: 'rejected', flag: 6 },
    { title: 'Activated', name: 'activated', flag: 7 },
    { title: 'Redeemed', name: 'redeemed', flag: 8 },
    { title: 'Canceled', name: 'canceled', flag: 9 }
  ],
  childPageIsOpen: null
})

export const getters = {
  getStatus: state => state.status,
  getActiveNavigationItem: state => JSON.parse(JSON.stringify(state.activeNavigationItem)),
  getNavigation: state => JSON.parse(JSON.stringify(state.navigation)),
  getPagination: state => JSON.parse(JSON.stringify(state.pagination)),
  getCompanyTypesList: state => JSON.parse(JSON.stringify(state.companyTypes)),
  getCompanyCategories: state => JSON.parse(JSON.stringify(state.companyCategories)),
  getPrograms: state => JSON.parse(JSON.stringify(state.programs)),
  getCompanies: state => JSON.parse(JSON.stringify(state.companies)),
  getMonths: state => JSON.parse(JSON.stringify(state.months)),
  getYears: state => JSON.parse(JSON.stringify(state.years)),
  getHours: state => JSON.parse(JSON.stringify(state.hours)),
  getMinutes: state => JSON.parse(JSON.stringify(state.minutes)),
  getPreloaderShown: state => state.isPreloaderShown,
  getTestArray: state => JSON.parse(JSON.stringify(state.testArray)),
  getSource: state => state.source,
  getSort: state => JSON.parse(JSON.stringify(state.sort)),
  getQuerySort: (state, getters) => {
    if (getters.getSort.order_by) {
      return `${getters.getSort.asc_desc === 'desc' ? '' : '-'}${getters.getSort.order_by}`
    } else {
      return null
    }
  },
  getFilter: state => JSON.parse(JSON.stringify(state.filter)),
  getReceiptStatuses: state => JSON.parse(JSON.stringify(state.receiptStatuses)),
  getEventStatuses: state => JSON.parse(JSON.stringify(state.eventStatuses)),
  getRedeemStatuses: state => JSON.parse(JSON.stringify(state.redeemStatuses)),
  getRewardStatuses: state => JSON.parse(JSON.stringify(state.rewardStatuses)),
  getVoucherStatuses: state => JSON.parse(JSON.stringify(state.voucherStatuses)),
  getRouteParams: (state, getters, rootState, rootGetters) => {
    const filter = rootGetters['dictionaries/getFilter']
    const params = { sort: rootGetters['dictionaries/getQuerySort'] }
    params.page = getters.getPagination.current_page
    params.per_page = getters.getPagination.per_page
    if (Object.values(filter) && Object.values(filter).length) {
      Object.keys(filter).forEach((field, index) => {
        params[`filter[${field}]`] = Object.values(filter)[index]
      })
    }
    return params
  },
  getRouteUrl: (state, getters, rootState, rootGetters) => {
    const filter = rootGetters['dictionaries/getFilter']
    const params = { sort: rootGetters['dictionaries/getQuerySort'] }
    params.page = getters.getPagination.current_page
    params.per_page = getters.getPagination.per_page
    if (Object.values(filter) && Object.values(filter).length) {
      Object.keys(filter).forEach((field, index) => {
        params[field] = Object.values(filter)[index]
      })
    }
    return params
  },
  getResetFilter: state => state.resetFilter,
  getSearchMode: state => state.searchMode,
  getStatuses: state => JSON.parse(JSON.stringify(state.statuses)),
  getMessageToast: state => JSON.parse(JSON.stringify(state.messageToast)),
  getChildPageIsOpen: state => state.childPageIsOpen
}

export const mutations = {
  SAVE_STATUS (state, status) {
    state.status = status
  },
  UPDATE_PAGINATION (state, payload) {
    state.pagination = JSON.parse(JSON.stringify(payload))
    delete state.pagination.data
  },
  UPDATE_PAGINATION_FIELD (state, payload) {
    state.pagination[payload.field] = payload.value
  },
  SAVE_COMPANY_TYPES_LIST (state, companyTypes) {
    state.companyTypes = companyTypes
  },
  SAVE_COMPANY_CATEGORIES_LIST (state, companyCategories) {
    state.companyCategories = companyCategories
  },
  SAVE_PROGRAMS (state, programs) {
    state.programs = programs
  },
  SAVE_COMPANIES (state, companies) {
    state.companies = companies
  },
  TOGGLE_PRELOADER (state, flag) {
    state.isPreloaderShown = flag
  },
  UPDATE_SOURCE (state, source) {
    state.source = source
  },
  SET_ACTIVE_NAVIGATION_ITEM (state, item) {
    // if (item.child && item.child.length) {
    //   state.activeNavigationItem.parent = item.title
    //   state.activeNavigationItem.child = item.child[0].title
    // } else {
    //   state.activeNavigationItem.parent = item.title
    //   state.activeNavigationItem.child = null
    // }
    state.activeNavigationItem.parent = item.title
    state.activeNavigationItem.child = null
  },
  SET_ACTIVE_NAVIGATION_CHILD (state, payload) {
    state.activeNavigationItem.parent = state.navigation[payload.parentKey].title
    state.activeNavigationItem.child = state.navigation[payload.parentKey].child[payload.childKey].title
  },
  SET_ACTIVE_NAVIGATION_PARENT_ITEM (state, data) {
    state.activeNavigationItem.parent = data
  },
  SET_ACTIVE_NAVIGATION_CHILD_ITEM (state, data) {
    state.activeNavigationItem.child = data
  },
  UPDATE_SORTING (state, sort) {
    state.sort = sort
  },
  UPDATE_FILTER (state, payload) {
    state.pagination.current_page = 1
    if (payload.value) {
      state.filter[payload.field] = payload.value
    } else {
      state.filter[payload.field] = null
    }
  },
  UPDATE_DATES_FILTER (state, payload) {
    state.filter.date_from = payload.date_from
    state.filter.date_to = payload.date_to
  },
  UPDATE_START_FIELDS_FILTER (state, payload) {
    state.filter.start_from = payload.start_from
    state.filter.start_to = payload.start_to
  },
  RESET_FILTER (state) {
    Object.keys(state.filter).forEach((field) => {
      state.filter[field] = null
    })
    state.resetFilter = true
  },
  RESET_EVENT_FILTER (state, payload) {
    Object.keys(state.filter).forEach((field) => {
      state.filter[field] = null
    })
    state.filter.start_from = payload.date_from
    state.filter.start_to = payload.date_to
    state.resetFilter = true
  },
  TOGGLE_RESET_FILTER (state, flag) {
    state.resetFilter = flag
  },
  UPDATE_SEARCH_MODE (state, flag) {
    state.searchMode = flag
  },
  SAVE_MESSAGE_TOAST (state, payload) {
    state.messageToast = payload
  },
  CLEAR_PAGINATION_SORT_FILTER (state) {
    Object.keys(state.filter).forEach((field) => {
      state.filter[field] = null
    })
    Object.keys(state.sort).forEach((field) => {
      state.sort[field] = null
    })
    Object.keys(state.pagination).forEach((field) => {
      state.pagination[field] = null
    })
  },
  UPDATE_PAGINATION_SORT_FILTER (state, payload) {
    Object.keys(payload).forEach((field) => {
      if (Object.keys(state.filter).includes(field)) {
        state.filter[field] = payload[field]
      } else if (Object.keys(state.pagination).includes(field)) {
        state.pagination[field] = payload[field]
      } else if (field === 'sort') {
        let value = payload[field].split('')
        if (value[0] === '-') {
          value = value.filter((element, index) => {
            return index !== 0
          })
        }
        state.sort.order_by = value.join('')
      } else if (field === 'page') {
        state.pagination.current_page = payload[field]
      }
    })
  },
  TOGGLE_CHILD_PAGE_STATE (state, flag) {
    state.childPageIsOpen = flag
  }
}

export const actions = {
  updateSortPaginationFilter ({ commit }, payload) {
    commit('CLEAR_PAGINATION_SORT_FILTER')
    if (payload) {
      commit('UPDATE_PAGINATION_SORT_FILTER', payload)
    }
  },
  async fetchCompanyTypes ({ commit, rootGetters }) {
    try {
      const { data } = await this.$axios.get('api/company-types', {
        headers: {
          Authorization: `Bearer ${rootGetters['authorization/getAccessToken']}`
        }
      })
      if (data.status === 'success') {
        commit('SAVE_COMPANY_TYPES_LIST', data.data.data)
      } else if (data.httpCode === 401) {
        await commit('dictionaries/SAVE_STATUS', 'unauthorized', { root: true })
      }
    } catch (e) {
      console.warn('fetch error', e)
    }
  },
  async fetchCompanyCategories ({ commit, rootGetters }) {
    try {
      const { data } = await this.$axios.get('api/company-cats', {
        headers: {
          Authorization: `Bearer ${rootGetters['authorization/getAccessToken']}`
        }
      })
      if (data.status === 'success') {
        commit('SAVE_COMPANY_CATEGORIES_LIST', data.data.data)
      } else if (data.httpCode === 401) {
        await commit('dictionaries/SAVE_STATUS', 'unauthorized', { root: true })
      }
    } catch (e) {
      console.warn('fetch error', e)
    }
  },
  async fetchPrograms ({ commit, rootGetters }) {
    try {
      const { data } = await this.$axios.get('api/programs', {
        headers: {
          Authorization: `Bearer ${rootGetters['authorization/getAccessToken']}`
        }
      })
      if (data.status === 'success') {
        commit('SAVE_PROGRAMS', data)
      } else if (data.httpCode === 401) {
        await commit('dictionaries/SAVE_STATUS', 'unauthorized', { root: true })
      }
    } catch (e) {
      console.warn('fetch error', e)
    }
  },
  async fetchCompanies ({ commit, rootGetters }) {
    try {
      const { data } = await this.$axios.get('api/companies', {
        headers: {
          Authorization: `Bearer ${rootGetters['authorization/getAccessToken']}`
        }
      })
      if (data.status === 'success') {
        commit('SAVE_COMPANIES', data)
      } else if (data.httpCode === 401) {
        await commit('dictionaries/SAVE_STATUS', 'unauthorized', { root: true })
      }
    } catch (e) {
      console.warn('fetch error', e)
    }
  },
  async sendPageData ({ commit, dispatch, getters }, payload) {
    switch (getters.getSource) {
      case 'receipts':
        await dispatch('receipts/fetchReceipts', payload, { root: true })
        break
      case 'rewards':
        await dispatch('rewards/fetchRewards', payload, { root: true })
        break
      case 'news':
        await dispatch('news/fetchNews', payload, { root: true })
        break
      case 'tenants':
        await dispatch('tenants/fetchTenants', payload, { root: true })
        break
      case 'redeems':
        await dispatch('redeems/fetchRedeems', payload, { root: true })
        break
      case 'customers':
        await dispatch('customers/fetchCustomers', payload, { root: true })
        break
      case 'events':
        await dispatch('events/fetchEvents', payload, { root: true })
        break
      case 'vouchers':
        await dispatch('vouchers/fetchVouchers', payload, { root: true })
        break
      case 'settings':
        await dispatch('settings/fetchSettings', null, { root: true })
        await dispatch('settings/fetchValuePointsList', payload, { root: true })
        break
    }
  },
  async resetFilter ({ dispatch, commit }) {
    await commit('RESET_FILTER')
    await dispatch('sendPageData')
  },
  async resetEventFilter ({ dispatch, commit }, payload) {
    await commit('RESET_EVENT_FILTER', payload)
    await dispatch('sendPageData')
  }
}
