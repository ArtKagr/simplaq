<template>
 <div
   class="smq-forms-textarea"
   :style="`width: ${width}px`"
 >
   <span v-if="label" class="smq-forms-textarea-title" v-text="label" />
   <b-textarea
     v-model="formValue"
     class="smq-forms-textarea-body"
     :class="[
       highField ? '-high_field' : '',
       error ? '-error' : ''
     ]"
     :placeholder="placeholder"
   />
   <span
     v-if="message && error"
     class="smq-forms-input-message"
     :class="error ? '-error' : ''"
     v-text="message"
   />
 </div>
</template>

<script>
export default {
  name: 'smqFormTextarea',
  props: {
    value: {
      default: null
    },
    label: {
      type: String,
      default: null
    },
    width: {
      type: Number,
      default: null
    },
    placeholder: {
      type: String,
      default: null
    },
    highField: {
      type: Boolean,
      default: false
    },
    error: {
      type: Boolean,
      default: false
    },
    message: {
      type: String,
      default: null
    }
  },
  computed: {
    formValue: {
      get () {
        return this.value
      },
      set (changedValue) {
        return this.$emit('changed-value', changedValue)
      }
    }
  }
}
</script>
