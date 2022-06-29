<template>
  <div class="smq-forms-datepicker_multiple">
    <div class="smq-forms-datepicker_multiple-body">
      <smq-icon-calendar
        class="smq-forms-datepicker_multiple-body-icon"
      />
      <input
        type="text"
        class="smq-forms-datepicker_multiple-body-input"
        id="datepicker-trigger"
        placeholder="Date from - Date to"
        :value="formatDates(dateOne, dateTwo)"
      >

      <AirbnbStyleDatepicker
        :trigger-element-id="'datepicker-trigger'"
        :mode="'range'"
        :fullscreen-mobile="true"
        :date-one="dateOne"
        :date-two="dateTwo"
        closeAfterSelect
        @date-one-selected="setDateOne"
        @date-two-selected="setDateTwo"
      />
    </div>
  </div>
</template>

<script>
import format from 'date-fns/format'
import SmqIconCalendar from '../icons/smq-icon-calendar'
export default {
  name: 'SmqFormDatepickerMultiple',
  components: { SmqIconCalendar },
  data () {
    return {
      format,
      dateFormat: 'DD.MM.YYYY',
      dateOne: null,
      dateTwo: null
    }
  },
  props: {
    fields: {
      type: String,
      default: null
    }
  },
  watch: {
    resetFilter (newValue) {
      if (newValue) {
        this.dateOne = null
        this.dateTwo = null
      }
    }
  },
  computed: {
    resetFilter () {
      return this.$store.getters['dictionaries/getResetFilter']
    }
  },
  methods: {
    setDateOne (dateOne) {
      if (dateOne) {
        this.$store.commit('dictionaries/TOGGLE_RESET_FILTER', false)
        this.dateOne = dateOne
      }
    },
    setDateTwo (dateTwo) {
      if (dateTwo) {
        this.dateTwo = dateTwo
        this.$store.commit('dictionaries/UPDATE_DATES_FILTER', { date_from: this.dateOne, date_to: this.dateTwo })
      }
    },
    formatDates (dateOne, dateTwo) {
      let formattedDates = ''
      if (dateOne) {
        formattedDates = format(dateOne, this.dateFormat)
      }
      if (dateTwo) {
        formattedDates += ' - ' + format(dateTwo, this.dateFormat)
      }
      return formattedDates
    }
  }
}
</script>
