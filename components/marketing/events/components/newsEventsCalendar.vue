<template>
  <div class="marketing-events-content-body-news_events">
    <div class="marketing-events-content-body-news_events-control">
      <div class="d-flex align-items-center">
        <div class="marketing-events-content-body-calendar-settings-dropdown">
          <b-dd
            :lazy="true"
            toggle-class="marketing-events-content-body-calendar-settings-dropdown-container"
            variant="link"
            no-caret
            boundary="viewport"
          >
            <template #button-content>
              <div class="marketing-events-content-body-calendar-settings-dropdown-container-button">
                <span v-text="eventCalendar.activeMonth.title" />
                <smq-icon-chevron-down />
              </div>
            </template>
            <div class="marketing-events-content-body-calendar-settings-dropdown-container-items">
              <b-dd-item-btn
                v-for="(month, key) in months"
                :key="key"
                button-class="marketing-events-content-body-calendar-settings-dropdown-container-items-item"
                @click="setActiveMonth(month)"
              >
                <div class="marketing-events-content-body-calendar-settings-dropdown-container-items-item-container">
                  {{ month && month.title ? month.title : moment().format('MMMM') }}
                </div>
              </b-dd-item-btn>
            </div>
          </b-dd>
        </div>
        <div class="marketing-events-content-body-calendar-settings-dropdown">
          <b-dd
            :lazy="true"
            toggle-class="marketing-events-content-body-calendar-settings-dropdown-container"
            variant="link"
            no-caret
            boundary="viewport"
          >
            <template #button-content>
              <div class="marketing-events-content-body-calendar-settings-dropdown-container-button">
                <span class="-gray-500" v-text="eventCalendar.activeYear.title" />
                <smq-icon-chevron-down />
              </div>
            </template>
            <div class="marketing-events-content-body-calendar-settings-dropdown-container-items">
              <b-dd-item-btn
                v-for="(year, key) in years"
                :key="key"
                button-class="marketing-events-content-body-calendar-settings-dropdown-container-items-item"
                @click="setActiveYear(year)"
              >
                <div class="marketing-events-content-body-calendar-settings-dropdown-container-items-item-container">
                  {{ year && year.title ? year.title : moment().format('YYYY') }}
                </div>
              </b-dd-item-btn>
            </div>
          </b-dd>
        </div>
      </div>
      <div class="marketing-events-content-body-news_events-control-statuses">
        <span
          class="marketing-events-content-body-news_events-control-statuses-status -approved"
          v-text="'Approved'"
        />
        <span
          class="marketing-events-content-body-news_events-control-statuses-status -waiting"
          v-text="'Waiting'"
        />
        <span
          class="marketing-events-content-body-news_events-control-statuses-status -rejected"
          v-text="'Rejected'"
        />
      </div>
    </div>
    <b-calendar
      ref="event-calendar"
      v-model="eventCalendar.calendar"
      class="custom_calendar"
      locale="en"
      @context="showCalendarDescription"
    />
    <b-sidebar
      id="news-events-event"
      ref="currentNewsEvent"
      v-model="isCurrentNewsEventOpened"
      right
      no-header
      backdrop
      @hidden="currentNewsEventHidden"
    >
      <template #default="{ hide }">
        <current-news-event @close-sidebar="closeCurrentNewsEvent(hide)" />
      </template>
    </b-sidebar>
  </div>
</template>

