<template>
  <div class="marketing-events-new_event">
    <div class="marketing-events-new_event-head">
      <div class="marketing-events-new_event-head-title">
        <smq-icon-arrow-left
          class="marketing-events-new_event-head-title-icon"
          @click.native="openEventsPage"
        />
        <span
          class="marketing-events-new_event-head-title-text"
          v-text="source === 'view' ? 'New event' : currentEventCopy.title"
        />
        <div v-if="source === 'edit'" class="ml-4">
          <span
            :class="`smq-table-status -${getCurrentStatusClass(currentEventCopy.status)}`"
            v-text="getCurrentStatus(currentEventCopy.status)"
          />
        </div>
      </div>
      <div class="marketing-events-new_event-head-buttons">
        <b-button
          v-if="source === 'view'"
          variant="primary"
          class="marketing-events-new_event-buttons-button"
          @click="createEvent"
          v-text="'Save and Publish'"
        />
        <div v-else class="d-flex align-items-center">
          <b-button
            variant="primary"
            class="marketing-events-new_event-buttons-button mr-2"
            @click="updateEvent"
            v-text="'Update'"
          />
          <b-button
            v-if="currentEventCopy && currentEventCopy.status === 1"
            variant="danger"
            class="marketing-events-new_event-buttons-button"
            @click="archiveCurrentEvent"
            v-text="'Archive'"
          />
          <b-button
            v-else
            variant="success"
            class="marketing-events-new_event-buttons-button"
            v-text="'Publish'"
            @click="publishCurrentEvent"
          />
        </div>
      </div>
    </div>
    <div class="marketing-events-new_event-content">
      <div class="marketing-events-new_event-content-head">
        <div class="marketing-events-new_event-content-head-name">
          <div class="marketing-events-new_event-content-head-name-logo">
            <smq-icon-image-square v-if="source === 'view'" />
            <img :src="currentEventCopy.company.big_logo" alt="company-logo" v-else />
          </div>
          <span class="marketing-events-new_event-content-head-text" v-text="source === 'view' ? 'Novo Plaza' : currentEventCopy.company.store_name" />
        </div>
      </div>
      <div class="marketing-events-new_event-content-body">
        <smq-form-input
          label="Event title"
          v-model="currentEventCopy.title"
          class="mb-4"
          :error="eventError && !currentEventCopy.title"
          message="Required field"
          @changed-value="updateEventData($event, 'title')"
        />
        <div class="marketing-events-new_event-content-body-date_time">
          <smq-form-input
            v-model="startDate"
            label="Start Date"
            append="calendar"
            class="mr-3"
            disabled
            @changed-value="dateTimeChanged($event, 'start', 'date')"
          />
          <smq-form-input
            v-model="startTime"
            label="Start Time"
            append="time"
            disabled
            @changed-value="dateTimeChanged($event, 'start', 'time')"
          />
        </div>
        <div v-if="endDateTime" class="marketing-events-new_event-content-body-date_time">
          <smq-form-input
            v-model="endDate"
            label="End Date"
            append="calendar"
            :calendar-period="newEventPeriods.start"
            class="mr-3"
            disabled
            @changed-value="dateTimeChanged($event, 'finish', 'date')"
          />
          <smq-form-input
            v-model="endTime"
            label="End Time"
            append="time"
            disabled
            @changed-value="dateTimeChanged($event, 'finish', 'time')"
          />
        </div>
        <div
          class="marketing-events-new_event-content-body-add"
          @click="toggleEndDateTime"
        >
          <div class="marketing-events-new_event-content-body-add-icon">
            <smq-icon-events-event-remove v-if="endDateTime" />
            <smq-icon-events-event-add v-else />
          </div>
          <span
            class="marketing-events-new_event-content-body-add-text"
            v-text="`${endDateTime ? 'Remove' : 'Add'} End Date and Time`"
          />
          </div>
