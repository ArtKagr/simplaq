<template>
  <div class="data_assets-tenants-new_tenant-container">
    <div class="data_assets-tenants-new_tenant-container-cards m-0">
      <div class="data_assets-tenants-new_tenant-container-cards-card">
        <div class="d-flex flex-column px-4 pt-4">
          <span v-text="'Loyalty program'" class="text-field mb-3" />
          <div class="d-flex align-items-center">
            <div class="d-flex align-items-center mr-4">
              <smq-icon-radiobox-marked
                v-if="changedLoyaltyStatus === 1"
                class="pointer"
              />
              <smq-icon-radiobox-blank
                @click.native="updateCurrentTenant(1, 'loyalty_status')"
                v-else
                class="pointer"
              />
              <span v-text="'Yes'" class="ml-2 text-normal" />
            </div>
            <div class="d-flex align-items-center">
              <smq-icon-radiobox-marked
                v-if="changedLoyaltyStatus === 0"
                class="pointer"
              />
              <smq-icon-radiobox-blank
                @click.native="updateCurrentTenant(0, 'loyalty_status')"
                v-else
                class="pointer"
              />
              <span v-text="'No'" class="ml-2 text-normal" />
            </div>
          </div>
        </div>
        <div class="loyalty-setup-page-container-block flex-column -no_shadow">
          <span class="w-100 mb-3 -bold" v-text="'Enter the value of 1 point in CZK'" />
          <div class="d-flex align-items-center w-100">
            <span class="mb-4" v-text="'1 point ='" />
            <smq-form-input
              v-model="currentValuePoint"
              prepend="kc"
              class="m-0"
              default-text="Default is 25 CZK."
              @blur="changeCurrentValuePoint"
              @changed-value="updateCurrentValuePoint"
            />
          </div>
        </div>
        <span class="data_assets-tenants-new_tenant-container-cards-card-title">Receipt</span>
        <div class="data_assets-tenants-new_tenant-container-image_drop-body p-4">
          <drag-drop-image
            :width="208"
            :height="208"
            message="Required field"
          />
        </div>
        <div class="d-flex px-4 pb-4">
          <b-table
            :fields="fields"
            :items="items"
            class="smq-table -tenant m-0"
          >
            <template v-slot:cell(data)="row">
              <span class="smq-table-text" v-text="row.item.data" />
            </template>
            <template v-slot:cell(input_data)="row">
              <smq-form-input
                v-if="row.index === 0"
                v-model="changedVatId"
                color="gray-800"
                class="data_assets-tenants-new_tenant-container-cards-card-container-field -vat"
                @changed-value="updateCurrentTenant($event, 'vat', 'company_identification')"
              />
              <smq-form-input
                v-if="row.index === 1"
                color="gray-800"
                class="data_assets-tenants-new_tenant-container-cards-card-container-field -alternative_vat"
              />
              <smq-form-input
                v-if="row.index === 2"
                v-model="changedLegalName"
                color="gray-800"
                class="data_assets-tenants-new_tenant-container-cards-card-container-field -legal_name"
                @changed-value="updateCurrentTenant($event, 'legal_name', 'company_identification')"
              />
              <smq-form-input
                v-if="row.index === 3"
                v-model="changedMallName"
                color="gray-800"
                class="data_assets-tenants-new_tenant-container-cards-card-container-field -mall_name"
                @changed-value="updateCurrentTenant($event, 'loyalty_company_name', 'company_identification')"
              />
              <smq-form-input
                v-if="row.index === 4"
                v-model="changedStopWords"
                color="gray-800"
                class="data_assets-tenants-new_tenant-container-cards-card-container-field -stop_words"
                @changed-value="updateCurrentTenant($event, 'loyalty_receipt_copy_words', 'company_identification')"
              />
              <smq-form-input
                v-if="row.index === 5"
                v-model="changedUnicMarker"
                color="gray-800"
                class="data_assets-tenants-new_tenant-container-cards-card-container-field -unic_marker"
                @changed-value="updateCurrentTenant($event, 'loyalty_receipt_copy_words', 'loyalty_unique_string')"
              />
              <smq-form-input
                v-if="row.index === 6"
                v-model="changedCompanyId"
                color="gray-800"
                class="data_assets-tenants-new_tenant-container-cards-card-container-field -company_id"
                @changed-value="updateCurrentTenant($event, 'legal_company_id', 'company_identification')"
              />
              <smq-form-input
                v-if="row.index === 7"
                color="gray-800"
                class="data_assets-tenants-new_tenant-container-cards-card-container-field -date"
              />
              <smq-form-input
                v-if="row.index === 8"
                color="gray-800"
                class="data_assets-tenants-new_tenant-container-cards-card-container-field -time"
              />
              <smq-form-input
                v-if="row.index === 9"
                color="gray-800"
                class="data_assets-tenants-new_tenant-container-cards-card-container-field -no_invoice"
              />
              <smq-form-input
                v-if="row.index === 10"
                color="gray-800"
                class="data_assets-tenants-new_tenant-container-cards-card-container-field -value_points"
              />
              <smq-form-input
                v-if="row.index === 11"
                color="gray-800"
                class="data_assets-tenants-new_tenant-container-cards-card-container-field -total_points"
              />
            </template>
            <template v-slot:cell(setup)="row">
              <smq-icon-checkbox-fill
                v-if="row.index !== 12 && row.item.setup"
                class="pointer"
                @click.native="setupTenantData(row.index, false)"
              />
              <smq-icon-checkbox-blank-outline
                v-if="row.index !== 12 && !row.item.setup"
                class="pointer"
                @click.native="setupTenantData(row.index, true)"
              />
            </template>
            <template v-slot:cell(recognized_data)="row">
              <span
                v-if="row.index !== 12"
                class="smq-table-text"
                v-text="'Recognized data'"
              />
            </template>
          </b-table>
        </div>
      </div>
      </div>
  </div>
