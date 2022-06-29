<template>
  <div
    class="smq-forms-input"
    :style="width ? `width: ${width}px` : ''"
    :class="fullWidth ? 'w-100' : ''"
  >
    <span
      v-if="label"
      class="smq-forms-input-label"
      v-text="label"
      :class="color ? `-${color}` : ''"
    />
    <b-input-group class="smq-forms-input-body">
      <b-input-group-prepend
        v-if="prepend"
        class="smq-forms-input-body-prepend"
      >
        <smq-icon-euro v-if="field === 'current_price' && prepend === 'euro'" />
        <smq-icon-magnify
          v-if="prepend === 'search'"
          class="smq-forms-input-body-prepend-icon"
        />
        <span v-else-if="prepend === 'kc'" v-text="'Kč'" class="p-0 m-0" style="font-size: 11px" />
        <span v-else-if="prepend === 'days'" v-text="'Days'" class="p-0 m-0" style="font-size: 11px" />
        <span v-else-if="prepend === 'total_from'" v-text="'Total from'" class="p-0 m-0" style="font-size: 11px" />
        <span v-else-if="prepend === 'total_to'" v-text="'Total to'" class="p-0 m-0" style="font-size: 11px" />
        <smq-icon-calendar
          v-else-if="this.source !== 'discount' || this.source !== 'cash' || this.source !== 'product' && prepend === 'calendar'"
          class="smq-forms-input-body-prepend-icon"
        />
      </b-input-group-prepend>
      <b-input
        v-model="formValue"
        :placeholder="placeholder"
        class="smq-forms-input-body-input"
        :class="[
          append ? '-append' : '',
          prepend ? '-prepend' : '',
          error ? '-error' : ''
        ]"
        :min="min"
        :max="max"
        :type="type"
        :disabled="disabled"
        @change="valueChanged"
        @blur="setBlur"
      />
      <b-input-group-append
        v-if="append"
        class="smq-forms-input-body-append"
      >
        <b-form-datepicker
          :date-disabled-fn="dateDisabled"
          v-model="formValue"
          v-if="append === 'calendar'"
          button-only
          right
          class="calendar-button"
          @context="dateSelected"
        />
        <b-form-timepicker
          v-if="append === 'time'"
          button-only
          right
          class="calendar-button"
          @context="timeSelected"
        >
          <template #button-content>
            <smq-icon-clock-time-four-outline />
          </template>
        </b-form-timepicker>
      </b-input-group-append>
    </b-input-group>
    <span
      v-if="message && error"
      class="smq-forms-input-message"
      :class="error ? '-error' : ''"
      v-text="message"
    />
    <span
      v-if="defaultText"
      class="smq-forms-input-message"
      v-text="defaultText"
    />
  </div>
</template>

<script>
import moment from 'moment'
import SmqIconCalendar from '../icons/smq-icon-calendar'
import SmqIconEuro from '../icons/smq-icon-euro'
import SmqIconClockTimeFourOutline from '../marketing/icons/smq-icon-clock-time-four-outline'
import SmqIconMagnify from '../icons/smq-icon-magnify'
export default {
  name: 'SmqFormInput',
  components: { SmqIconMagnify, SmqIconClockTimeFourOutline, SmqIconEuro, SmqIconCalendar },
  props: {
    value: {
      default: null
    },
    error: {
      type: Boolean,
      default: false
    },
    source: {
      type: String,
      default: null
    },
    field: {
      type: String,
      default: null
    },
    subfield: {
      type: String,
      default: null
    },
    label: {
      type: String,
      default: null
    },
    message: {
      type: String,
      default: null
    },
    placeholder: {
      type: String,
      default: null
    },
    prepend: {
      type: String,
      default: null
    },
    append: {
      type: String,
      default: null
    },
    calendarPeriod: {
      type: String,
      default: null
    },
    width: {
      type: Number,
      default: null
    },
    color: {
      type: String,
      default: null
    },
    type: {
      type: String,
      default: null
    },
    labelControl: {
      type: String,
      default: null
    },
    disabled: {
      type: Boolean,
      default: false
    },
    fullWidth: {
      type: Boolean,
      default: false
    },
    min: {
      type: String,
      default: null
    },
    max: {
      type: String,
      default: null
    },
    defaultText: {
      type: String,
      default: null
    },
    noBlockEarlyDate: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      moment
    }
  },
  computed: {
    formValue: {
      get () {
        if (this.append === 'calendar') {
          return this.moment(this.value).format('YYYY-MM-DD')
        } else if (this.append === 'time') {
          return this.moment(this.value).format('HH:mm:ss')
        } else {
          return this.value
        }
      },
      set (changedValue) {
        return this.$emit('changed-value', changedValue)
      }
    }
  },
  methods: {
    dateDisabled (ymd) {
      if (this.noBlockEarlyDate) {
        return false
      } else if (this.calendarPeriod) {
        return this.calendarPeriod > this.moment(ymd).format('YYYY-MM-DD')
      } else {
        return this.moment().format('YYYY-MM-DD') > this.moment(ymd).format('YYYY-MM-DD')
      }
    },
    dateSelected (event) {
      this.$emit('changed-value', this.moment(event.activeYMD).format('YYYY-MM-DD'))
    },
    timeSelected (event) {
      this.$emit('changed-value', event.value || this.moment(this.value).format('HH:mm:ss'))
    },
    valueChanged () {
      this.$emit('value-changed')
    },
    setBlur () {
      this.$emit('blur')
    }

  }
}
</script>
