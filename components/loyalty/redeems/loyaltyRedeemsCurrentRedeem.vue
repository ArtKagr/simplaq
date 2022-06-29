<template>
  <div class="loyalty-redeems-current_redeem">
    <b-icon-x
      class="loyalty-redeems-current_redeem-close"
      @click="closeCurrentRedeem"
    />
    <div class="loyalty-redeems-current_redeem-logos">
      <img
        class="loyalty-redeems-current_redeem-logos-logo"
        :src="currentRedeem.qr_code_link"
        alt="qr-code"
      />
      <img
        class="loyalty-redeems-current_redeem-logos-logo"
        :src="currentRedeem.reward.photo_link"
        alt="reward"
      />
    </div>
    <div class="loyalty-redeems-current_redeem-table">
      <div class="loyalty-redeems-current_redeem-table-row">
        <span
          class="loyalty-redeems-current_redeem-table-row-title"
          v-text="'Offer name'"
        />
        <span
          class="loyalty-redeems-current_redeem-table-row-value"
          v-text="currentRedeem.reward.title"
        />
      </div>
      <div class="loyalty-redeems-current_redeem-table-row">
        <span
          class="loyalty-redeems-current_redeem-table-row-title"
          v-text="'Store name'"
        />
        <span
          class="loyalty-redeems-current_redeem-table-row-value"
          v-text="currentRedeem.company.title"
        />
      </div>
      <div class="loyalty-redeems-current_redeem-table-row">
        <span
          class="loyalty-redeems-current_redeem-table-row-title"
          v-text="'Username'"
        />
        <span
          class="loyalty-redeems-current_redeem-table-row-value"
          v-text="`${currentRedeem.customer.first_name} ${currentRedeem.customer.last_name}`"
        />
      </div>
      <div class="loyalty-redeems-current_redeem-table-row">
        <span
          class="loyalty-redeems-current_redeem-table-row-title"
          v-text="'Date'"
        />
        <span
          class="loyalty-redeems-current_redeem-table-row-value"
          v-text="moment(currentRedeem.created_at).format('DD.MM.YYYY')"
        />
      </div>
      <div class="loyalty-redeems-current_redeem-table-row">
        <span
          class="loyalty-redeems-current_redeem-table-row-title"
          v-text="'Status'"
        />
        <span
          class="loyalty-redeems-current_redeem-table-row-value"
          v-text="currentRedeemStatus"
        />
      </div>
    </div>
    <b-button
      class="loyalty-redeems-current_redeem-button"
      variant="danger"
      v-text="'Cancel transaction'"
      @click="cancelRedeem"
    />
  </div>
</template>

<script>
import moment from 'moment'
export default {
  name: 'LoyaltyRedeemsCurrentRedeem',
  props: {
    close: {
      type: Function
    }
  },
  data () {
    return {
      moment
    }
  },
  computed: {
    currentRedeem () {
      return this.$store.getters['redeems/getCurrentRedeem']
    },
    redeemStatuses () {
      return this.$store.getters['dictionaries/getRedeemStatuses']
    },
    currentRedeemStatus () {
      if (this.currentRedeem && this.currentRedeem.id && this.redeemStatuses && this.redeemStatuses.length) {
        return this.redeemStatuses.find(status => Number(status.flag) === this.currentRedeem.status).title
      } else {
        return 'Status'
      }
    }
  },
  methods: {
    closeCurrentRedeem () {
      this.close()
    },
    cancelRedeem () {
      this.$store.dispatch('redeems/cancelCurrentRedeem')
    }
  }
}
</script>