</template>

<script>
import SmqIconRadioboxMarked from '~/components/icons/smq-icon-radiobox-marked'
import SmqIconRadioboxBlank from '~/components/icons/smq-icon-radiobox-blank'
import SmqFormInput from '~/components/forms/smq-form-input'
import DragDropImage from '~/components/dragDropImage'
import SmqIconCheckboxBlankOutline from '~/components/icons/smq-icon-checkbox-blank-outline'
import SmqIconCheckboxFill from '~/components/icons/smq-icon-checkbox-fill'
export default {
  name: 'tenantLoyalty',
  components: {
    SmqIconCheckboxFill,
    SmqIconCheckboxBlankOutline,
    DragDropImage,
    SmqFormInput,
    SmqIconRadioboxBlank,
    SmqIconRadioboxMarked
  },
  props: {
    loyaltyStatus: {
      type: Number,
      default: null
    },
    legalName: {
      type: String,
      default: null
    },
    mallName: {
      type: String,
      default: null
    },
    stopWords: {
      type: String,
      default: null
    },
    unicMarker: {
      type: String,
      default: null
    },
    companyId: {
      type: String,
      default: null
    },
    vatId: {
      type: String,
      default: null
    },
    source: {
      type: String,
      default: null
    }
  },
  data () {
    return {
      fields: [
        {
          key: 'data',
          label: 'Data',
          class: 'custom-width-15'
        },
        {
          key: 'input_data',
          label: 'Input data',
          class: 'custom-width-40'
        },
        {
          key: 'setup',
          label: 'Setup',
          class: 'custom-width-5'
        },
        {
          key: 'recognized_data',
          label: 'Recognized data',
          class: 'custom-width-40'
        }
      ],
      items: [
        { data: 'VAT', input_data: null, setup: false, recognized_data: null },
        { data: 'alternative VAT', input_data: null, setup: false, recognized_data: null },
        { data: 'Legal name', input_data: null, setup: false, recognized_data: null },
        { data: 'Mall name', input_data: null, setup: false, recognized_data: null },
        { data: 'Stop words', input_data: null, setup: false, recognized_data: null },
        { data: 'Unic. marker', input_data: null, setup: false, recognized_data: null },
        { data: 'Company ID', input_data: null, setup: false, recognized_data: null },
        { data: 'Date', input_data: null, setup: false, recognized_data: null },
        { data: 'Time', input_data: null, setup: false, recognized_data: null },
        { data: 'No. invoice', input_data: null, setup: false, recognized_data: null },
        { data: 'Value (points) >', input_data: null, setup: false, recognized_data: null },
        { data: 'Total price', input_data: null, setup: false, recognized_data: null },
        { data: 'Total control price by items', input_data: false, setup: null, recognized_data: null }
      ]
    }
  },
  computed: {
    changedLoyaltyStatus () {
      return this.loyaltyStatus
    },
    changedLegalName () {
      return this.legalName
    },
    changedMallName () {
      return this.mallName
    },
    changedStopWords () {
      return this.stopWords
    },
    changedUnicMarker () {
      return this.unicMarker
    },
    changedCompanyId () {
      return this.companyId
    },
    changedVatId () {
      return this.vatId
    },
    currentValuePoint () {
      return this.$store.getters['settings/getCurrentValuePoint']
    }
  },
  methods: {
    updateCurrentTenant (value, field, block) {
      this.$emit('changed-value', { value, field, block })
    },
    setupTenantData (index, flag) {
      this.items[index].setup = flag
    },
    updateCurrentValuePoint (value) {
      this.$store.commit('settings/SAVE_CURRENT_VALUE_POINT', { value })
    },
    changeCurrentValuePoint () {
      this.$store.dispatch('settings/updateCurrentPointValue', {
        id: this.$route.params.id,
        value: this.currentValuePoint
      })
    }
  }
}
</script>
