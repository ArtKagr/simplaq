<template>
  <div class="loyalty-receipts-current_receipt">
    <div class="loyalty-receipts-current_receipt-head">
      <span class="loyalty-receipts-current_receipt-head-title">
        <smq-icon-arrow-left
          class="loyalty-receipts-current_receipt-head-title-icon"
          @click.native="openReceiptsList"
        />
        <span class="loyalty-receipts-current_receipt-head-title-text">Receipt detail</span>
        <span
          class="smq-table-status ml-4"
          :class="`-${getReceiptStatus(currentReceipt.status)}`"
          v-text="getReceiptStatus(currentReceipt.status) === 'in_review' ? 'in review' : getReceiptStatus(currentReceipt.status)"
        />
      </span>
      <div class="loyalty-receipts-current_receipt-head-buttons">
        <b-button
          v-if="getCurrentButton('decline')"
          variant="outline-danger"
          class="loyalty-receipts-current_receipt-head-buttons-button"
          @click="rejectReceipt"
        >
          <smq-icon-close class="loyalty-receipts-current_receipt-head-buttons-button-icon -close" />
          Decline
        </b-button>
        <b-button
          v-if="getCurrentButton('reset')"
          variant="outline-warning"
          class="loyalty-receipts-current_receipt-head-buttons-button"
          @click="resetReceipt"
        >
          <smq-icon-close class="loyalty-receipts-current_receipt-head-buttons-button-icon -close -warning" />
          Reset
        </b-button>
        <b-button
          v-if="getCurrentButton('approve')"
          variant="primary"
          class="loyalty-receipts-current_receipt-head-buttons-button"
          @click="approveReceipt"
        >
          <smq-icon-approve class="loyalty-receipts-current_receipt-head-buttons-button-icon -approve" />
          Approve
        </b-button>
      </div>
    </div>
    <div class="loyalty-receipts-current_receipt-container">
      <div class="loyalty-receipts-current_receipt-container-receipt_image">
        <img
          v-if="currentReceipt && currentReceipt.receipt_link"
          class="loyalty-receipts-current_receipt-container-receipt_image-image"
          :src="currentReceipt.receipt_link"
          :alt="`receipt-${currentReceipt.receipt_link_id}`"
          @click="openReceiptImage"
        />
        <div
          v-else
          class="loyalty-receipts-current_receipt-container-receipt_image-image"
        />
      </div>
      <div class="loyalty-receipts-current_receipt-container-tables">
        <b-table
          :fields="fields.description"
          :items="items"
          :stacked="true"
          class="smq-table -stacked"
        >
          <template v-slot:cell(vendor_name)="row">
            <b-skeleton v-if="!editableFields" type="input" />
            <smq-form-dropdown
              v-else-if="editable"
              class="loyalty-receipts-head-dropdown"
              :items="tenants"
              :default-item="row.item.company && row.item.company.id ? row.item.company.id : row.item.company_id ? row.item.company_id : null"
              :disabled="tenants && !tenants.length"
              placeholder="Store"
              @selected-item="receiptDataChanged({ value: $event.flag, field: 'company_id' })"
            />
            <span
              v-else
              class="smq-table-text"
              v-text="getCompanyName(row.item.company && row.item.company.id ? row.item.company.id : row.item.company_id ? row.item.company_id : null)"
            />
          </template>
          <template v-slot:cell(vendor_address)="row">
            <span
              v-if="editableFields"
              class="smq-table-text"
              v-text="row.item.company && row.item.company.address ? row.item.company.address : null"
            />
            <b-skeleton v-else type="input" />
          </template>
          <template v-slot:cell(vendor_on_map)>
            <span v-if="editableFields" class="smq-table-link">View map</span>
            <b-skeleton v-else type="input" />
          </template>
          <template v-slot:cell(vendor_phone)="row">
            <span
              v-if="editableFields"
              class="smq-table-text"
              v-text="row.item.company && row.item.company.phone ? row.item.company.phone : null"
            />
            <b-skeleton v-else type="input" />
          </template>
          <template v-slot:cell(vendor_website)="row">
            <span
              v-if="editableFields"
              class="smq-table-text"
              v-text="row.item.company && row.item.company.website ? row.item.company.website : null"
            />
            <b-skeleton v-else type="input" />
          </template>
          <template v-slot:cell(vendor_email)="row">
            <span
              v-if="editableFields"
              class="smq-table-text"
              v-text="row.item.company && row.item.company.email ? row.item.company.email : null"
            />
            <b-skeleton v-else type="input" />
          </template>
          <template v-slot:cell(vendor_types)="row">
            <span
              v-if="editableFields"
              class="smq-table-text"
              v-text="row.item.company && row.item.company.company_type_id ? getCurrentCompanyType(row.item.company.company_type_id) : null"
            />
            <b-skeleton v-else type="input" />
          </template>
          <template v-slot:cell(category)="row">
            <span
              v-if="editableFields"
              class="smq-table-text"
              v-text="row.item.company && row.item.company.company_type_id ? getCurrentCompanyType(row.item.company.company_type_id) : null"
            />
            <b-skeleton v-else type="input" />
          </template>
          <template v-slot:cell(payment_type)="row">
            <span
              v-if="editableFields"
              class="smq-table-text"
              v-text="row.item.payment_type || null"
            />
            <b-skeleton v-else type="input" />
          </template>
          <template v-slot:cell(invoice_number)="row">
            <span
              v-if="editableFields"
              class="smq-table-text"
              v-text="row.item.invoice || null"
            />
            <b-skeleton v-else type="input" />
          </template>
          <template v-slot:cell(purchase_order)="row">
            <span
              v-if="editableFields"
              class="smq-table-text"
              v-text="row.item.purchase_order || null"
            />
            <b-skeleton v-else type="input" />
          </template>
          <template v-slot:cell(date)="row">
            <b-skeleton v-if="!editableFields" type="input" />
            <smq-form-datepicker
              v-else-if="editable"
              v-model="row.item.date"
              class="m-0"
              append="calendar"
              @changed-value="receiptDataChanged({ value: $event, field: 'date' })"
            />
            <span
              v-else
              class="smq-table-text"
              v-text="moment(row.item.date).format('DD.MM.YYYY')"
            />
          </template>
        </b-table>
        <b-table
          :fields="fields.taxes"
          :items="taxItemsChanged"
          class="smq-table -taxes"
          foot-clone
        >
          <template v-slot:cell(description)="row">
            <b-skeleton v-if="!editableFields && row.index === 0" type="input" />
            <smq-form-input
              v-else-if="row.index === 0 && editable"
              v-model="row.item.description"
              class="m-0"
              @changed-value="receiptDataChanged({ value: $event, field: 'description' })"
              placeholder="Description"
            />
            <span
              v-else-if="row.index === 0"
              v-text="row.item.description"
            />
          </template>
          <template v-slot:cell(price)="row">
            <b-skeleton v-if="!editableFields && row.index === 0" type="input" />
