<template>
  <div class="d-flex flex-column bg-white border-top-300">
    <div class="d-flex align-items-center pt-3 pl-4">
      <div class="mr-4">
        <smq-icon-event-chevron-left class="mr-4" />
        <smq-icon-event-chevron-right />
      </div>
      <div class="marketing-events-content-body-calendar-settings-dropdown-container-button mr-4">
        <span class="-bold" v-text="'September'" />
        <smq-icon-chevron-down />
      </div>
      <div class="marketing-events-content-body-calendar-settings-dropdown-container-button">
        <span class="-gray-500 -bold" v-text="'2021'" />
        <smq-icon-chevron-down class="-gray-500" />
      </div>
    </div>
    <div class="marketing-news-content-menu bg-white pt-4 px-4">
      <div
        v-for="item in menu"
        :key="item.flag"
        :class="item.flag === activeMenuItem ? '-active' : ''"
        class="marketing-news-content-menu-item"
        @click="setCurrentItem(item.flag)"
      >
        <span
          class="marketing-news-content-menu-item-title"
          :class="item.flag === activeMenuItem ? '-active' : ''"
          v-text="item.title"
        />
      </div>
    </div>
    <div class="marketing-events-list">
      <div
        v-for="item in newsEvents"
        :key="item.id"
        class="marketing-events-list-item px-4"
        :class="(item.id === currentNewsEvent.id) && isCurrentNewsEventOpened ? '-active' : ''"
        @click="openCurrentNewsEvent(item)"
        v-b-toggle.news-events
      >
        <div class="marketing-events-list-item-head">
          <span class="marketing-events-list-item-head-type" v-text="item.type" />
          <span
            class="marketing-events-list-item-head-status"
            :class="`-${item.status}`"
            v-text="item.status"
          />
        </div>
        <span class="marketing-events-list-item-title" v-text="item.title" />
        <div class="marketing-events-list-item-description">
          <smq-icon-calendar class="marketing-events-list-item-description-icon" />
          <span class="marketing-events-list-item-description-date" v-text="item.published"/>
          <smq-icon-dot class="marketing-events-list-item-description-dot" />
          <span class="marketing-events-list-item-description-company" v-text="`Publish as ${item.company}`" />
        </div>
      </div>
    </div>
    <b-sidebar
      id="news-events"
      ref="news-events"
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
import SmqIconEventChevronLeft from '../../icons/smq-icon-event-chevron-left'
import SmqIconEventChevronRight from '../../icons/smq-icon-event-chevron-right'
import CurrentNewsEvent from './curerntNewsEvent'
import SmqIconCalendar from '~/components/icons/smq-icon-calendar'
import SmqIconDot from '~/components/icons/smq-icon-dot'
import SmqIconChevronDown from '~/components/icons/smq-icon-chevron-down'
export default {
  name: 'newsEventsList',
  components: {
    SmqIconChevronDown,
    SmqIconEventChevronRight,
    SmqIconEventChevronLeft,
    CurrentNewsEvent,
    SmqIconDot,
    SmqIconCalendar
  },
  data () {
    return {
      moment,
      isCurrentNewsEventOpened: false
    }
  },
  computed: {
    menu () {
      return this.$store.getters['newsEvents/getNewsEventsMenu']
    },
    activeMenuItem () {
      return this.$store.getters['newsEvents/getActiveMenuItem']
    },
    newsEvents () {
      return this.$store.getters['newsEvents/getNewsEvents']
    },
    currentNewsEvent () {
      return this.$store.getters['newsEvents/getCurrentNewsEvent']
    },
    eventCalendar () {
      return this.$store.getters['events/getEventCalendar']
    },
    years () {
      return this.$store.getters['dictionaries/getYears']
    },
    months () {
      return this.$store.getters['dictionaries/getMonths']
    }
  },
  methods: {
    setActiveMonth (month) {
      this.$store.commit('events/UPDATE_EVENT_CALENDAR', {
        activeMonth: month,
        calendar: this.moment(`${this.moment(this.calendar).format('YYYY')}-${month.number}-${this.moment(this.calendar).format('DD')}`).format('YYYY-MM-DD')
      })
    },
    setCurrentItem (flag) {
      this.$store.commit('newsEvents/SAVE_ACTIVE_MENU_ITEM', flag)
    },
    openCurrentNewsEvent (newsEvent) {
      this.isCurrentNewsEventOpened = true
      this.$store.commit('newsEvents/SAVE_CURRENT_NEWS_EVENT', newsEvent)
    },
    currentNewsEventHidden () {
      this.isCurrentNewsEventOpened = false
    },
    closeCurrentNewsEvent (hide) {
      this.isCurrentNewsEventOpened = false
      hide()
    },
    setActiveYear (year) {
      this.$store.commit('events/UPDATE_EVENT_CALENDAR', {
        activeYear: year,
        calendar: this.moment(`${year.flag}-${this.moment(this.calendar).format('MM-DD')}`).format('YYYY-MM-DD')
      })
    }
  }
}
</script>
