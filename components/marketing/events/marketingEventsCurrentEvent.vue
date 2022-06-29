<template>
  <div class="marketing-events-current_event">
    <div class="marketing-events-current_event-image">
      <img v-if="currentEvent.picture_link" :src="currentEvent.picture_link" alt="event-picture" />
      <smq-icon-events-event-image v-else />
    </div>
    <div class="marketing-events-current_event-description">
      <span class="marketing-events-current_event-description-date_time">
        <span v-text="'Friday' + ','" />
        <span v-text="`${moment(currentEvent.start_date).format('DD.MM.')}${currentEvent.end_date ? '' : ','}`" />
        <span v-if="currentEvent.end_date" v-text="`- ${moment(currentEvent.end_date).format('DD.MM.')},`" />
        <span v-text="currentEvent.start_time" />
        <span v-if="currentEvent.end_time" v-text="`- ${currentEvent.end_time}`" />
      </span>
      <span
        class="marketing-events-current_event-description-title"
        v-text="currentEvent.title"
      />
      <span
        class="marketing-events-current_event-description-article"
        v-text="currentEvent.description"
      />
    </div>
    <div class="marketing-events-current_event-settings">
      <div class="marketing-events-current_event-settings-social">
<!--        <send-types />-->
      </div>
      <div class="marketing-events-current_event-settings-buttons">
        <div
          class="marketing-events-current_event-settings-buttons-button"
          :class="currentEvent && currentEvent.status === 0 ? '-archived' : ''"
          @click="editEvent"
        >
          <smq-icon-events-event-pencil />
        </div>
        <div class="marketing-events-current_event-settings-buttons-button" @click="archiveCurrentEvent">
          <smq-icon-events-event-delete v-if="currentEvent && currentEvent.status !== 0" />
        </div>
      </div>
    </div>
    <div
      class="marketing-events-current_event-close"
      @click="close()"
    >
      <smq-icon-events-event-close />
    </div>
    <div class="marketing-events-current_event-status">
      <span
        :class="`smq-table-status -${getCurrentStatusClass(currentEvent.status)}`"
        v-text="getCurrentStatus(currentEvent.status)"
      />
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import SmqIconEventsEventClose from '~/components/marketing/events/icons/smq-icon-events-event_close'
import SmqIconEventsEventImage from '~/components/marketing/events/icons/smq-icon-events-event_image'
// import SendTypes from '~/components/marketing/news/marketingNewsSendTypes'
import SmqIconEventsEventPencil from '~/components/marketing/events/icons/smq-icon-events-event_pencil'
import SmqIconEventsEventDelete from '~/components/marketing/events/icons/smq-icon-events-event_delete'
export default {
  name: 'MarketingEventsCurrentEvent',
  components: {
    SmqIconEventsEventDelete,
    SmqIconEventsEventPencil,
    SmqIconEventsEventImage,
    SmqIconEventsEventClose
    // SendTypes
  },
  props: {
    close: {
      type: Function
    }
  },
  data () {
    return {
      moment
    }
  },
  computed: {
    currentEvent () {
      return this.$store.getters['events/getCurrentEvent']
    },
    statuses () {
      return this.$store.getters['dictionaries/getStatuses']
    }
  },
  methods: {
    editEvent () {
      this.$emit('edit-event')
    },
    removeEvent () {
      this.$store.dispatch('events/removeEvent')
    },
    async archiveCurrentEvent () {
      await this.$store.dispatch('events/archiveCurrentEvent', { id: this.currentEvent.id, source: 'modal' })
      await this.close()
    },
    getCurrentStatusClass (statusFlag) {
      return this.statuses.find(status => status.flag === statusFlag).name
    },
    getCurrentStatus (statusFlag) {
      return this.statuses.find(status => status.flag === statusFlag).title
    }
  }
}
</script>