<!--            <smq-form-input-->
<!--              v-else-if="row.index === 0 && editable"-->
<!--              v-model="row.item.price"-->
<!--              class="m-0"-->
<!--            />-->
            <span
              v-else-if="row.index === 0"
              v-text="row.item.price"
            />
          </template>
          <template v-slot:cell(quantity)="row">
            <b-skeleton v-if="!editableFields && row.index === 0" type="input" />
<!--            <smq-form-input-->
<!--              v-else-if="row.index === 0 && editable"-->
<!--              v-model="row.item.quantity"-->
<!--              :width="105"-->
<!--              class="m-0"-->
<!--            />-->
            <span
              v-else-if="row.index === 0"
              v-text="row.item.quantity"
            />
            <span
              v-else-if="row.index === 1"
              v-text="'Tax (15%)'"
              class="smq-table-text"
            />
            <span
              v-else-if="row.index === 2"
              v-text="'Subtotal (CZK)'"
              class="smq-table-text -bold"
            />
            <span
              v-else-if="row.index === 3"
              v-text="'Tax (CZK)'"
              class="smq-table-text -bold"
            />
          </template>
          <template v-slot:cell(total)="row">
            <b-skeleton v-if="!editableFields" type="input" />
            <smq-form-input
              v-else-if="editable && row.index === 1"
              v-model="row.item.total"
              :width="105"
              class="m-0"
            />
            <smq-form-input
              v-else-if="editable && row.index === 2"
              v-model="row.item.total"
              :width="105"
              class="m-0"
              @changed-value="receiptDataChanged({ value: $event, field: 'subtotal' })"
            />
            <smq-form-input
              v-else-if="editable && row.index === 3"
              v-model="row.item.total"
              :width="105"
              class="m-0"
              @changed-value="receiptDataChanged({ value: $event, field: 'tax' })"
            />
            <span
              v-else
              class="smq-table-text"
              v-text="row.item.total"
            />
          </template>
          <template #foot(description)>
            <span />
          </template>
          <template #foot(price)>
            <span />
          </template>
          <template #foot(quantity)>
            <span v-text="'Total (CZK)'" />
          </template>
          <template #foot(total)>
            <b-skeleton v-if="!editableFields" type="input" />
            <smq-form-input
              v-else-if="editable"
              v-model="currentReceipt.total"
              :width="105"
              class="m-0"
              @changed-value="receiptDataChanged({ value: $event, field: 'total' })"
            />
            <span
              v-else
              class="smq-table-text -white"
              v-text="currentReceipt.total"
            />
          </template>
        </b-table>
        <div
          v-if="editable"
          class="loyalty-receipts-current_receipt-container-tables-buttons"
        >
          <b-button
            variant="outline-primary"
            class="loyalty-receipts-current_receipt-container-tables-buttons-button"
            v-text="'Cancel'"
            @click="toggleEditable(false)"
          />
          <b-button
            :disabled="!Object.values(updatedReceiptData).some(value => value)"
            variant="primary"
            class="loyalty-receipts-current_receipt-container-tables-buttons-button"
            v-text="'Save'"
            @click="updateReceipt"
          />
        </div>
        <div
          v-else
          class="loyalty-receipts-current_receipt-container-tables-buttons"
        >
          <b-button
            variant="outline-primary"
            class="loyalty-receipts-current_receipt-container-tables-buttons-button"
            v-text="'Edit'"
            @click="toggleEditable(true)"
          />
        </div>
      </div>
    </div>
    <b-modal
      class="loyalty-receipts-current_receipt-receipt_modal"
      v-model="isReceiptImageShown"
      hide-header
      hide-footer
      centered
    >
      <template #default>
        <div class="loyalty-receipts-current_receipt-container-receipt_image -modal">
          <img
            v-if="currentReceipt && currentReceipt.receipt_link"
            class="loyalty-receipts-current_receipt-container-receipt_image-image"
            :src="currentReceipt.receipt_link"
            :alt="`receipt-${currentReceipt.receipt_link_id}`"
            @click="openReceiptImage"
          />
          <div
            v-else
            class="loyalty-receipts-current_receipt-container-receipt_image-image"
          />
        </div>
      </template>
    </b-modal>
  </div>
