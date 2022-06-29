<template>
  <div class="loyalty-vouchers">
    <div class="d-flex flex-column">
      <div class="loyalty-vouchers-head">
        <span class="loyalty-vouchers-head-title">Vouchers</span>
        <b-button
          class="loyalty-vouchers-head-button"
          variant="primary"
          @click="showVoucherCreate"
        >
          <div class="loyalty-vouchers-head-button-icon">
            <smq-icon-plus />
          </div>
          <span class="loyalty-vouchers-head-button-text">New voucher</span>
        </b-button>
      </div>
      <div class="loyalty-vouchers-search_container">
        <div class="d-flex align-items-center">
          <div
            v-if="selectedStatus.title"
            class="filter_chips-chip"
          >
            <span v-text="selectedStatus.title" />
            <smq-icon-close @click.native="resetCurrentFilter('status')" />
          </div>
          <smq-form-dropdown
            v-else
            class="loyalty-receipts-head-dropdown"
            :items="voucherStatuses"
            :width="160"
            placeholder="Status"
            dropdown-type="filter"
            @selected-item="voucherFilterChanged($event, 'status')"
          />
          <div class="loyalty-redeems-head-reset" @click="resetFilter">
            <smq-icon-restart class="loyalty-redeems-head-reset-icon" />
            <span class="loyalty-redeems-head-reset-text">Reset filter</span>
          </div>
        </div>
        <div class="loyalty-receipts-head-search">
          <smq-form-input
            v-model="voucherSearch"
            class="m-0"
            placeholder="Search..."
            dropdown-type="filter"
            prepend="search"
            @changed-value="vouchersSearching"
          />
        </div>
      </div>
      <b-table
        v-if="vouchers && vouchers.length"
        :fields="fields"
        :items="vouchers"
        head-variant="gray-200"
        class="smq-table"
        @row-clicked="rowClicked"
      >
        <template v-slot:head(is_select)>
          <smq-icon-checkbox-blank-outline class="smq-table-checkbox -head" />
        </template>
        <template v-slot:cell(is_select)>
          <smq-icon-checkbox-blank-outline class="smq-table-checkbox" />
        </template>
        <template v-slot:cell(title)="row">
          <span class="smq-table-cell" v-text="row.item.title" />
        </template>
        <template v-slot:cell(valid_to)="row">
          <span class="smq-table-cell" v-text="moment(row.item.valid_to).format('DD.MM.YYYY')" />
        </template>
        <template v-slot:cell(status)="row">
          <span
            class="smq-table-status"
            :class="`-${getTenantsStatusClass(row.item.status)}`"
            v-text="getTenantsStatus(row.item.status)"
          />
        </template>
        <template v-slot:cell(action)>
          <smq-icon-dots-horizontal class="smq-table-dots -vertical" />
        </template>
      </b-table>
      <div v-else-if="searchMode">
        <search-error :query="filter.title" />
      </div>
    </div>
    <smq-form-pagination />
    <b-modal v-model="isVoucherCreateShown" hide-header hide-footer centered hide-backdrop>
      <template #default="{ close }">
        <loyalty-vouchers-create :close="close"  />
      </template>
    </b-modal>
    <b-modal v-model="isCurrentVoucherShown" hide-header hide-footer centered hide-backdrop>
      <template #default="{ close }">
        <loyalty-vouchers-current-voucher :close="close"  />
      </template>
    </b-modal>
  </div>
</template>

