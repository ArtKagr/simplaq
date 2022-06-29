<template>
  <div class="loyalty-receipts">
    <div class="d-flex flex-column">
      <span class="loyalty-receipts-title">Receipts</span>
      <div class="loyalty-receipts-head">
        <div class="d-flex align-items-center">
          <b-skeleton v-if="tenants && !tenants.length" type="input" width="217px" class="mr-2" />
          <div
            v-else-if="filter.date_from || filter.date_to"
            class="filter_chips-chip -dates"
          >
            <span v-text="moment(filter.date_from).format('DD.MM.YYYY') + ' - ' + moment(filter.date_to).format('DD.MM.YYYY')" />
            <smq-icon-close @click.native="resetCurrentFilter('date')" />
          </div>
          <smq-form-datepicker-multiple v-else-if="tenants && tenants.length" class="loyalty-receipts-head-multiple_picker" />
          <div
            v-if="selectedStore && selectedStore.title"
            class="filter_chips-chip"
          >
            <span v-text="selectedStore.title" />
            <smq-icon-close @click.native="resetCurrentFilter('company_id')" />
          </div>
          <smq-form-dropdown
            v-else-if="tenants && tenants.length"
            class="loyalty-receipts-head-dropdown"
            :items="tenants"
            :width="160"
            placeholder="Store"
            dropdown-type="filter"
            @selected-item="receiptFilterChanged($event, 'company_id')"
          />
          <b-skeleton v-else type="input" width="160px" class="mr-2" />
          <div
            v-if="selectedStatus.title"
            class="filter_chips-chip"
          >
            <span v-text="selectedStatus.title" />
            <smq-icon-close @click.native="resetCurrentFilter('status')" />
          </div>
          <smq-form-dropdown
            v-else-if="tenants && tenants.length"
            class="loyalty-receipts-head-dropdown"
            :items="receiptStatuses"
            :width="160"
            placeholder="Status"
            dropdown-type="filter"
            filter-field="status"
            @selected-item="receiptFilterChanged($event, 'status')"
          />
          <b-skeleton v-else type="input" width="160px" class="mr-2" />
          <div class="loyalty-receipts-head-search mr-2">
            <smq-form-input
              v-if="tenants && tenants.length"
              v-model="total_from"
              prepend="total_from"
              :width="160"
              class="m-0"
              type="number"
              filter-field="total_from"
              @changed-value="receiptTotalFilterChanged($event, 'total_from')"
              @value-changed="receiptFilterChanged({ flag: total_from }, 'total_from')"
            />
            <b-skeleton v-else type="input" width="160px" class="mr-2" />
          </div>
          <div class="loyalty-receipts-head-search">
            <smq-form-input
              v-if="tenants && tenants.length"
              v-model="total_to"
              prepend="total_to"
              :width="160"
              class="m-0"
              type="number"
              filter-field="total_to"
              @changed-value="receiptTotalFilterChanged($event, 'total_to')"
              @value-changed="receiptFilterChanged({ flag: total_to }, 'total_to')"
            />
            <b-skeleton v-else type="input" width="160px" class="mr-4" />
          </div>
          <div
            v-if="tenants && tenants.length"
            class="loyalty-receipts-head-reset"
            @click="resetFilter"
          >
            <smq-icon-restart class="loyalty-receipts-head-reset-icon" />
            <span class="loyalty-receipts-head-reset-text">Reset filter</span>
          </div>
          <b-skeleton v-else type="text" width="90px" />
        </div>
        <div class="loyalty-receipts-head-search">
          <smq-form-input
            v-if="tenants && tenants.length"
            v-model="receiptsSearch"
            class="m-0"
            placeholder="Search..."
            dropdown-type="filter"
            prepend="search"
            @changed-value="receiptsSearching"
          />
          <b-skeleton v-else type="input" width="215px" />
        </div>
      </div>
      <b-table
        v-if="receipts && receipts.length"
        :fields="fields"
        :items="receipts"
        head-variant="gray-200"
        class="smq-table"
        :sort-by.sync="sortBy"
        :sort-desc.sync="sortDesc"
      >
        <template v-slot:cell(image)="row">
          <nuxt-link
            style="height: 48px;"
            class="d-flex w-100 smq-table-person"
            :to="`/loyalty/receipts/${row.item.id}`"
          >
            <img
              v-if="row.item.company && row.item.company.logo_picture"
              class="smq-table-receipt_logo"
              :src="row.item.company.logo_picture"
              :alt="`company_logo-${row.item.company.id}`"
            />
            <smq-icon-table-logo v-else />
          </nuxt-link>
        </template>
        <template v-slot:cell(customer)="row">
          <nuxt-link
            style="height: 48px;"
            class="d-flex w-100 smq-table-person"
            :to="`/loyalty/receipts/${row.item.id}`"
          >
            <span
              class="smq-table-person-first"
              v-text="row.item.customer.first_name"
            />
            <span
              class="smq-table-person-last"
              v-text="row.item.customer.last_name"
            />
          </nuxt-link>
        </template>
        <template v-slot:cell(date)="row">
          <nuxt-link
            style="height: 48px;"
            class="d-flex w-100 smq-table-person"
            :to="`/loyalty/receipts/${row.item.id}`"
          >
            <span v-text="moment(row.item.date).format('DD.MM.YYYY')" />
          </nuxt-link>
        </template>
        <template v-slot:cell(store)="row">
          <nuxt-link
            style="height: 48px;"
            class="d-flex w-100 smq-table-person"
            :to="`/loyalty/receipts/${row.item.id}`"
          >
            <span v-text="row.item.company && row.item.company.store_name ? row.item.company.store_name : null" />
          </nuxt-link>
        </template>
        <template v-slot:cell(value)="row">
          <nuxt-link
            style="height: 48px;"
            class="d-flex w-100 smq-table-person"
            :to="`/loyalty/receipts/${row.item.id}`"
          >
            <span v-text="row.item.total + ' ' + (row.item.currency && row.item.currency.code ? row.item.currency.code : '')" />
          </nuxt-link>
        </template>
        <template v-slot:cell(status)="row">
          <nuxt-link
            style="height: 48px;"
            class="d-flex w-100 smq-table-person"
            :to="`/loyalty/receipts/${row.item.id}`"
          >
            <span
              class="smq-table-status"
              :class="`-${getReceiptStatus(row.item.status)}`"
              v-text="getReceiptStatus(row.item.status) === 'in_review' ? 'in review' : getReceiptStatus(row.item.status)"
            />
          </nuxt-link>
        </template>
      </b-table>
      <div v-else-if="searchMode">
        <search-error :query="filter.search_customer" />
      </div>
    </div>
    <smq-form-pagination />
  </div>
