<template>
  <div class="loyalty-vouchers-create">
    <b-icon-x
      class="loyalty-vouchers-create-close"
      @click="closeCurrentVoucher"
    />
    <smq-icon-voucher-logo class="loyalty-vouchers-create-logo" />
    <div class="loyalty-vouchers-create-fields">
      <smq-form-input
        v-model="formData.title"
        label="QR code title"
        @changed-value="valueChanged($event, 'title')"
      />
      <smq-form-input
        v-model="formData.points"
        label="Points earn"
        @changed-value="valueChanged($event, 'points')"
      />
      <smq-form-datepicker
        v-model="formData.valid_to"
        label="Expiry date"
        placeholder="--/--"
        append="calendar"
        @changed-value="valueChanged($event, 'valid_to')"
      />
      <smq-form-input
        v-model="formData.quantity_issued"
        label="Maximum number of claims"
        @changed-value="valueChanged($event, 'quantity_issued')"
      />
    </div>
    <smq-form-button-small
      title="Generate and Save"
      variant="primary"
      class="mt-3"
      :disabled="buttonDisabled"
      @handle-action="createVoucher"
    />
  </div>
</template>

<script>
import moment from 'moment'
import SmqIconVoucherLogo from '~/components/loyalty/vouchers/icons/smq-icon-voucher-logo'
import SmqFormInput from '~/components/forms/smq-form-input'
import SmqFormButtonSmall from '~/components/forms/smq-form-button-small'
import SmqFormDatepicker from '~/components/forms/smq-form-datepicker'
export default {
  name: 'loyaltyVouchersCreate',
  components: {
    SmqFormButtonSmall,
    SmqFormInput,
    SmqIconVoucherLogo,
    SmqFormDatepicker
  },
  props: {
    close: {
      type: Function
    }
  },
  data () {
    return {
      moment,
      formData: {
        title: null,
        points: null,
        valid_from: null,
        valid_to: null,
        quantity_issued: null,
        loyalty_program_id: 1
      }
    }
  },
  computed: {
    buttonDisabled () {
      return !this.formData.title && !this.formData.points && !this.formData.valid_from && !this.formData.quantity_issued
    }
  },
  methods: {
    closeCurrentVoucher () {
      this.close()
    },
    valueChanged (value, field) {
      if (field === 'valid_to') {
        this.formData.valid_from = this.moment().format('YYYY-MM-DD HH:mm:ss')
        this.formData.valid_to = this.moment(value).format('YYYY-MM-DD HH:mm:ss')
      } else {
        this.formData[field] = value
      }
    },
    createVoucher () {
      const formData = JSON.parse(JSON.stringify(this.formData))
      formData.valid_to = this.moment(formData.valid_to).format('YYYY-MM-DD 23:59:00')
      this.$store.dispatch('vouchers/createVoucher', formData)
    }
  }
}
</script>
