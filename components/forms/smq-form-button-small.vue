<template>
  <div
    class="smq-forms-button"
    :class="[
      variant ? `-${variant}` : '',
      disabled ? '-disabled' : ''
    ]"
    @click="handleAction"
  >
    <smq-icon-close v-if="icon === 'reject'" class="smq-forms-button-icon -reject"/>
    <smq-icon-approve v-else-if="icon === 'approve'" class="smq-forms-button-icon -approve" />
    <span v-text="title" />
  </div>
</template>

<script>
import SmqIconClose from '~/components/icons/smq-icon-close'
import SmqIconApprove from '~/components/icons/smq-icon-approve'
export default {
  name: 'SmqFormButtonSmall',
  components: { SmqIconClose, SmqIconApprove },
  props: {
    title: {
      type: String,
      default: null
    },
    variant: {
      type: String,
      default: 'primary'
    },
    icon: {
      type: String,
      default: null
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    handleAction () {
      if (!this.disabled) {
        this.$emit('handle-action')
      } else {
        this.$emit('error')
      }
    }
  }
}
</script>
