<template>
  <div class="marketing-news-schedule_calendar">
    <div class="marketing-news-schedule_calendar-body">
      <b-calendar
        locale="en"
        class="marketing-news-schedule_calendar-body-calendar"
        :date-disabled-fn="dateDisabled"
        @context="setSelectedDate"
      />
      <span
        class="marketing-news-schedule_calendar-body-value"
        v-text="moment(selectedDate).format('DD. MMMM, YYYY')"
      />
    </div>
    <div class="marketing-news-schedule_calendar-settings">
      <div class="marketing-news-schedule_calendar-settings-time">
        <span
          class="marketing-news-schedule_calendar-settings-time-title"
          v-text="'Time'"
        />
        <smq-form-dropdown
          :items="hours"
          :default-item="selectedHours"
          @selected-item="setSelectedHours"
        />
        <span
          class="marketing-news-schedule_calendar-settings-time-dots"
          v-text="':'"
        />
        <smq-form-dropdown
          :items="minutes"
          :default-item="selectedMinutes"
          @selected-item="setSelectedMinutes"
        />
      </div>
    </div>
    <div class="marketing-news-schedule_calendar-buttons">
      <div class="marketing-news-schedule_calendar-buttons-button">
        <smq-form-button-small
          title="Cancel"
          variant="outline_primary"
          @click.native="cancelDateChoosing"
        />
      </div>
      <div class="marketing-news-schedule_calendar-buttons-button">
        <smq-form-button-small
          title="Apply"
          variant="primary"
          @click.native="applyDateChoosing"
        />
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import SmqFormDropdown from '~/components/forms/smq-form-dropdown'
import SmqFormButtonSmall from '~/components/forms/smq-form-button-small'
export default {
  name: 'MarketingNewsScheduleCalendar',
  components: { SmqFormButtonSmall, SmqFormDropdown },
  props: {
    close: {
      type: Function
    }
  },
  data () {
    return {
      moment,
      selectedDate: moment.now(),
      selectedHours: '13',
      selectedMinutes: '00'
    }
  },
  computed: {
    hours () {
      return this.$store.getters['dictionaries/getHours']
    },
    minutes () {
      return this.$store.getters['dictionaries/getMinutes']
    },
    getResultingDate () {
      return `${this.moment(this.selectedDate).format('YYYY-MM-DD')} ${this.selectedHours}:${this.selectedMinutes}:00`
    }
  },
  created () {
    this.selectedHours = this.moment().format('HH')
    this.selectedMinutes = this.moment().format('mm')
  },
  methods: {
    cancelDateChoosing () {
      this.$emit('cancel')
    },
    applyDateChoosing () {
      this.$emit('apply', this.getResultingDate)
    },
    setSelectedDate (date) {
      this.selectedDate = date.activeDate
    },
    setSelectedHours (hours) {
      this.selectedHours = hours.flag
    },
    setSelectedMinutes (minutes) {
      this.selectedMinutes = minutes.flag
    },
    dateDisabled (ymd) {
      return this.moment().format('YYYY-MM-DD') > this.moment(ymd).format('YYYY-MM-DD')
    }
  }
}
</script>
