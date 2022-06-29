<template>
  <div class="data_assets-customers">
    <span class="data_assets-customers-title">Customers</span>
    <div class="data_assets-customers-head">
      <!--      <smq-form-datepicker-multiple class="loyalty-receipts-head-multiple_picker" />-->
      <!--      <div class="loyalty-redeems-head-reset" @click="resetFilter">-->
      <!--        <smq-icon-restart class="loyalty-redeems-head-reset-icon" />-->
      <!--        <span class="loyalty-redeems-head-reset-text">Reset filter</span>-->
      <!--      </div>-->
      <div class="loyalty-receipts-head-search">
        <smq-form-input
          v-model="customerSearch"
          class="m-0"
          placeholder="Search..."
          dropdown-type="filter"
          prepend="search"
          @changed-value="customersSearching"
        />
      </div>
    </div>
    <b-table
      v-if="customers && customers.length"
      :fields="fields"
      :items="customers"
      head-variant="gray-200"
      class="smq-table"
      :sort-by.sync="sortBy"
      :sort-desc.sync="sortDesc"
      @row-clicked="rowClicked"
    >
      <template v-slot:cell(profile_photo)="row">
        <img
          class="smq-table-receipt_logo"
          v-if="row.item && row.item.profile_photo"
          :src="row.item.profile_photo"
          :alt="`photo-${row.iten.firestore_customer_id}`"
        />
        <smq-icon-table-logo v-else />
      </template>
      <template v-slot:cell(first_name)="row">
        <div class="d-flex flex-column">
          <div v-if="row.item.first_name || row.item.last_name" class="d-flex align-items-center">
            <span
              v-if="row.item.first_name"
              class="smq-table-text -primary_bold mr-1"
              v-text="row.item.first_name"
            />
            <span
              v-if="row.item.last_name"
              class="smq-table-text -primary_bold"
              v-text="row.item.last_name"
            />
          </div>
          <span class="smq-table-text -description" v-text="row.item.email"/>
        </div>
      </template>
      <template v-slot:cell(points)="row">
        <span class="smq-table-text" v-text="row.item.customer_point && row.item.customer_point.points ? row.item.customer_point.points : null"/>
      </template>
      <template v-slot:cell(registered)="row">
        <span class="smq-table-text" v-text="row.item.firestore_customer && row.item.firestore_customer.created_at ? moment(row.item.firestore_customer.created_at).format('DD.MM.YYYY') : null"/>
      </template>
      <template v-slot:cell(action)>
        <smq-icon-dots-horizontal class="smq-table-dots -vertical" />
      </template>
    </b-table>
    <div v-else-if="searchMode">
      <search-error :query="filter.search_customer" />
    </div>
    <smq-form-pagination />
  </div>
</template>

<script>
import moment from 'moment'
import SmqIconTableLogo from '~/components/icons/smq-icon-table-logo'
import SmqIconDotsHorizontal from '~/components/icons/smq-icon-dots-horizontal'
import SmqFormPagination from '~/components/forms/smq-form-pagination'
import SmqFormInput from '~/components/forms/smq-form-input'
import SearchError from '~/components/searchError'
// import SmqIconRestart from '~/components/icons/smq-icon-restart'
// import SmqFormDatepickerMultiple from '~/components/forms/smq-form-datepicker-multiple'
export default {
  name: 'DataAssetsCustomers',
  components: {
    SearchError,
    SmqFormInput,
    SmqFormPagination,
    SmqIconDotsHorizontal,
    SmqIconTableLogo
    // SmqFormDatepickerMultiple,
    // SmqIconRestart
  },
  data () {
    return {
      moment,
      sortBy: null,
      sortDesc: false,
      customerSearch: null,
      fields: [
        {
          key: 'profile_photo',
          label: ''
        },
        {
          key: 'first_name',
          label: 'Customer'
        },
        {
          key: 'location',
          label: 'Location'
        },
        {
          key: 'points',
          label: 'Points'
        },
        {
          key: 'redeems',
          label: 'Redeems'
        },
        {
          key: 'registered',
          label: 'Registered'
        },
        {
          key: 'action',
          label: 'Action'
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
    }
  },
  computed: {
    customers () {
      return this.$store.getters['customers/getCustomers']
    },
    searchMode () {
      return this.$store.getters['dictionaries/getSearchMode']
    },
    filter () {
      return this.$store.getters['dictionaries/getFilter']
    },
    routeQuery () {
      return JSON.parse(JSON.stringify(this.$route.query))
    }
  },
  created () {
    this.$store.dispatch('dictionaries/updateSortPaginationFilter', this.routeQuery)
    this.$store.commit('dictionaries/UPDATE_SOURCE', 'customers')
    this.setFilters()
  },
  methods: {
    setFilters () {
      if (this.routeQuery && this.routeQuery.search_customer) {
        this.customerSearch = this.routeQuery.search_customer
      }
    },
    rowClicked (row) {
      console.warn('row', row)
    },
    resetFilter () {
      this.$store.dispatch('dictionaries/resetFilter')
    },
    async customersSearching (value) {
      this.customerSearch = value
      if (value.split('').length > 2) {
        this.$store.commit('dictionaries/UPDATE_SEARCH_MODE', true)
        await this.$store.commit('dictionaries/UPDATE_FILTER', { field: 'search_customer', value: this.customerSearch })
      } else if (value === '') {
        this.$store.commit('dictionaries/UPDATE_SEARCH_MODE', false)
        await this.$store.commit('dictionaries/UPDATE_FILTER', { field: 'search_customer', value: null })
        await this.$store.dispatch('customers/fetchCustomers', { page: 1, perPage: 10 })
      }
    }
  }
}
</script>
