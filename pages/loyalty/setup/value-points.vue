<template>
  <div class="loyalty-setup-page">
    <loyalty-setup-head title="Value of points" @handler="saveData" />
    <div class="loyalty-setup-page-container">
      <div class="loyalty-setup-page-container-block flex-column">
        <span class="w-100 mb-3 -bold" v-text="'Enter the value of 1 point in CZK'" />
        <div class="d-flex align-items-center w-100">
          <span class="mb-4" v-text="'1 point ='" />
          <smq-form-input
            v-model="loyaltySettings.points_to_czk.value"
            prepend="kc"
            class="m-0"
            default-text="Default is 25 CZK."
            @changed-value="updateValue"
          />
        </div>
      </div>
      <div class="loyalty-setup-page-container-table mt-4">
        <div class="loyalty-receipts-current_receipt-head">
          <span class="loyalty-receipts-current_receipt-head-title">
            <span
              class="loyalty-receipts-current_receipt-head-title-text"
              v-text="'Tenants list'"
            />
          </span>
          <div class="loyalty-receipts-head-search">
            <smq-form-input
              v-model="tenantsSearch"
              class="m-0"
              placeholder="Search..."
              dropdown-type="filter"
              prepend="search"
              @changed-value="tenantSearching"
            />
          </div>
        </div>
        <div class="d-flex w-100">
<!--          v-if="valuePointsList && valuePointsList.length"-->
          <b-table
            :fields="fields"
            :items="valuePointsList"
            head-variant="gray-200"
            class="smq-table"
          >
            <template v-slot:cell(logo_picture)="row">
              <img
                v-if="row.item.logo_picture"
                class="smq-table-tenant_logo"
                :src="row.item.logo_picture"
                :alt="`logo-${row.item.id}`"
              />
              <smq-icon-image-square v-else />
            </template>
            <template v-slot:cell(value)="row">
              <smq-form-input
                v-if="row.item.settings[0] && (row.item.settings[0].value || row.item.settings[0].value === null || row.item.settings[0].value === '')"
                v-model="row.item.settings[0].value"
                class="m-0"
                type="number"
                :width="115"
                @blur="blurValue(row.index, row.item.id)"
                @changed-value="updateTenantValue($event, row.index)"
              />
            </template>
          </b-table>
        </div>
        <smq-form-pagination />
      </div>
    </div>
  </div>
</template>

<script>
import LoyaltySetupHead from '~/components/loyalty/setup/setupHead'
import SmqFormInput from '~/components/forms/smq-form-input'
import SmqIconImageSquare from '~/components/icons/smq-icon-image-square'
import SmqFormPagination from '~/components/forms/smq-form-pagination'
export default {
  name: 'LoyaltySetupValuePoints',
  components: {
    SmqFormPagination,
    SmqIconImageSquare,
    LoyaltySetupHead,
    SmqFormInput
  },
  data () {
    return {
      tenantsSearch: null,
      points_to_czk: null,
      activeValue: null,
      fields: [
        {
          key: 'logo_picture',
          label: ''
        },
        {
          key: 'title',
          label: 'Tenant'
        },
        {
          key: 'value',
          label: 'Value of 1 point in CZK'
        }
      ]
    }
  },
  computed: {
    loyaltySettings () {
      return this.$store.getters['settings/getLoyaltySettings']
    },
    valuePointsList () {
      return this.$store.getters['settings/getValuePointsList']
    }
  },
  created () {
    this.$store.commit('dictionaries/UPDATE_SOURCE', 'settings')
  },
  methods: {
    saveData () {
      this.$store.dispatch('settings/updateCurrentSetting', {
        field: 'points_to_czk',
        value: this.points_to_czk
      })
    },
    updateValue (value) {
      this.points_to_czk = value
    },
    setActiveValue (activeValue) {
      this.activeValue = activeValue
    },
    blurValue (index, id) {
      this.$store.dispatch('settings/updateCurrentPointValue', { id, value: this.valuePointsList[index].settings[0].value })
    },
    updateTenantValue (value, index) {
      this.$store.commit('settings/UPDATE_VALUE_POINT', { value, index })
    },
    async tenantSearching (value) {
      this.tenantsSearch = value
      if (value.split('').length > 2) {
        this.$store.commit('dictionaries/UPDATE_SEARCH_MODE', true)
        await this.$store.commit('dictionaries/UPDATE_FILTER', { field: 'title', value: this.tenantsSearch })
      } else if (value === '') {
        this.$store.commit('dictionaries/UPDATE_SEARCH_MODE', false)
        await this.$store.commit('dictionaries/UPDATE_FILTER', { field: 'title', value: null })
        await this.$store.dispatch('settings/fetchValuePointsList', { page: 1, perPage: 10 })
      }
    }
  }
}
</script>