</template>

<script>
import moment from 'moment'
import SmqIconArrowLeft from '~/components/icons/smq-icon-arrow-left'
import SmqIconClose from '~/components/icons/smq-icon-close'
import SmqIconApprove from '~/components/icons/smq-icon-approve'
import SmqFormInput from '~/components/forms/smq-form-input'
import SmqFormDatepicker from '~/components/forms/smq-form-datepicker'
import SmqFormDropdown from '~/components/forms/smq-form-dropdown'
export default {
  name: 'loyaltyCurrentReceipt',
  components: {
    SmqFormDropdown,
    SmqFormDatepicker,
    SmqFormInput,
    SmqIconApprove,
    SmqIconClose,
    SmqIconArrowLeft
  },
  data () {
    return {
      isReceiptImageShown: false,
      moment,
      fields: {
        description: [
          {
            key: 'vendor_name',
            label: 'Vendor name'
          },
          {
            key: 'vendor_address',
            label: 'Vendor address'
          },
          {
            key: 'vendor_on_map',
            label: 'Vendor on map'
          },
          {
            key: 'vendor_phone',
            label: 'Vendor phone'
          },
          {
            key: 'vendor_website',
            label: 'Vendor Website'
          },
          {
            key: 'vendor_email',
            label: 'Vendor Email'
          },
          {
            key: 'vendor_types',
            label: 'Vendor Types'
          },
          {
            key: 'category',
            label: 'Category'
          },
          {
            key: 'payment_type',
            label: 'Payment Type'
          },
          {
            key: 'invoice_number',
            label: 'Invoice Number'
          },
          {
            key: 'purchase_order',
            label: 'Purchase Order'
          },
          {
            key: 'date',
            label: 'Date'
          }
        ],
        taxes: [
          {
            key: 'description',
            label: 'Description'
          },
          {
            key: 'price',
            label: 'Price'
          },
          {
            key: 'quantity',
            label: 'Qty'
          },
          {
            key: 'total',
            label: 'Total'
          }
        ]
      },
      taxItems: [
        { description: null, price: null, quantity: null, total: 109 },
        { description: null, price: null, quantity: null, total: 14.22 },
        { description: null, price: null, quantity: null, total: 94.72 },
        { description: null, price: null, quantity: null, total: 14.22 }
      ],
      editable: false,
      updatedReceiptData: {
        company_id: null,
        date: null,
        total: null,
        description: null,
        subtotal: null,
        tax: null
      }
    }
  },
  watch: {
    status (newValue) {
      switch (newValue) {
        case 'receipt-successfully-approved':
          // this.$router.push('/loyalty/receipts')
          break
        case 'receipt-successfully-rejected':
          // this.$router.push('/loyalty/receipts')
          break
        case 'receipt-successfully-reset':
          // this.$router.push('/loyalty/receipts')
          break
        case 'receipt-successfully-updated':
          this.editable = false
          break
      }
    }
  },
  computed: {
    editableFields () {
      return this.currentReceipt && this.currentReceipt.id && this.tenants && this.tenants.length
    },
    currentReceipt () {
      return this.$store.getters['receipts/getCurrentReceipt']
    },
    items () {
      const result = []
      if (this.currentReceipt && this.currentReceipt.id) {
        result.push(this.currentReceipt)
      }
      return result
    },
    taxItemsChanged () {
      const currentReceipt = this.currentReceipt
      return this.taxItems.map(function (item, index) {
        if (index === 0) {
          item.description = currentReceipt.description
          item.total = currentReceipt.total
        } else if (index === 1 || index === 3) {
          item.total = currentReceipt.tax
        } else if (index === 2) {
          item.total = currentReceipt.subtotal
        }
        return item
      })
    },
    companyTypes () {
      return this.$store.getters['dictionaries/getCompanyTypesList']
    },
    status () {
      return this.$store.getters['dictionaries/getStatus']
    },
    pagination () {
      return this.$store.getters['dictionaries/getPagination']
    },
    tenants () {
      return this.$store.getters['tenants/getTenantsList'].map((tenant) => {
        return {
          title: tenant.title,
          flag: String(tenant.id)
        }
      }) || []
    },
    routeUrl () {
      return this.$store.getters['dictionaries/getRouteUrl']
    }
  },
  created () {
    localStorage.setItem('routeUrl', JSON.stringify(Object.fromEntries(Object.entries(this.routeUrl).filter(([_, v]) => v != null))))
    this.$store.commit('dictionaries/CLEAR_PAGINATION_SORT_FILTER')
    this.$store.dispatch('receipts/fetchCurrentReceipt', this.$route.params.id)
  },
  methods: {
    openReceiptsList () {
      this.$router.push('/loyalty/receipts')
    },
    toggleEditable (flag) {
      this.editable = flag
      this.updatedReceiptData = {
        company_id: null,
        date: null,
        total: null,
        description: null,
        subtotal: null,
        tax: null
      }
    },
    rejectReceipt () {
      this.$store.dispatch('receipts/rejectReceipt', this.currentReceipt.id)
    },
    resetReceipt () {
      this.$store.dispatch('receipts/resetReceipt', this.currentReceipt.id)
    },
    approveReceipt () {
      this.$store.dispatch('receipts/approveReceipt', this.currentReceipt.id)
    },
    getCurrentCompanyType (id) {
      const result = this.companyTypes.find(companyType => companyType.id === id)
      return result ? result.company_type : null
    },
    getCurrentButton (status) {
      if (this.currentReceipt && this.currentReceipt.id) {
        if (status === 'reset') {
          return this.currentReceipt.status === 2
        } else if (status === 'decline') {
          return this.currentReceipt.status === 1 || this.currentReceipt.status === 0
        } else if (status === 'approve') {
          return this.currentReceipt.status === 0
        }
      } else {
        return false
      }
    },
    openReceiptImage () {
      this.isReceiptImageShown = true
    },
    updateReceipt () {
      this.$store.dispatch('receipts/updateReceipt', this.updatedReceiptData)
    },
    receiptDataChanged (payload) {
      if (payload.field === 'date') {
        this.$store.commit('receipts/UPDATE_CURRENT_RECEIPT', payload)
      }
      this.updatedReceiptData[payload.field] = payload.value
    },
    getCompanyName (tenantId) {
      if (tenantId && this.tenants && this.tenants.length) {
        return this.tenants.find(tenant => tenant.flag === String(tenantId)).title
      } else {
        return null
      }
    },
    getReceiptStatus (status) {
      if (status === 0) {
        return 'in_review'
      } else if (status === 1) {
        return 'approved'
      } else if (status === 2) {
        return 'rejected'
      }
    }
  }
}
</script>
