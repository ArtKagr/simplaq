<template>
  <div class="loyalty-setup-page">
    <loyalty-setup-head title="Restrict scanning" @handler="saveData" />
    <div class="loyalty-setup-page-container">
      <div class="loyalty-setup-page-container-block">
        <span v-text="'Allow only receipts never then'" />
        <smq-form-input
          v-model="block_receipts_before"
          append="calendar"
          class="m-0"
          no-block-early-date
          disabled
          @changed-value="updateValue"
        />
      </div>
    </div>
  </div>
</template>

<script>
import LoyaltySetupHead from '~/components/loyalty/setup/setupHead'
import SmqFormInput from '~/components/forms/smq-form-input'
export default {
  name: 'LoyaltySetupRestrictScanning',
  components: { SmqFormInput, LoyaltySetupHead },
  data () {
    return {
      block_receipts_before: null
    }
  },
  computed: {
    loyaltySettings () {
      return this.$store.getters['settings/getLoyaltySettings']
    }
  },
  async created () {
    await this.$store.dispatch('settings/fetchSettings')
    if (this.loyaltySettings.block_receipts_before && this.loyaltySettings.block_receipts_before.value) {
      this.block_receipts_before = this.loyaltySettings.block_receipts_before.value
    }
  },
  methods: {
    saveData () {
      this.$store.dispatch('settings/updateCurrentSetting', {
        field: 'block_receipts_before',
        value: this.block_receipts_before
      })
    },
    updateValue (value) {
      this.block_receipts_before = value
    }
  }
}
</script>
