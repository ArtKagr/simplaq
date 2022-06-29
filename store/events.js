export const state = () => ({
  events: [],
  eventsList: [],
  currentEvent: {
    id: null,
    title: null,
    description: null,
    picture_link: null,
    start: null,
    finish: null,
    company: {
      big_logo: null,
      store_name: null
    }
  },
  dateTime: {
    startDate: null,
    startTime: null,
    endDate: null,
    endTime: null
  },
  newEventCalendarPeriod: {
    start: null,
    finish: null
  },
  eventCalendar: {
    calendar: null,
    previousMonth: null,
    nextMonth: null,
    activeMonth: { title: null, flag: null },
    activeYear: { title: null, flag: null },
    monthDays: []
  },
  eventArrayBufferImage: null,
  eventBase64Image: null
})

export const getters = {
  getEvents: state => JSON.parse(JSON.stringify(state.events)),
  getEventsList: state => JSON.parse(JSON.stringify(state.eventsList)),
  getCurrentEvent: state => JSON.parse(JSON.stringify(state.currentEvent)),
  getNewEventCalendarPeriod: state => JSON.parse(JSON.stringify(state.newEventCalendarPeriod)),
  getEventCalendar: state => JSON.parse(JSON.stringify(state.eventCalendar)),
  getEventBase64Image: state => JSON.parse(JSON.stringify(state.eventBase64Image)),
  getEventArrayBufferImage: state => state.eventArrayBufferImage
}

export const mutations = {
  SAVE_EVENTS (state, events) {
    state.events = events
  },
  SAVE_CURRENT_EVENT (state, currentEvent) {
    state.currentEvent = currentEvent
  },
  SAVE_EVENTS_LIST (state, eventsList) {
    state.eventsList = eventsList
  },
  SAVE_NEW_EVENT_CALENDAR_PERIOD (state, payload) {
    if (payload.value) {
      state.newEventCalendarPeriod[payload.field] = payload.value
    }
  },
  UPDATE_CURRENT_EVENT (state, payload) {
    state.currentEvent[payload.field] = payload.value
  },
  CLEAR_CURRENT_EVENT (state) {
    state.currentEvent = {
      id: null,
      title: null,
      description: null,
      picture_link: null,
      start: null,
      finish: null,
      company: {
        big_logo: null,
        store_name: null
      }
    }
    state.eventArrayBufferImage = null
    state.eventBase64Image = null
  },
  CLEAR_EVENT_CALENDAR (state) {
    state.eventCalendar = {
      calendar: null,
      previousMonth: null,
      nextMonth: null,
      activeMonth: { title: null, flag: null },
      activeYear: { title: null, flag: null },
      monthDays: []
    }
  },
  UPDATE_EVENT_CALENDAR (state, payload) {
    state.eventCalendar = Object.assign(state.eventCalendar, payload)
  },
  SAVE_ARRAY_BUFFER_IMAGE (state, image) {
    state.eventArrayBufferImage = image
  },
  SAVE_BASE_64_IMAGE (state, image) {
    state.eventBase64Image = image
  }
}

