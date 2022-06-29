<template>
  <div class="loyalty-receipts-current_receipt p-0">
    <div class="loyalty-receipts-current_receipt-head">
      <span class="loyalty-receipts-current_receipt-head-title">
        <smq-icon-arrow-left
          class="loyalty-receipts-current_receipt-head-title-icon"
          @click.native="openSetupMenu"
        />
        <span
          class="loyalty-receipts-current_receipt-head-title-text"
          v-text="title"
        />
      </span>
      <div class="loyalty-receipts-current_receipt-head-buttons">
        <b-button
          variant="primary"
          class="loyalty-receipts-current_receipt-head-buttons-button"
          v-text="'Save'"
          @click="clickEvent"
        />
      </div>
    </div>
  </div>
</template>

<script>
import SmqIconArrowLeft from '~/components/icons/smq-icon-arrow-left'
export default {
  name: 'LoyaltySetupHead',
  components: { SmqIconArrowLeft },
  props: {
    title: {
      type: String,
      default: null
    }
  },
  methods: {
    openSetupMenu () {
      this.$router.push('/loyalty/setup')
    },
    clickEvent () {
      this.$emit('handler')
    }
  }
}
</script>
