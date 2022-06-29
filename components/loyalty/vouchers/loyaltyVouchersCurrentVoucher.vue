<template>
  <div class="loyalty-vouchers-create">
    <b-icon-x
      class="loyalty-vouchers-create-close"
      @click="closeCurrentVoucher"
    />
    <div class="loyalty-vouchers-create-status">
      <span
        :class="`smq-table-status -${getCurrentStatusClass(currentVoucherCopy.status)}`"
        v-text="getCurrentStatus(currentVoucherCopy.status)"
      />
    </div>
    <img
      :src="currentVoucher.qr_code_link"
      :alt="`link-${currentVoucher.id}`"
      class="loyalty-vouchers-create-logo"
    />
    <div class="loyalty-vouchers-create-fields">
      <smq-form-input
        v-model="currentVoucher.title"
        label="Voucher name"
        @changed-value="voucherValidChanged($event, 'title')"
      />
      <div class="d-flex align-items-center">
        <smq-form-input
          v-model="currentVoucher.points"
          label="Give points"
          class="mr-4"
          @changed-value="voucherValidChanged($event, 'points')"
        />
        <smq-form-input
          v-model="currentVoucher.quantity_issued"
          label="Vouchers issued"
          @changed-value="voucherValidChanged($event, 'quantity_issued')"
        />
      </div>
      <div class="d-flex align-items-center">
        <smq-form-datepicker
          v-model="currentVoucher.valid_from"
          label="Valid from"
          placeholder="--/--"
          append="calendar"
          class="mr-4"
          @changed-value="voucherValidChanged($event, 'valid_from')"
        />
        <smq-form-datepicker
          v-model="currentVoucher.valid_to"
          label="Valid to"
          placeholder="--/--"
          append="calendar"
          @changed-value="voucherValidChanged($event, 'valid_to')"
        />
      </div>
    </div>
    <div class="d-flex align-items-center flex-column">
      <smq-form-button-small
        title="Save changes"
        variant="primary"
        class="mt-3 w-100"
        @click.native="updateCurrentVoucher"
      />
      <smq-form-button-small
        v-if="currentVoucherCopy.status === 1"
        title="Archive"
        variant="danger"
        class="mt-3 w-100"
        @click.native="archiveCurrentVoucher"
      />
      <smq-form-button-small
        v-if="currentVoucherCopy.status === 0"
        title="Publish"
        variant="success"
        class="mt-3 w-100"
        @click.native="publishCurrentVoucher"
      />
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import SmqFormInput from '~/components/forms/smq-form-input'
import SmqFormButtonSmall from '~/components/forms/smq-form-button-small'
import SmqFormDatepicker from '~/components/forms/smq-form-datepicker'
export default {
  name: 'loyaltyVouchersCurrentVoucher',
  components: { SmqFormDatepicker, SmqFormButtonSmall, SmqFormInput },
  props: {
    close: {
      type: Function
    }
  },
  data () {
    return {
      moment,
      saveDisabled: true,
      currentVoucherCopy: {
        id: null,
        created_at: null,
        loyalty_program: null,
        loyalty_program_id: null,
        points: null,
        qr_code_link: null,
        quantity_issued: null,
        quantity_redeemed: null,
        status: null,
        title: null,
        token: null,
        updated_at: null,
        valid_from: null,
        valid_to: null
      }
    }
  },
  watch: {
    currentVoucher: {
      handler (newValue, oldValue) {
        if (newValue.status !== oldValue.status) {
          this.currentVoucherCopy.status = newValue.status
        }
      },
      deep: true
    },
    status (newValue) {
      switch (newValue) {
        case 'voucher-successfully-published':
          this.close()
          break
        case 'voucher-successfully-archived':
          this.close()
          break
      }
    }
  },
  computed: {
    currentVoucher () {
      return this.$store.getters['vouchers/getCurrentVoucher']
    },
    statuses () {
      return this.$store.getters['dictionaries/getStatuses']
    },
    status () {
      return this.$store.getters['dictionaries/getStatus']
    }
  },
  created () {
    this.currentVoucherCopy = { ...this.$store.getters['vouchers/getCurrentVoucher'] }
  },
  methods: {
    closeCurrentVoucher () {
      this.close()
    },
    voucherValidChanged (value, field) {
      this.$store.commit('vouchers/UPDATE_CURRENT_VOUCHER', { field, value })
    },
    archiveCurrentVoucher () {
      this.$store.dispatch('vouchers/archiveCurrentVoucher', this.currentVoucherCopy.id)
    },
    publishCurrentVoucher () {
      this.$store.dispatch('vouchers/publishCurrentVoucher', this.currentVoucherCopy.id)
    },
    updateCurrentVoucher () {
      this.$store.dispatch('vouchers/updateVoucher')
    },
    getCurrentStatusClass (statusFlag) {
      const result = this.statuses.find(status => status.flag === statusFlag)
      return result && result.name ? result.name : 'archived'
    },
    getCurrentStatus (statusFlag) {
      const result = this.statuses.find(status => status.flag === statusFlag)
      return result && result.title ? result.title : 'Archived'
    }
  }
}
</script>