<script>
import moment from 'moment'
import CurrentNewsEvent from './curerntNewsEvent'
import SmqIconChevronDown from '~/components/marketing/icons/smq-icon-chevron-down'
export default {
  name: 'NewsEventsCalendar',
  components: { CurrentNewsEvent, SmqIconChevronDown },
  data () {
    return {
      moment,
      selectedStore: { title: null, flag: null },
      selectedStatus: { title: null, flag: null },
      isEventDetailsShown: false,
      calendarContext: {
        activeYMD: null
      },
      eventSearch: null,
      show: false,
      targetEvent: 83
    }
  },
  computed: {
    eventCalendar () {
      return this.$store.getters['events/getEventCalendar']
    },
    currentEvent () {
      return this.$store.getters['events/getCurrentEvent']
    },
    events () {
      return this.$store.getters['events/getEvents']
    },
    eventsList () {
      return this.$store.getters['events/getEventsList']
    },
    years () {
      return this.$store.getters['dictionaries/getYears']
    },
    months () {
      return this.$store.getters['dictionaries/getMonths']
    },
    status () {
      return this.$store.getters['dictionaries/getStatus']
    },
    statuses () {
      return this.$store.getters['dictionaries/getStatuses']
    },
    tenants () {
      return this.$store.getters['tenants/getTenantsList'].map((tenant) => {
        return {
          title: tenant.title,
          flag: String(tenant.id)
        }
      })
    },
    eventStatuses () {
      return this.$store.getters['dictionaries/getEventStatuses']
    },
    routeQuery () {
      return JSON.parse(JSON.stringify(this.$route.query))
    },
    localeStorageUrl () {
      return localStorage.getItem('routeUrl') ? JSON.parse(localStorage.getItem('routeUrl')) : {}
    },
    isRouteQuery () {
      return Object.keys(this.routeQuery).length
    },
    isCurrentNewsEventOpened: {
      get () {
        return this.$store.getters['newsEvents/getCurrentNewsEventOpened']
      },
      set (newValue) {
        this.$store.commit('newsEvents/TOGGLE_CURRENT_NEWS_EVENT', newValue)
      }
    }
  },
  watch: {
    events: {
      handler () {
        setTimeout(() => this.setActiveDays(), 25)
      },
      deep: true
    },
    activeMonth: {
      handler () {
        setTimeout(() => this.setActiveDays(), 25)
      },
      deep: true
    },
    activeYear: {
      handler () {
        setTimeout(() => this.setActiveDays(), 25)
      },
      deep: true
    },
    calendarContext: {
      handler (newValue, oldValue) {
        if (newValue.activeYMD !== oldValue.activeYMD) {
          this.setCalendarData(newValue.activeYMD)
        }
      },
      deep: true
    },
    tenants: {
      handler (newValue) {
        if (newValue && newValue.length) {
          this.setFilters()
        }
      },
      deep: true
    },
    status (newValue) {
      switch (newValue) {
        case 'event-successfully-deleted':
          this.isEventDetailsShown = false
          // Array.from(document.querySelectorAll('[data-date]')).forEach((day) => {
          //   if (day.dataset.date === this.moment(this.currentEvent.start).format('YYYY-MM-DD')) {
          //     day.classList.remove('news-event-date')
          //   }
          // })
          break
      }
    }
  },
  created () {
    this.$store.dispatch('dictionaries/updateSortPaginationFilter', this.isRouteQuery ? this.routeQuery : this.localeStorageUrl)
    this.$store.commit('dictionaries/UPDATE_START_FIELDS_FILTER', {
      start_from: this.moment().format('YYYY-MM-DD'),
      start_to: this.moment().add(1, 'days').format('YYYY-MM-DD')
    })
    this.$store.commit('dictionaries/UPDATE_SOURCE', 'events')
    this.$store.dispatch('events/fetchEventsList')
  },
  mounted () {
    this.setActiveDays()
    this.setFilters()
  },
  destroyed () {
    localStorage.removeItem('routeUrl')
    this.$store.commit('events/CLEAR_EVENT_CALENDAR')
  },
  methods: {
    setFilters () {
      if (this.routeQuery && this.routeQuery.company_id) {
        this.selectedStore = this.tenants.find(tenant => tenant.flag === this.routeQuery.company_id)
      } else if (this.localeStorageUrl && this.localeStorageUrl.company_id) {
        this.selectedStore = this.tenants.find(tenant => tenant.flag === this.localeStorageUrl.company_id)
      }
      if (this.routeQuery && this.routeQuery.status) {
        this.selectedStatus = this.eventStatuses.find(status => status.flag === this.routeQuery.status)
      } else if (this.localeStorageUrl && this.localeStorageUrl.status) {
        this.selectedStatus = this.eventStatuses.find(status => status.flag === this.localeStorageUrl.status)
      }
      if (this.routeQuery && this.routeQuery.title) {
        this.eventSearch = this.routeQuery.title
      } else if (this.localeStorageUrl && this.localeStorageUrl.title) {
        this.eventSearch = this.localeStorageUrl.title
      }
    },
    eventFilterChanged (value, field) {
      if (field === 'company_id') {
        this.selectedStore = value
      } else if (field === 'status') {
        this.selectedStatus = value
      }
      this.$store.commit('dictionaries/UPDATE_FILTER', { field, value: value.flag })
    },
    resetFilter () {
      this.eventSearch = null
      this.selectedStore = { title: null, flag: null }
      this.selectedStatus = { title: null, flag: null }
      this.$store.dispatch('dictionaries/resetEventFilter', {
        date_from: this.moment(this.calendarContext.activeYMD).format('YYYY-MM-DD'),
        date_to: this.moment(this.calendarContext.activeYMD).add(1, 'days').format('YYYY-MM-DD')
      })
    },
    async eventSearching (value) {
      this.eventSearch = value
      if (value.split('').length > 2) {
        this.$store.commit('dictionaries/UPDATE_SEARCH_MODE', true)
        await this.$store.commit('dictionaries/UPDATE_FILTER', { field: 'title', value: this.eventSearch })
      } else if (value === '') {
        this.$store.commit('dictionaries/UPDATE_SEARCH_MODE', false)
        await this.$store.commit('dictionaries/UPDATE_FILTER', { field: 'title', value: null })
        await this.$store.dispatch('events/fetchEvents')
      }
    },
    openEditEvent () {
      this.$router.push(`/marketing/events/${this.currentEvent.id}`)
    },
    setActiveDays () {
      if (this.eventsList && this.eventsList.length) {
        Array.from(document.querySelectorAll('[data-date]')).forEach((day) => {
          const dayContainer = document.createElement('div')
          dayContainer.classList.add('d-flex')
          dayContainer.classList.add('flex-column')
          dayContainer.classList.add('w-100')
          day.classList.add('d-flex')
          day.classList.add('flex-column')
          day.innerText = ''
          const container = document.createElement('div')
          container.classList.add('d-flex')
          container.classList.add('align-items-center')
          container.classList.add('justify-content-between')
          container.classList.add('w-100')
          container.classList.add('px-2')
          const dayNumber = document.createElement('span')
          dayNumber.innerText = `${this.moment(day.dataset.date).format('D')}`
          const dayName = document.createElement('span')
          dayName.innerText = `${this.moment(day.dataset.date).format('dddd')}`
          if (this.moment(day.dataset.date).format('MM') === this.moment(this.calendarContext.activeYMD).format('MM')) {
            dayNumber.classList.add('marketing-events-content-body-news_events-actual_month-day')
            dayName.classList.add('marketing-events-content-body-news_events-actual_month-month')
          } else {
            dayNumber.classList.add('marketing-events-content-body-news_events-previous_month')
            dayName.classList.add('marketing-events-content-body-news_events-previous_month')
          }
          container.appendChild(dayNumber)
          container.appendChild(dayName)
          dayContainer.appendChild(container)
          this.eventsList.forEach((event) => {
            const store = this.$store
            if (day.dataset.date === this.moment(event.start).format('YYYY-MM-DD')) {
              const startEvent = document.createElement('span')
              startEvent.classList.add('news-event-date-start')
              startEvent.innerText = `${event.title}`
              startEvent.setAttribute('id', `event-${event.id}`)
              startEvent.onclick = function () {
                this.targetEvent = event.id
                store.commit('newsEvents/TOGGLE_CURRENT_NEWS_EVENT', true)
                store.commit('newsEvents/SAVE_CURRENT_NEWS_EVENT', {
                  id: 0,
                  type: 'news',
                  status: 'approved',
                  title: 'Vinařství u Kapličky opět otevřeno!',
                  published: '04.09.2021',
                  description: 'Vážení návštevníci, prodejna Vinařství u Kapličky má po rekonstrukci konečne opět otevřeno. Navíc během záři zde probíha ochutnávka skvělého burčáku, tak se zastavte! :)',
                  company: 'Novo Plaza'
                })
              }
              dayContainer.appendChild(startEvent)
            }
            if ((this.moment(day.dataset.date).isAfter(this.moment(event.start).format('YYYY-MM-DD')) && (this.moment(day.dataset.date).isBefore(this.moment(event.finish).format('YYYY-MM-DD'))))) {
              const rangeEvent = document.createElement('span')
              rangeEvent.classList.add('news-event-date-range')
              rangeEvent.setAttribute('id', `event-range-con-${event.id}`)
              rangeEvent.onclick = function () {
                this.targetEvent = event.id
                store.commit('newsEvents/TOGGLE_CURRENT_NEWS_EVENT', true)
                store.commit('newsEvents/SAVE_CURRENT_NEWS_EVENT', {
                  id: 1,
                  type: 'news',
                  status: 'waiting',
                  title: 'Vinařství u Kapličky opět otevřeno!',
                  published: '04.09.2021',
                  description: 'Vážení návštevníci, prodejna Vinařství u Kapličky má po rekonstrukci konečne opět otevřeno. Navíc během záři zde probíha ochutnávka skvělého burčáku, tak se zastavte! :)',
                  company: 'Novo Plaza'
                })
              }
              dayContainer.appendChild(rangeEvent)
            }
            if (day.dataset.date === this.moment(event.finish).format('YYYY-MM-DD')) {
              const rangeEvent = document.createElement('span')
              rangeEvent.classList.add('news-event-date-range')
              rangeEvent.setAttribute('id', `event-range-${event.id}`)
              rangeEvent.onclick = function () {
                this.targetEvent = event.id
                store.commit('newsEvents/TOGGLE_CURRENT_NEWS_EVENT', true)
                store.commit('newsEvents/SAVE_CURRENT_NEWS_EVENT', {
                  id: 2,
                  type: 'news',
                  status: 'rejected',
                  title: 'Vinařství u Kapličky opět otevřeno!',
                  published: '04.09.2021',
                  description: 'Vážení návštevníci, prodejna Vinařství u Kapličky má po rekonstrukci konečne opět otevřeno. Navíc během záři zde probíha ochutnávka skvělého burčáku, tak se zastavte! :)',
                  company: 'Novo Plaza'
                })
              }
              dayContainer.appendChild(rangeEvent)
            }
          })
          day.appendChild(dayContainer)
        })
      }
    },
    openCurrentEvent (currentEvent) {
      this.isEventDetailsShown = true
    },
    showCalendarDescription (calendarContext) {
      this.calendarContext = calendarContext
    },
    setCalendarData (activeYMD) {
      this.$store.commit('dictionaries/UPDATE_START_FIELDS_FILTER', {
        start_from: activeYMD,
        start_to: this.moment(activeYMD).add(1, 'days').format('YYYY-MM-DD')
      })
      this.$store.commit('events/UPDATE_EVENT_CALENDAR', {
        calendar: activeYMD,
        activeMonth: {
          title: this.moment(activeYMD).endOf('month').format('MMMM'),
          flag: this.moment(activeYMD).endOf('month').format('MMMM').toLowerCase()
        },
        activeYear: {
          title: this.moment(activeYMD).endOf('month').format('YYYY'),
          flag: this.moment(activeYMD).endOf('month').format('YYYY')
        },
        previousMonth: this.moment(activeYMD).subtract(1, 'months').endOf('month').format('MMMM'),
        nextMonth: this.moment(activeYMD).subtract(-1, 'months').endOf('month').format('MMMM')
      })
    },
    setActiveMonth (month) {
      this.$store.commit('events/UPDATE_EVENT_CALENDAR', {
        activeMonth: month,
        calendar: this.moment(`${this.moment(this.calendar).format('YYYY')}-${month.number}-${this.moment(this.calendar).format('DD')}`).format('YYYY-MM-DD')
      })
    },
    setActiveYear (year) {
      this.$store.commit('events/UPDATE_EVENT_CALENDAR', {
        activeYear: year,
        calendar: this.moment(`${year.flag}-${this.moment(this.calendar).format('MM-DD')}`).format('YYYY-MM-DD')
      })
    },
    getCurrentStatusClass (statusFlag) {
      const result = this.statuses.find(status => status.flag === statusFlag)
      if (result && result.name) {
        return this.statuses.find(status => status.flag === statusFlag).name
      } else {
        return null
      }
    },
    getCurrentStatus (statusFlag) {
      const result = this.statuses.find(status => status.flag === statusFlag)
      if (result && result.title) {
        return this.statuses.find(status => status.flag === statusFlag).title
      } else {
        return null
      }
    },
    async resetCurrentFilter (field) {
      if (field === 'company_id') {
        this.selectedStore = { title: null, flag: null }
      } else if (field === 'status') {
        this.selectedStatus = { title: null, flag: null }
      }
      await this.$store.commit('dictionaries/UPDATE_FILTER', { field, value: null })
      await this.$store.dispatch('dictionaries/sendPageData')
    },
    closeCurrentNewsEvent (hide) {
      this.isCurrentNewsEventOpened = false
      hide()
    },
    currentNewsEventHidden () {
      this.isCurrentNewsEventOpened = false
    }
  }
}
</script>