<script>
import moment from 'moment'
import SmqIconCheckboxBlankOutline from '~/components/icons/smq-icon-checkbox-blank-outline'
import SmqIconDotsHorizontal from '~/components/icons/smq-icon-dots-horizontal'
import SmqIconPlus from '~/components/icons/smq-icon-plus'
import SmqFormPagination from '~/components/forms/smq-form-pagination'
import LoyaltyVouchersCreate from '~/components/loyalty/vouchers/loyaltyVouchersCreate'
import LoyaltyVouchersCurrentVoucher from '~/components/loyalty/vouchers/loyaltyVouchersCurrentVoucher'
import SmqFormInput from '~/components/forms/smq-form-input'
import SearchError from '~/components/searchError'
import SmqIconClose from '~/components/icons/smq-icon-close'
import SmqFormDropdown from '~/components/forms/smq-form-dropdown'
import SmqIconRestart from '~/components/icons/smq-icon-restart'
// import SmqFormDatepickerMultiple from '~/components/forms/smq-form-datepicker-multiple'
// import SmqIconRestart from '~/components/icons/smq-icon-restart'
export default {
  name: 'LoyaltyVouchers',
  components: {
    SmqIconRestart,
    SmqFormDropdown,
    SmqIconClose,
    SearchError,
    SmqFormInput,
    LoyaltyVouchersCurrentVoucher,
    LoyaltyVouchersCreate,
    SmqIconPlus,
    SmqIconCheckboxBlankOutline,
    SmqIconDotsHorizontal,
    SmqFormPagination
    // SmqIconRestart,
    // SmqFormDatepickerMultiple,
  },
  data () {
    return {
      moment,
      selectedStatus: { title: null, flag: null },
      voucherSearch: null,
      isVoucherCreateShown: false,
      isCurrentVoucherShown: false,
      items: [
        { title: 'Actions', flag: 'actions' },
        { title: 'Remove', flag: 'remove' }
      ],
      fields: [
        {
          key: 'is_select',
          label: ''
        },
        {
          key: 'title',
          label: 'Voucher name',
          class: 'w-50'
        },
        {
          key: 'points',
          label: 'Give points'
        },
        {
          key: 'valid_to',
          label: 'Expiration date'
        },
        {
          key: 'quantity_issued',
          label: 'Vouchers issued'
        },
        {
          key: 'status',
          label: 'Status'
        },
        {
          key: 'action',
          label: 'Action'
        }
      ]
    }
  },
  computed: {
    vouchers () {
      return this.$store.getters['vouchers/getVouchers']
    },
    status () {
      return this.$store.getters['dictionaries/getStatus']
    },
    searchMode () {
      return this.$store.getters['dictionaries/getSearchMode']
    },
    filter () {
      return this.$store.getters['dictionaries/getFilter']
    },
    statuses () {
      return this.$store.getters['dictionaries/getStatuses']
    },
    voucherStatuses () {
      return this.$store.getters['dictionaries/getVoucherStatuses']
    },
    routeQuery () {
      return JSON.parse(JSON.stringify(this.$route.query))
    }
  },
  created () {
    this.$store.dispatch('dictionaries/updateSortPaginationFilter', this.routeQuery)
    this.$store.commit('dictionaries/UPDATE_SOURCE', 'vouchers')
    this.setFilters()
  },
  watch: {
    status (newValue) {
      switch (newValue) {
        case 'voucher-successfully-created':
          this.isVoucherCreateShown = false
          break
        case 'voucher-successfully-updated':
          this.isCurrentVoucherShown = false
          break
        case 'voucher-successfully-deleted':
          this.isCurrentVoucherShown = false
          break
      }
    }
  },
  methods: {
    setFilters () {
      if (this.routeQuery && this.routeQuery.status) {
        this.selectedStatus = this.voucherStatuses.find(status => status.flag === this.routeQuery.status)
      }
      if (this.routeQuery && this.routeQuery.title) {
        this.voucherSearch = this.routeQuery.title
      }
    },
    showVoucherCreate () {
      this.$store.commit('vouchers/SAVE_CURRENT_VOUCHER', {})
      this.isVoucherCreateShown = true
    },
    rowClicked (voucher) {
      this.$store.commit('vouchers/SAVE_CURRENT_VOUCHER', voucher)
      this.isCurrentVoucherShown = true
    },
    resetFilter () {
      this.voucherSearch = null
      this.selectedStatus = { title: null, flag: null }
      this.$store.dispatch('dictionaries/resetFilter')
    },
    async vouchersSearching (value) {
      this.voucherSearch = value
      if (value.split('').length > 2) {
        this.$store.commit('dictionaries/UPDATE_SEARCH_MODE', true)
        await this.$store.commit('dictionaries/UPDATE_FILTER', { field: 'title', value: this.voucherSearch })
      } else if (value === '') {
        this.$store.commit('dictionaries/UPDATE_SEARCH_MODE', false)
        await this.$store.commit('dictionaries/UPDATE_FILTER', { field: 'title', value: null })
        await this.$store.dispatch('vouchers/fetchVouchers', { page: 1, perPage: 10 })
      }
    },
    getTenantsStatusClass (statusFlag) {
      const result = this.statuses.find(status => status.flag === statusFlag)
      return result && result.name ? result.name : 'archived'
    },
    getTenantsStatus (statusFlag) {
      const result = this.statuses.find(status => status.flag === statusFlag)
      return result && result.title ? result.title : 'Archived'
    },
    async resetCurrentFilter (field) {
      this.selectedStatus = { title: null, flag: null }
      await this.$store.commit('dictionaries/UPDATE_FILTER', { field, value: null })
      await this.$store.dispatch('dictionaries/sendPageData')
    },
    voucherFilterChanged (value, field) {
      this.selectedStatus = value
      this.$store.commit('dictionaries/UPDATE_FILTER', { field, value: value.flag })
    }
  }
}
</script>
