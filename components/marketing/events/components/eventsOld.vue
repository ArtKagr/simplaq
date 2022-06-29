<template>
  <div class="px-4">
    <div class="loyalty-receipts-head-search mb-4">
      <div class="d-flex align-items-center">
        <div
          v-if="selectedStore.title"
          class="filter_chips-chip"
        >
          <span v-text="selectedStore.title" />
          <smq-icon-close @click.native="resetCurrentFilter('company_id')" />
        </div>
        <smq-form-dropdown
          v-else-if="tenants && tenants.length"
          class="loyalty-receipts-head-dropdown"
          :items="tenants"
          :width="160"
          placeholder="Store"
          dropdown-type="filter"
          @selected-item="eventFilterChanged($event, 'company_id')"
        />
        <b-skeleton v-else type="input" width="160px" class="mr-2" />
        <div
          v-if="selectedStatus.title"
          class="filter_chips-chip"
        >
          <span v-text="selectedStatus.title" />
          <smq-icon-close @click.native="resetCurrentFilter('status')" />
        </div>
        <smq-form-dropdown
          v-else-if="tenants && tenants.length"
          class="loyalty-receipts-head-dropdown"
          :items="eventStatuses"
          :width="160"
          placeholder="Status"
          dropdown-type="filter"
          @selected-item="eventFilterChanged($event, 'status')"
        />
        <b-skeleton v-else type="input" width="160px" class="mr-2" />
        <div
          v-if="tenants && tenants.length"
          class="loyalty-receipts-head-reset"
          @click="resetFilter"
        >
          <smq-icon-restart class="loyalty-receipts-head-reset-icon" />
          <span class="loyalty-receipts-head-reset-text">Reset filter</span>
        </div>
        <b-skeleton v-else type="text" width="90px" class="ml-4" />
      </div>
      <smq-form-input
        v-if="tenants && tenants.length"
        v-model="eventSearch"
        class="m-0"
        placeholder="Search..."
        dropdown-type="filter"
        prepend="search"
        @changed-value="eventSearching"
      />
      <b-skeleton v-else type="input" width="215px" />
    </div>
    <div class="marketing-events-content-body">
      <div class="marketing-events-content-body-calendar">
        <div class="marketing-events-content-body-calendar-settings">
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
                  <smq-icon-events-event-chevron-down-fill />
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
                  <span v-text="eventCalendar.activeYear.title" />
                  <smq-icon-events-event-chevron-down-fill />
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
        <div class="marketing-events-content-body-calendar-months">
          <span v-text="eventCalendar.previousMonth" />
          <span v-text="eventCalendar.nextMonth" />
        </div>
        <b-calendar
          ref="event-calendar"
          v-model="eventCalendar.calendar"
          class="custom_calendar"
          locale="en"
          @context="showCalendarDescription"
        />
      </div>
      <div class="marketing-events-content-body-events_list">
        <nuxt-link
          v-for="event in events"
          :key="event.id"
          class="marketing-events-content-body-events_list-event"
          :to="`/marketing/events/${event.id}`"
          @click.native="openCurrentEvent(event)"
        >
          <div class="marketing-events-content-body-events_list-event-logo">
            <img
              v-if="event.picture_link"
              class="marketing-events-content-body-events_list-event-logo-image"
              :src="event.picture_link"
              alt="event-logo"
            >
            <smq-icon-events-event-logo v-else />
          </div>
          <div class="marketing-events-content-body-events_list-event-body">
            <span
              class="marketing-events-content-body-events_list-event-body-title"
              v-text="event.title"
            />
            <div class="marketing-events-content-body-events_list-event-body-date_time">
              <div class="marketing-events-content-body-events_list-event-body-date_time-icon">
                <smq-icon-clock-time-four-outline />
              </div>
              <span class="marketing-events-content-body-events_list-event-body-date_time-value">
                <span v-text="moment(event.start).format('dddd')" />
                <span v-text="`${moment(event.start).format('DD.MM.')}${event.finish ? '' : ','}`" />
                <span v-if="event.finish" v-text="`- ${moment(event.finish).format('DD.MM.')},`" />
                <span v-text="moment(event.start).format('HH:mm')" />
                <span v-if="event.finish" v-text="`- ${moment(event.finish).format('HH:mm')}`" />
              </span>
            </div>
            <div>
              <span
                :class="`smq-table-status -${getCurrentStatusClass(event.status)}`"
                v-text="getCurrentStatus(event.status)"
              />
            </div>
          </div>
          <div class="marketing-events-content-body-events_list-event-dots">
            <smq-icon-events-three-dots />
          </div>
        </nuxt-link>
      </div>
    </div>
    <b-modal v-model="isEventDetailsShown" hide-header hide-footer centered hide-backdrop>
      <template #default="{ close }">
        <marketing-events-current-event :close="close" @edit-event="openEditEvent" />
      </template>
    </b-modal>
  </div>
</template>

<script>
import moment from 'moment'
import SmqIconEventsEventLogo from '~/components/marketing/events/icons/smq-icon-events-event_logo'
import SmqIconEventsThreeDots from '~/components/marketing/events/icons/smq-icon-events-three_dots'
import SmqIconClockTimeFourOutline from '~/components/marketing/icons/smq-icon-clock-time-four-outline'
import SmqIconEventsEventChevronDownFill
  from '~/components/marketing/events/icons/smq-icon-events-event-chevron-down-fill'
import SmqFormDropdown from '~/components/forms/smq-form-dropdown'
import SmqFormInput from '~/components/forms/smq-form-input'
import SmqIconRestart from '~/components/icons/smq-icon-restart'
import SmqIconClose from '~/components/icons/smq-icon-close'
import MarketingEventsCurrentEvent from '~/components/marketing/events/marketingEventsCurrentEvent'
export default {
  name: 'EventsOld',
  components: {
    SmqIconClose,
    SmqIconRestart,
    SmqFormInput,
    SmqFormDropdown,
    SmqIconEventsEventChevronDownFill,
    SmqIconEventsEventLogo,
    SmqIconEventsThreeDots,
    SmqIconClockTimeFourOutline,
    MarketingEventsCurrentEvent
  },
  data () {
    return {
      moment,
      selectedStore: { title: null, flag: null },
      selectedStatus: { title: null, flag: null },
      isEventDetailsShown: false,
      calendarContext: {
        activeYMD: null
      },
      eventSearch: null
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
          Array.from(document.querySelectorAll('[data-date]')).forEach((day) => {
            if (day.dataset.date === this.moment(this.currentEvent.start).format('YYYY-MM-DD')) {
              day.classList.remove('event-date')
            }
          })
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
          this.eventsList.forEach((event) => {
            if (day.dataset.date === this.moment(event.start).format('YYYY-MM-DD')) {
              day.classList.add('event-date')
            }
          })
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
    }
  }
}
</script>
