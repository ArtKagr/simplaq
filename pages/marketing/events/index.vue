<template>
  <div class="marketing-events p-0">
    <div class="marketing-events-content">
      <div class="marketing-events-content-head p-4">
        <span
          class="marketing-events-content-head-title"
          v-text="activePageType === 'events' ? 'Events' : 'News and Events'"
        />
        <div class="marketing-events-content-head-button_group">
          <div
            class="marketing-events-content-head-button_group-button"
            :class="activePageType === 'calendar' ? '-active' : ''"
            @click="setActivePageType('calendar')"
          >
            <smq-icon-calendar-primary />
            <span v-text="'Calendar'" />
          </div>
          <div
            class="marketing-events-content-head-button_group-button"
            :class="activePageType === 'list' ? '-active' : ''"
            @click="setActivePageType('list')"
          >
            <smq-icon-view-list />
            <span v-text="'List'" />
          </div>
          <div
            class="marketing-events-content-head-button_group-button"
            :class="activePageType === 'events' ? '-active' : ''"
            @click="setActivePageType('events')"
          >
            <smq-icon-calendar-primary />
            <span v-text="'Events'" />
          </div>
        </div>
        <b-dd
          v-if="activePageType !== 'events'"
          :lazy="true"
          toggle-class="header-menu"
          variant="link"
          no-caret
          dropleft
          boundary="viewport"
        >
          <template #button-content>
            <b-button
              class="marketing-events-content-head-button"
              variant="primary"
            >
              <div class="d-flex align-items-center">
                <span class="marketing-events-content-head-button-text mr-2">New</span>
                <smq-icon-chevron-down-white class="mt-05" />
              </div>
            </b-button>
          </template>
          <div class="header-menu-items">
            <b-dd-item-btn
              v-for="item in items"
              :key="item.flag"
              button-class="header-menu-items-item"
              @click="selectItem(item)"
            >
              <span class="header-menu-items-item-title" v-text="item.title" />
            </b-dd-item-btn>
          </div>
        </b-dd>
        <b-button
          v-else
          class="marketing-events-content-head-button"
          variant="primary"
          @click="createNewEvent"
        >
          <div class="marketing-events-content-head-button-icon">
            <smq-icon-plus />
          </div>
          <span class="marketing-events-content-head-button-text">New event</span>
        </b-button>

      </div>
      <events-old v-if="activePageType === 'events'" />
      <news-events-calendar v-else-if="activePageType === 'calendar'" />
      <news-events-list v-else-if="activePageType === 'list'" />
      <b-modal
        v-model="isPostCreateShown"
        hide-header
        hide-footer
        centered
        hide-backdrop
        no-close-on-backdrop
      >
        <template #default="{ close }">
          <marketing-news-events-event
            v-if="activeType === 'event'"
            :close="close"
            @close-modal="close()"
          />
          <marketing-news-events-post
            v-if="activeType === 'post'"
            :close="close"
            @close-modal="close()"
          />
        </template>
      </b-modal>
    </div>
  </div>
</template>

<script>
import SmqIconPlus from '~/components/icons/smq-icon-plus'
import SmqIconCalendarPrimary from '~/components/icons/smq-icon-calendar-primary'
import SmqIconViewList from '~/components/icons/smq-icon-view-list'
import EventsOld from '~/components/marketing/events/components/eventsOld'
import NewsEventsCalendar from '~/components/marketing/events/components/newsEventsCalendar'
import NewsEventsList from '~/components/marketing/events/components/newsEventsList'
import SmqIconChevronDownWhite from '~/components/marketing/icons/smq-icon-chevron-down-white'
import MarketingNewsEventsEvent from '~/components/marketing/events/marketingNewsEventsEvent'
import MarketingNewsEventsPost from '~/components/marketing/events/marketingNewsEventsPost'
export default {
  name: 'MarketingEvents',
  components: {
    MarketingNewsEventsPost,
    MarketingNewsEventsEvent,
    SmqIconChevronDownWhite,
    NewsEventsList,
    NewsEventsCalendar,
    EventsOld,
    SmqIconViewList,
    SmqIconCalendarPrimary,
    SmqIconPlus
  },
  data () {
    return {
      isPostCreateShown: false,
      activeType: null,
      items: [
        { title: 'Event', flag: 'event' },
        { title: 'Post', flag: 'post' }
      ]
    }
  },
  computed: {
    activePageType () {
      return this.$store.getters['newsEvents/getActivePageType']
    }
  },
  methods: {
    setActivePageType (flag) {
      this.$store.commit('newsEvents/SAVE_ACTIVE_PAGE_TYPE', flag)
    },
    createNewEvent () {
      this.$router.push('/marketing/events/new-event')
    },
    selectItem (item) {
      this.activeType = item.flag
      this.isPostCreateShown = true
    }
  }
}
</script>