<!--        <div class="marketing-events-new_event-content-body-checkbox">-->
<!--          <div class="marketing-events-new_event-content-body-checkbox-icon">-->
<!--            <smq-icon-events-event-checkbox-fill v-if="reservationRequired" @click.native="toggleReservationRequired" />-->
<!--            <smq-icon-events-event-checkbox-blank v-else @click.native="toggleReservationRequired" />-->
<!--          </div>-->
<!--          <span-->
<!--            class="marketing-events-new_event-content-body-checkbox-text"-->
<!--            v-text="'Reservation required'"-->
<!--          />-->
<!--        </div>-->
        <smq-form-textarea
          v-model="currentEventCopy.description"
          label="Event description"
          class="marketing-events-new_event-content-body-description"
          :error="eventError && !currentEventCopy.description"
          message="Required field"
          @changed-value="setEventData($event, 'description')"
        />
        <drag-drop-image
          class="mt-4"
          :height="200"
          :image="eventBase64Image"
          :error="eventError && !eventBase64Image"
          message="Required field"
          @uploaded-file="saveUploadedImage"
        />
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import SmqIconArrowLeft from '~/components/icons/smq-icon-arrow-left'
import SmqIconImageSquare from '~/components/icons/smq-icon-image-square'
import SmqFormInput from '~/components/forms/smq-form-input'
import SmqIconEventsEventAdd from '~/components/marketing/events/icons/smq-icon-events-event_add'
import SmqIconEventsEventRemove from '~/components/marketing/events/icons/smq-icon-events-event_remove'
// import SendTypes from '~/components/marketing/news/marketingNewsSendTypes'
// import SmqIconEventsEventCheckboxBlank from '~/components/marketing/events/icons/smq-icon-events-event-checkbox-blank'
// import SmqIconEventsEventCheckboxFill from '~/components/marketing/events/icons/smq-icon-events-event-checkbox-fill'
import SmqFormTextarea from '~/components/forms/smq-form-textarea'
import DragDropImage from '~/components/dragDropImage'
export default {
  name: 'MarketingEventsEvent',
  components: {
    SmqFormTextarea,
    SmqFormInput,
    SmqIconArrowLeft,
    SmqIconImageSquare,
    SmqIconEventsEventAdd,
    SmqIconEventsEventRemove,
    DragDropImage
    // SendTypes,
    // SmqIconEventsEventCheckboxBlank,
    // SmqIconEventsEventCheckboxFill,
  },
  data () {
    return {
      moment,
      endDateTime: false,
      currentEventCopy: {
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
      eventError: false
      // reservationRequired: false,
    }
  },
  props: {
    source: {
      type: String,
      default: 'view'
    }
  },
  computed: {
    startDate () {
      return this.currentEventCopy.start
        ? this.moment(this.currentEventCopy.start).format('YYYY-MM-DD HH:mm:ss')
        : this.moment().format('YYYY-MM-DD 00:00:00')
    },
    startTime () {
      return this.currentEventCopy.start
        ? this.moment(this.currentEventCopy.start).format('YYYY-MM-DD HH:mm:ss')
        : this.moment().format('YYYY-MM-DD 00:00:00')
    },
    endDate () {
      return this.currentEventCopy.finish
        ? this.moment(this.currentEventCopy.finish).format('YYYY-MM-DD HH:mm:ss')
        : this.currentEventCopy.start
          ? this.moment(this.currentEventCopy.start).add(1, 'day').format('YYYY-MM-DD HH:mm:ss')
          : null
    },
    endTime () {
      return this.currentEventCopy.finish
        ? this.moment(this.currentEventCopy.finish).format('YYYY-MM-DD HH:mm:ss')
        : this.moment().format('YYYY-MM-DD 00:00:00')
    },
    status () {
      return this.$store.getters['dictionaries/getStatus']
    },
    newEventPeriods () {
      return this.$store.getters['events/getNewEventCalendarPeriod']
    },
    currentEvent () {
      return this.$store.getters['events/getCurrentEvent']
    },
    eventBase64Image () {
      return this.$store.getters['events/getEventBase64Image']
    },
    eventArrayBufferImage () {
      return this.$store.getters['events/getEventArrayBufferImage']
    },
    statuses () {
      return this.$store.getters['dictionaries/getStatuses']
    },
    routeUrl () {
      return this.$store.getters['dictionaries/getRouteUrl']
    }
  },
  watch: {
    status (newValue) {
      if (
        newValue === 'event-successfully-created' ||
        newValue === 'event-successfully-updated' ||
        newValue === 'event-successfully-published' ||
        newValue === 'event-successfully-archived'
      ) {
        this.$router.push('/marketing/events')
      }
    },
    currentEvent: {
      handler (newValue, oldValue) {
        if (newValue.status !== oldValue.status) {
          this.currentEventCopy.status = newValue.status
        }
      },
      deep: true
    }
  },
  async created () {
    localStorage.setItem('routeUrl', JSON.stringify(Object.fromEntries(Object.entries(this.routeUrl).filter(([_, v]) => v != null))))
    await this.$store.commit('dictionaries/CLEAR_PAGINATION_SORT_FILTER')
    if (this.source === 'edit') {
      await this.$store.dispatch('events/fetchCurrentEvent', this.$route.params.id)
    }
    this.currentEventCopy = { ...this.$store.getters['events/getCurrentEvent'] }
    if (this.currentEventCopy && this.currentEventCopy.picture_link) {
      this.$store.commit('events/SAVE_BASE_64_IMAGE', this.currentEvent.picture_link)
    }
    if (this.currentEventCopy.finish) {
      this.endDateTime = true
    }
  },
  destroyed () {
    this.$store.commit('events/CLEAR_CURRENT_EVENT')
  },
  methods: {
    async openEventsPage () {
      await this.$store.dispatch('events/fetchEvents')
      await this.$router.push('/marketing/events')
    },
    createEvent () {
      if (this.currentEventCopy.title && this.currentEventCopy.description && this.eventArrayBufferImage) {
        this.eventError = false
        this.$store.dispatch('events/createEvent', this.currentEventCopy)
      } else {
        this.eventError = true
      }
    },
    updateEvent () {
      if (this.currentEventCopy.title && this.currentEventCopy.description) {
        this.eventError = false
        this.$store.dispatch('events/updateEvent', this.currentEventCopy)
      } else {
        this.eventError = true
      }
    },
    toggleEndDateTime () {
      this.endDateTime = !this.endDateTime
      if (!this.endDateTime) {
        this.currentEventCopy.finish = null
      }
    },
    dateTimeChanged (value, field, flag) {
      if (flag === 'date' && field === 'start') {
        this.$store.commit('events/SAVE_NEW_EVENT_CALENDAR_PERIOD', {
          field,
          value: this.moment(value).add(23, 'hours').format('YYYY-MM-DD HH:mm:ss')
        })
        if (this.currentEventCopy.finish && this.moment(value) >= this.moment(this.currentEventCopy.finish)) {
          this.currentEventCopy.finish = this.moment(value).add(1, 'day').format('YYYY-MM-DD HH:mm:ss')
        }
      }
      const dateTime = JSON.parse(JSON.stringify(this.currentEventCopy[field]))
      const date = dateTime ? this.moment(dateTime).format('YYYY-MM-DD') : this.moment().format('YYYY-MM-DD')
      const time = dateTime ? this.moment(dateTime).format('HH:mm:ss') : '00:00:00'

      this.currentEventCopy[field] = flag === 'date'
        ? this.moment(`${value} ${time}`).format('YYYY-MM-DD HH:mm:ss')
        : this.moment(`${date} ${value}`).format('YYYY-MM-DD HH:mm:ss')
    },
    setEventData (value, field) {
      this.currentEventCopy[field] = value
    },
    updateEventData (value, field) {
      this.currentEventCopy[field] = value
    },
    saveUploadedImage (file) {
      this.createArrayBuffer(file)
      this.createBase64Image(file)
    },
    createArrayBuffer (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        this.$store.commit('events/SAVE_ARRAY_BUFFER_IMAGE', e.target.result)
      }
      reader.readAsArrayBuffer(file)
    },
    createBase64Image (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        this.$store.commit('events/SAVE_BASE_64_IMAGE', e.target.result)
      }
      reader.readAsDataURL(file)
    },
    getCurrentStatusClass (statusFlag) {
      const result = this.statuses.find(status => status.flag === statusFlag)
      return result && result.name ? result.name : 'published'
    },
    getCurrentStatus (statusFlag) {
      const result = this.statuses.find(status => status.flag === statusFlag)
      return result && result.title ? result.title : 'Published'
    },
    publishCurrentEvent () {
      this.$store.dispatch('events/publishCurrentEvent', { id: this.currentEventCopy.id, source: 'page' })
    },
    archiveCurrentEvent () {
      this.$store.dispatch('events/archiveCurrentEvent', { id: this.currentEventCopy.id, source: 'page' })
    }
    // toggleReservationRequired () {
    //   this.reservationRequired = !this.reservationRequired
    // },
  }
}
</script>