</template>

<script>
import moment from 'moment'
import SmqFormDropdown from '~/components/forms/smq-form-dropdown'
import SmqIconRestart from '~/components/icons/smq-icon-restart'
import SmqIconTableLogo from '~/components/icons/smq-icon-table-logo'
import SmqFormPagination from '~/components/forms/smq-form-pagination'
import SmqFormDatepickerMultiple from '~/components/forms/smq-form-datepicker-multiple'
import SmqFormInput from '~/components/forms/smq-form-input'
import SearchError from '~/components/searchError'
import SmqIconClose from '~/components/icons/smq-icon-close'
export default {
  name: 'LoyaltyReceipts',
  components: {
    SmqIconClose,
    SearchError,
    SmqFormInput,
    SmqFormDatepickerMultiple,
    SmqIconTableLogo,
    SmqIconRestart,
    SmqFormDropdown,
    SmqFormPagination
  },
  data () {
    return {
      moment,
      selectedStore: { title: null, flag: null },
      selectedStatus: { title: null, flag: null },
      receiptsSearch: null,
      sortBy: null,
      sortDesc: false,
      total_from: null,
      total_to: null,
      fields: [
        {
          key: 'image',
          label: ''
        },
        {
          key: 'customer',
          label: 'Customer'
        },
        {
          key: 'date',
          label: 'Date',
          sortable: true
        },
        {
          key: 'store',
          label: 'Store'
        },
        {
          key: 'value',
          label: 'Value'
        },
        {
          key: 'status',
          label: 'Status',
          sortable: true
        }
      ]
    }
  },
  watch: {
    sortDesc (newValue) {
      this.$store.commit('dictionaries/UPDATE_SORTING', { order_by: this.sortBy, asc_desc: newValue ? 'asc' : 'desc' })
    },
    sortBy (newValue) {
      this.$store.commit('dictionaries/UPDATE_SORTING', { order_by: newValue, asc_desc: this.sortDesc ? 'asc' : 'desc' })
    },
    resetFilterFlag () {
      this.total_from = null
    },
    tenants: {
      handler (newValue) {
        if (newValue && newValue.length) {
          this.setFilters()
        }
      },
      deep: true
    }
  },
  computed: {
    resetFilterFlag () {
      return this.$store.getters['dictionaries/getResetFilter']
    },
    receipts () {
      return this.$store.getters['receipts/getReceipts']
    },
    sort () {
      return this.$store.getters['dictionaries/getSort']
    },
    receiptStatuses () {
      return this.$store.getters['dictionaries/getReceiptStatuses']
    },
    tenants () {
      return this.$store.getters['tenants/getTenantsList'].map((tenant) => {
        return {
          title: tenant.title,
          flag: String(tenant.id)
        }
      })
    },
    searchMode () {
      return this.$store.getters['dictionaries/getSearchMode']
    },
    filter () {
      return this.$store.getters['dictionaries/getFilter']
    },
    routeQuery () {
      return JSON.parse(JSON.stringify(this.$route.query))
    },
    localeStorageUrl () {
      return JSON.parse(localStorage.getItem('routeUrl')) ? JSON.parse(localStorage.getItem('routeUrl')) : {}
    },
    childPageIsOpen () {
      return this.$store.getters['dictionaries/getChildPageIsOpen']
    },
    isRouteQuery () {
      return Object.keys(this.routeQuery).length
    }
  },
  created () {
    this.$store.dispatch('dictionaries/updateSortPaginationFilter', this.isRouteQuery ? this.routeQuery : this.localeStorageUrl)
    this.$store.commit('dictionaries/UPDATE_SOURCE', 'receipts')
  },
  mounted () {
    this.setFilters()
  },
  destroyed () {
    localStorage.removeItem('routeUrl')
  },
  methods: {
    setFilters () {
      if (this.routeQuery && this.routeQuery.date_from && this.routeQuery.date_to) {
        this.$store.commit('dictionaries/UPDATE_FILTER', { field: 'date_from', value: this.routeQuery.date_from })
        this.$store.commit('dictionaries/UPDATE_FILTER', { field: 'date_to', value: this.routeQuery.date_to })
      } else if (this.localeStorageUrl && this.localeStorageUrl.date_from && this.localeStorageUrl.date_to) {
        this.$store.commit('dictionaries/UPDATE_FILTER', { field: 'date_from', value: this.localeStorageUrl.date_from })
        this.$store.commit('dictionaries/UPDATE_FILTER', { field: 'date_to', value: this.localeStorageUrl.date_to })
      }
      if (this.routeQuery && this.routeQuery.company_id) {
        this.selectedStore = this.tenants.find(tenant => tenant.flag === this.routeQuery.company_id)
      } else if (this.localeStorageUrl && this.localeStorageUrl.company_id) {
        this.selectedStore = this.tenants.find(tenant => tenant.flag === this.localeStorageUrl.company_id)
      }
      if (this.routeQuery && this.routeQuery.status) {
        this.selectedStatus = this.receiptStatuses.find(status => status.flag === this.routeQuery.status)
      } else if (this.localeStorageUrl && this.localeStorageUrl.status) {
        this.selectedStatus = this.receiptStatuses.find(status => status.flag === this.localeStorageUrl.status)
      }
      if (this.routeQuery && this.routeQuery.total_from) {
        this.total_from = this.routeQuery.total_from
      } else if (this.localeStorageUrl && this.localeStorageUrl.total_from) {
        this.total_from = this.localeStorageUrl.total_from
      }
      if (this.routeQuery && this.routeQuery.total_to) {
        this.total_to = this.routeQuery.total_to
      } else if (this.localeStorageUrl && this.localeStorageUrl.total_to) {
        this.total_to = this.localeStorageUrl.total_to
      }
      if (this.routeQuery && this.routeQuery.search_customer) {
        this.receiptsSearch = this.routeQuery.search_customer
      } else if (this.localeStorageUrl && this.localeStorageUrl.search_customer) {
        this.receiptsSearch = this.localeStorageUrl.search_customer
      }
    },
    rowClicked (item) {
      this.$router.push(`/loyalty/receipts/${item.id}`)
    },
    getReceiptStatus (status) {
      if (status === 0) {
        return 'in_review'
      } else if (status === 1) {
        return 'approved'
      } else if (status === 2) {
        return 'rejected'
      }
    },
    receiptFilterChanged (value, field) {
      if (field === 'company_id') {
        this.selectedStore = value
      } else if (field === 'status') {
        this.selectedStatus = value
      }
      this.$store.commit('dictionaries/UPDATE_FILTER', { field, value: value.flag })
    },
    receiptTotalFilterChanged (value, field) {
      this[field] = value
    },
    resetFilter () {
      this.selectedStore = { title: null, flag: null }
      this.selectedStatus = { title: null, flag: null }
      this.total_from = null
      this.total_to = null
      this.receiptsSearch = null
      this.$store.dispatch('dictionaries/resetFilter')
    },
    async receiptsSearching (value) {
      this.receiptsSearch = value
      if (value.split('').length > 2) {
        this.$store.commit('dictionaries/UPDATE_SEARCH_MODE', true)
        await this.$store.commit('dictionaries/UPDATE_FILTER', { field: 'search_customer', value: this.receiptsSearch })
      } else if (value === '') {
        this.$store.commit('dictionaries/UPDATE_SEARCH_MODE', false)
        await this.$store.commit('dictionaries/UPDATE_FILTER', { field: 'search_customer', value: null })
        await this.$store.dispatch('receipts/fetchReceipts', { page: 1, perPage: 10 })
      }
    },
    async resetCurrentFilter (field) {
      if (field === 'date') {
        await this.$store.commit('dictionaries/UPDATE_FILTER', { field: 'date_from', value: null })
        await this.$store.commit('dictionaries/UPDATE_FILTER', { field: 'date_to', value: null })
      } else {
        if (field === 'company_id') {
          this.selectedStore = { title: null, flag: null }
        } else if (field === 'status') {
          this.selectedStatus = { title: null, flag: null }
        }
        await this.$store.commit('dictionaries/UPDATE_FILTER', { field, value: null })
      }
      await this.$store.dispatch('dictionaries/sendPageData')
    }
  }
}
</script>
