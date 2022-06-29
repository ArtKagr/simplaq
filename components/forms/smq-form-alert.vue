<template>
  <b-alert
    v-model="defaultValue"
    class="smq-forms-alert fixed-bottom rounded-0"
    :class="'-primary'"
    fade
    style="z-index: 2000;"
  >
    <span v-text="title" />
  </b-alert>
</template>

<script>
export default {
  name: 'SmqFormAlert',
  props: {
    title: {
      type: String,
      default: null
    },
    value: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      defaultValue: false
    }
  },
  watch: {
    value () {
      this.showAlert()
    },
    defaultValue (newValue) {
      if (newValue) {
        setTimeout(() => {
          this.defaultValue = false
        }, 2000)
        this.$emit('hide-alert')
      }
    }
  },
  methods: {
    showAlert () {
      this.defaultValue = true
    }
  }
}
</script>
