export const state = () => ({
  activePageType: 'events',
  activeMenuItem: 'all',
  newsEventsMenu: [
    { title: 'All', flag: 'all' },
    { title: 'Approved', flag: 'approved' },
    { title: 'Waiting', flag: 'waiting' },
    { title: 'Rejected', flag: 'rejected' }
  ],
  newsEvents: [
    {
      id: 0,
      type: 'news',
      status: 'approved',
      title: 'Vinařství u Kapličky opět otevřeno!',
      published: '04.09.2021',
      description: 'Vážení návštevníci, prodejna Vinařství u Kapličky má po rekonstrukci konečne opět otevřeno. Navíc během záři zde probíha ochutnávka skvělého burčáku, tak se zastavte! :)',
      company: 'Novo Plaza'
    },
    {
      id: 1,
      type: 'news',
      status: 'waiting',
      title: 'Vinařství u Kapličky opět otevřeno!',
      published: '04.09.2021',
      description: 'Vážení návštevníci, prodejna Vinařství u Kapličky má po rekonstrukci konečne opět otevřeno. Navíc během záři zde probíha ochutnávka skvělého burčáku, tak se zastavte! :)',
      company: 'Novo Plaza'
    },
    {
      id: 2,
      type: 'news',
      status: 'rejected',
      title: 'Vinařství u Kapličky opět otevřeno!',
      published: '04.09.2021',
      description: 'Vážení návštevníci, prodejna Vinařství u Kapličky má po rekonstrukci konečne opět otevřeno. Navíc během záři zde probíha ochutnávka skvělého burčáku, tak se zastavte! :)',
      company: 'Novo Plaza'
    },
    {
      id: 3,
      type: 'news',
      status: 'rejected',
      title: 'Vinařství u Kapličky opět otevřeno!',
      published: '04.09.2021',
      description: 'Vážení návštevníci, prodejna Vinařství u Kapličky má po rekonstrukci konečne opět otevřeno. Navíc během záři zde probíha ochutnávka skvělého burčáku, tak se zastavte! :)',
      company: 'Novo Plaza'
    },
    {
      id: 4,
      type: 'news',
      status: 'rejected',
      title: 'Vinařství u Kapličky opět otevřeno!',
      published: '04.09.2021',
      description: 'Vážení návštevníci, prodejna Vinařství u Kapličky má po rekonstrukci konečne opět otevřeno. Navíc během záři zde probíha ochutnávka skvělého burčáku, tak se zastavte! :)',
      company: 'Novo Plaza'
    },
    {
      id: 5,
      type: 'news',
      status: 'approved',
      title: 'Vinařství u Kapličky opět otevřeno!',
      published: '04.09.2021',
      description: 'Vážení návštevníci, prodejna Vinařství u Kapličky má po rekonstrukci konečne opět otevřeno. Navíc během záři zde probíha ochutnávka skvělého burčáku, tak se zastavte! :)',
      company: 'Novo Plaza'
    },
    {
      id: 6,
      type: 'news',
      status: 'approved',
      title: 'Vinařství u Kapličky opět otevřeno!',
      published: '04.09.2021',
      description: 'Vážení návštevníci, prodejna Vinařství u Kapličky má po rekonstrukci konečne opět otevřeno. Navíc během záři zde probíha ochutnávka skvělého burčáku, tak se zastavte! :)',
      company: 'Novo Plaza'
    },
    {
      id: 7,
      type: 'news',
      status: 'approved',
      title: 'Vinařství u Kapličky opět otevřeno!',
      published: '04.09.2021',
      description: 'Vážení návštevníci, prodejna Vinařství u Kapličky má po rekonstrukci konečne opět otevřeno. Navíc během záři zde probíha ochutnávka skvělého burčáku, tak se zastavte! :)',
      company: 'Novo Plaza'
    },
    {
      id: 8,
      type: 'news',
      status: 'waiting',
      title: 'Vinařství u Kapličky opět otevřeno!',
      published: '04.09.2021',
      description: 'Vážení návštevníci, prodejna Vinařství u Kapličky má po rekonstrukci konečne opět otevřeno. Navíc během záři zde probíha ochutnávka skvělého burčáku, tak se zastavte! :)',
      company: 'Novo Plaza'
    },
    {
      id: 9,
      type: 'news',
      status: 'waiting',
      title: 'Vinařství u Kapličky opět otevřeno!',
      published: '04.09.2021',
      description: 'Vážení návštevníci, prodejna Vinařství u Kapličky má po rekonstrukci konečne opět otevřeno. Navíc během záři zde probíha ochutnávka skvělého burčáku, tak se zastavte! :)',
      company: 'Novo Plaza'
    }
  ],
  currentNewsEvent: {
    id: null,
    type: null,
    status: null,
    title: null,
    published: null,
    company: null
  },
  currentNewsEventOpened: false
})

export const getters = {
  getActivePageType: state => state.activePageType,
  getNewsEventsMenu: state => JSON.parse(JSON.stringify(state.newsEventsMenu)),
  getActiveMenuItem: state => state.activeMenuItem,
  getNewsEvents: state => state.newsEvents,
  getCurrentNewsEvent: state => JSON.parse(JSON.stringify(state.currentNewsEvent)),
  getCurrentNewsEventOpened: state => state.currentNewsEventOpened
}

export const mutations = {
  SAVE_ACTIVE_PAGE_TYPE (state, flag) {
    state.activePageType = flag
  },
  SAVE_ACTIVE_MENU_ITEM (state, flag) {
    state.activeMenuItem = flag
  },
  SAVE_CURRENT_NEWS_EVENT (state, payload) {
    state.currentNewsEvent = payload
  },
  CLEAR_CURRENT_NEWS_EVENT (state) {
    state.currentNewsEvent = {
      id: null,
      type: null,
      status: null,
      title: null,
      published: null,
      company: null
    }
  },
  TOGGLE_CURRENT_NEWS_EVENT (state, flag) {
    console.warn('flag', flag)
    state.currentNewsEventOpened = flag
  }
}

export const actions = {}