export const actions = {
  async fetchEventsList ({ commit, rootGetters }) {
    try {
      const { data } = await this.$axios.get('/api/events?per_page=1000000', {
        headers: {
          Authorization: `Bearer ${rootGetters['authorization/getAccessToken']}`
        }
      })
      if (data.status === 'success') {
        await commit('SAVE_EVENTS_LIST', data.data.data)
      } else if (data.httpCode === 401) {
        await commit('dictionaries/SAVE_STATUS', 'unauthorized', { root: true })
      }
    } catch (e) {
      console.log('error', e)
    }
  },
  async fetchEvents ({ commit, rootGetters }) {
    await commit('dictionaries/SAVE_STATUS', 'fetch', { root: true })
    try {
      const { data } = await this.$axios.get('/api/events', {
        headers: {
          Authorization: `Bearer ${rootGetters['authorization/getAccessToken']}`
        },
        params: rootGetters['dictionaries/getRouteParams']
      })
      if (data.status === 'success') {
        await commit('dictionaries/SAVE_STATUS', 'events-successfully-fetched', { root: true })
        await commit('SAVE_EVENTS', data.data.data)
      } else {
        await commit('dictionaries/SAVE_STATUS', 'events-not-fetched', { root: true })
        if (data.httpCode === 401) {
          await commit('dictionaries/SAVE_STATUS', 'unauthorized', { root: true })
        }
      }
    } catch (e) {
      console.log('error', e)
    }
  },
  async fetchCurrentEvent ({ commit, rootGetters }, eventId) {
    await commit('dictionaries/SAVE_STATUS', 'fetch', { root: true })
    try {
      const { data } = await this.$axios.get(`/api/events/${eventId}`, {
        headers: {
          Authorization: `Bearer ${rootGetters['authorization/getAccessToken']}`
        },
        params: rootGetters['dictionaries/getRouteParams']
      })
      if (data.status === 'success') {
        await commit('dictionaries/SAVE_STATUS', 'current-event-successfully-fetched', { root: true })
        await commit('SAVE_CURRENT_EVENT', data.data)
      } else {
        await commit('dictionaries/SAVE_STATUS', 'current-event-not-fetched', { root: true })
        if (data.httpCode === 401) {
          await commit('dictionaries/SAVE_STATUS', 'unauthorized', { root: true })
        }
      }
    } catch (e) {
      console.log('error', e)
    }
  },
  async createEvent ({ dispatch, getters, rootGetters, commit }, event) {
    try {
      const { data } = await this.$axios.post('api/events', event, {
        headers: {
          Authorization: `Bearer ${rootGetters['authorization/getAccessToken']}`
        }
      })
      if (data.status === 'success') {
        await dispatch('uploadCurrentEventPicture', data.data.id)
        await commit('SAVE_CURRENT_EVENT', data.data)
        await commit('dictionaries/SAVE_STATUS', 'event-successfully-created', { root: true })
        await dispatch('fetchEvents')
      } else {
        await commit('dictionaries/SAVE_STATUS', 'event-not-created', { root: true })
        if (data.httpCode === 401) {
          await commit('dictionaries/SAVE_STATUS', 'unauthorized', { root: true })
        }
      }
    } catch (e) {
      console.log('error', e)
    }
  },
  async removeEvent ({ commit, dispatch, getters, rootGetters }) {
    await commit('dictionaries/SAVE_STATUS', 'fetch', { root: true })
    try {
      const { data } = await this.$axios.delete(`api/events/${getters.getCurrentEvent.id}`, {
        headers: {
          Authorization: `Bearer ${rootGetters['authorization/getAccessToken']}`
        }
      })
      if (data.status === 'success') {
        await commit('dictionaries/SAVE_STATUS', 'event-successfully-deleted', { root: true })
        await dispatch('fetchEventsList')
        await dispatch('fetchEvents')
      } else {
        await commit('dictionaries/SAVE_STATUS', 'event-not-deleted', { root: true })
        if (data.httpCode === 401) {
          await commit('dictionaries/SAVE_STATUS', 'unauthorized', { root: true })
        }
      }
    } catch (e) {
      console.log('error', e)
    }
  },
  async updateEvent ({ commit, dispatch, getters, rootGetters }, payload) {
    try {
      const { data } = await this.$axios.put(`api/events/${getters.getCurrentEvent.id}`, payload, {
        headers: {
          Authorization: `Bearer ${rootGetters['authorization/getAccessToken']}`
        }
      })
      if (data.status === 'success') {
        if (getters.getEventArrayBufferImage) {
          await dispatch('uploadCurrentEventPicture', getters.getCurrentEvent.id)
        }
        await commit('dictionaries/SAVE_STATUS', 'event-successfully-updated', { root: true })
        await dispatch('fetchEvents', {
          page: rootGetters['dictionaries/getPagination'].current_page,
          perPage: rootGetters['dictionaries/getPagination'].per_page
        })
      } else {
        await commit('dictionaries/SAVE_STATUS', 'event-not-updated', { root: true })
        if (data.httpCode === 401) {
          await commit('dictionaries/SAVE_STATUS', 'unauthorized', { root: true })
        }
      }
    } catch (e) {
      console.log('error', e)
    }
  },
  async uploadCurrentEventPicture ({ commit, getters, rootGetters }, eventId) {
    await commit('dictionaries/SAVE_STATUS', 'fetch', { root: true })
    try {
      await this.$axios.put(`api/events/upload-pic/${eventId || getters.getCurrentEvent.id}`,
        getters.getEventArrayBufferImage, {
          headers: {
            'Content-Type': 'image/png',
            Authorization: `Bearer ${rootGetters['authorization/getAccessToken']}`
          }
        })
    } catch (e) {
      await commit('dictionaries/SAVE_STATUS', 'event-picture-not-uploaded', { root: true })
    }
  },
  async archiveCurrentEvent ({ commit, dispatch, rootGetters }, payload) {
    try {
      const { data } = await this.$axios.patch(`api/events/archive/${payload.id}`, null, {
        headers: {
          Authorization: `Bearer ${rootGetters['authorization/getAccessToken']}`
        }
      })
      if (data.status === 'success') {
        await commit('dictionaries/SAVE_STATUS', 'event-successfully-archived', { root: true })
        await commit('SAVE_CURRENT_EVENT', data.data)
        await dispatch('fetchEvents', {
          page: rootGetters['dictionaries/getPagination'].current_page,
          perPage: rootGetters['dictionaries/getPagination'].per_page
        })
      } else {
        await commit('dictionaries/SAVE_STATUS', 'event-not-archived', { root: true })
        if (data.httpCode === 401) {
          await commit('dictionaries/SAVE_STATUS', 'unauthorized', { root: true })
        }
      }
    } catch (e) {
      await commit('dictionaries/SAVE_STATUS', 'event-not-archived', { root: true })
    }
  },
  async publishCurrentEvent ({ commit, dispatch, rootGetters }, payload) {
    try {
      const { data } = await this.$axios.put(`api/events/publish/${payload.id}`, null, {
        headers: {
          Authorization: `Bearer ${rootGetters['authorization/getAccessToken']}`
        }
      })
      if (data.status === 'success') {
        await commit('dictionaries/SAVE_STATUS', 'event-successfully-published', { root: true })
        await commit('SAVE_CURRENT_EVENT', data.data)
        await dispatch('fetchEvents', {
          page: rootGetters['dictionaries/getPagination'].current_page,
          perPage: rootGetters['dictionaries/getPagination'].per_page
        })
      } else {
        await commit('dictionaries/SAVE_STATUS', 'event-not-published', { root: true })
        if (data.httpCode === 401) {
          await commit('dictionaries/SAVE_STATUS', 'unauthorized', { root: true })
        }
      }
    } catch (e) {
      await commit('dictionaries/SAVE_STATUS', 'event-not-published', { root: true })
    }
  }
}
