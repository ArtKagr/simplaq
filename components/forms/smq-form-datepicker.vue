<template>
  <div class="smq-forms-input">
    <span
      v-if="label"
      class="smq-forms-input-label"
      v-text="label"
      :class="color ? `-${color}` : ''"
    />
    <b-input-group class="smq-forms-input-body">
      <b-input
        v-model="formValue"
        :placeholder="placeholder"
        class="smq-forms-input-body-input"
        :class="[ append ? '-append' : '', prepend ? '-prepend' : '', error ? '-error' : '' ]"
        :type="type"
        disabled
      />
      <b-input-group-append
        v-if="append"
        class="smq-forms-input-body-append"
      >
        <b-form-datepicker
          v-model="formValue"
          v-if="append === 'calendar'"
          button-only
          right
          class="calendar-button"
          @context="dateSelected"
        >

        </b-form-datepicker>
        <b-form-timepicker
          v-if="append === 'time'"
          v-model="formValue"
          :disabled="disabled"
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
  </div>
</template>

<script>
import moment from 'moment'
import SmqIconClockTimeFourOutline from '../marketing/icons/smq-icon-clock-time-four-outline'
export default {
  name: 'SmqFormDatepicker',
  components: { SmqIconClockTimeFourOutline },
  props: {
    value: {
      default: null
    },
    type: {
      type: String,
      default: null
    },
    error: {
      type: Boolean,
      default: false
    },
    placeholder: {
      type: String,
      default: null
    },
    label: {
      type: String,
      default: null
    },
    color: {
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
    disabled: {
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
        return this.value
      },
      set (newValue) {
        this.$emit('changed-value', this.newValue)
      }
    }
  },
  methods: {
    dateSelected (event) {
      this.$emit('changed-value', this.moment(event.activeYMD).format('YYYY-MM-DD'))
    },
    timeSelected (event) {
      this.$emit('changed-value', event.value)
    }
  }
}
</script>
