<template>
  <div class="loyalty-redeems">
    <span class="loyalty-redeems-title">Redeems</span>
    <div class="loyalty-redeems-head justify-content-between">
      <div class="d-flex align-items-center">
        <div
          v-if="selectedReward.title"
          class="filter_chips-chip"
        >
          <span v-text="selectedReward.title" />
          <smq-icon-close @click.native="resetCurrentFilter('reward_id')" />
        </div>
        <smq-form-dropdown
          v-else-if="tenants && tenants.length"
          class="loyalty-receipts-head-dropdown"
          :items="rewards"
          :width="160"
          placeholder="Reward"
          dropdown-type="filter"
          filter-type="reward_id"
          @selected-item="redeemFilterChanged($event, 'reward_id')"
        />
        <b-skeleton v-else type="input" width="160px" class="mr-2" />
        <div
          v-if="selectedStore.title"
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
          filter-type="company_id"
          @selected-item="redeemFilterChanged($event, 'company_id')"
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
          :items="redeemStatuses"
          :width="160"
          placeholder="Status"
          dropdown-type="filter"
          filter-type="status"
          @selected-item="redeemFilterChanged($event, 'status')"
        />
        <b-skeleton v-else type="input" width="160px" class="mr-4" />
        <div v-if="tenants && tenants.length" class="loyalty-redeems-head-reset" @click="resetFilter">
          <smq-icon-restart class="loyalty-redeems-head-reset-icon" />
          <span class="loyalty-redeems-head-reset-text">Reset filter</span>
        </div>
        <b-skeleton v-else type="text" width="90px" class="ml-2" />
      </div>
      <smq-form-input
        v-if="tenants && tenants.length"
        v-model="redeemsSearch"
        class="m-0"
        placeholder="Search..."
        dropdown-type="filter"
        prepend="search"
        @changed-value="redeemsSearching"
      />
      <b-skeleton v-else type="input" width="215px" />
    </div>
    <b-table
      v-if="redeems && redeems.length"
      :fields="fields"
      :items="redeems"
      head-variant="gray-200"
      class="smq-table"
      :sort-by.sync="sortBy"
      :sort-desc.sync="sortDesc"
      @row-clicked="rowClicked"
    >
      <template v-slot:cell(image)="row">
        <img
          v-if="row.item.reward && row.item.reward.photo_link"
          :src="row.item.reward.photo_link"
          :alt="`${row.item.id}-image`"
          class="smq-table-tenant_logo"
        />
        <smq-icon-image-square v-else />
      </template>
      <template v-slot:cell(offer_name)="row">
        <span class="smq-table-text -primary" v-text="row.item.reward.title"/>
      </template>
      <template v-slot:cell(customer)="row">
        <span
          v-if="row.item.customer"
          class="smq-table-text"
          v-text="`${row.item.customer.first_name} ${row.item.customer.last_name}`"
        />
      </template>
      <template v-slot:cell(store)="row">
        <span class="smq-table-text" v-text="row.item.company.store_name"/>
      </template>
      <template v-slot:cell(redeem_date)="row">
        <span class="smq-table-text" v-text="moment(row.item.created_at).format('DD.MM.YYYY')"/>
      </template>
      <template v-slot:cell(status)="row">
        <span
          class="smq-table-status"
          :class="`-${getRedeemStatus(row.item.status)}`"
          v-text="getRedeemStatus(row.item.status)"
        />
      </template>
    </b-table>
    <div v-else-if="searchMode">
      <search-error :query="filter.search_customer" />
    </div>
    <smq-form-pagination />
    <b-modal v-model="isCurrentRedeemShown" hide-header hide-footer centered hide-backdrop>
      <template #default="{ close }">
        <loyalty-redeems-current-redeem :close="close" />
      </template>
    </b-modal>
  </div>
</template>

<script>
import moment from 'moment'
import SmqIconRestart from '~/components/icons/smq-icon-restart'
import SmqIconImageSquare from '~/components/icons/smq-icon-image-square'
import SmqFormPagination from '~/components/forms/smq-form-pagination'
// import SmqFormDatepickerMultiple from '~/components/forms/smq-form-datepicker-multiple'
import SmqFormDropdown from '~/components/forms/smq-form-dropdown'
import SmqFormInput from '~/components/forms/smq-form-input'
import LoyaltyRedeemsCurrentRedeem from '~/components/loyalty/redeems/loyaltyRedeemsCurrentRedeem'
import SearchError from '~/components/searchError'
import SmqIconClose from '~/components/icons/smq-icon-close'
export default {
  name: 'LoyaltyRedeems',
  components: {
    SmqIconClose,
    SearchError,
    LoyaltyRedeemsCurrentRedeem,
    SmqFormInput,
    SmqFormDropdown,
    // SmqFormDatepickerMultiple,
    SmqFormPagination,
    SmqIconImageSquare,
    SmqIconRestart
  },
  data () {
    return {
      moment,
      selectedReward: { title: null, flag: null },
      selectedStore: { title: null, flag: null },
      selectedStatus: { title: null, flag: null },
      isCurrentRedeemShown: false,
      sortBy: null,
      sortDesc: false,
      redeemsSearch: null,
      fields: [
        {
          key: 'image',
          label: ''
        },
        {
          key: 'offer_name',
          label: 'Offer name'
        },
        {
          key: 'customer',
          label: 'Customer'
        },
        {
          key: 'store',
          label: 'Store'
        },
        {
          key: 'redeem_date',
          label: 'Redeem date',
          sortable: true
        },
        {
          key: 'status',
          label: 'Status',
          sortable: true
        }
      ],
      items: []
    }
  },
  watch: {
    sortDesc (newValue) {
      this.$store.commit('dictionaries/UPDATE_SORTING', { order_by: this.sortBy === 'redeem_date' ? 'created_at' : this.sortBy, asc_desc: newValue ? 'asc' : 'desc' })
    },
    sortBy (newValue) {
      this.$store.commit('dictionaries/UPDATE_SORTING', { order_by: this.sortBy === 'redeem_date' ? 'created_at' : this.sortBy, asc_desc: newValue ? 'asc' : 'desc' })
    },
    status (newValue) {
      switch (newValue) {
        case 'redeem-successfully-updated':
          this.isCurrentRedeemShown = false
          break
      }
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
    status () {
      return this.$store.getters['dictionaries/getStatus']
    },
    redeems () {
      return this.$store.getters['redeems/getRedeems']
    },
    tenants () {
      return this.$store.getters['tenants/getTenantsList'].map((tenant) => {
        return {
          title: tenant.title,
          flag: String(tenant.id)
        }
      })
    },
    rewards () {
      return this.$store.getters['rewards/getRewardsList'].map((reward) => {
        return {
          title: reward.name,
          flag: String(reward.id)
        }
      })
    },
    redeemStatuses () {
      return this.$store.getters['dictionaries/getRedeemStatuses']
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
    this.$store.dispatch('dictionaries/updateSortPaginationFilter', this.$route.query)
    this.$store.dispatch('rewards/fetchRewardsList')
    this.$store.commit('dictionaries/UPDATE_SOURCE', 'redeems')
  },
  methods: {
    setFilters () {
      if (this.routeQuery && this.routeQuery.company_id) {
        this.selectedStore = this.tenants.find(tenant => tenant.flag === this.routeQuery.company_id)
      }
      if (this.routeQuery && this.routeQuery.status) {
        this.selectedStatus = this.redeemStatuses.find(status => status.flag === this.routeQuery.status)
      }
      if (this.routeQuery && this.routeQuery.reward_id) {
        this.selectedReward = this.rewards.find(status => status.flag === this.routeQuery.reward_id)
      }
      if (this.routeQuery && this.routeQuery.search_customer) {
        this.redeemsSearch = this.routeQuery.search_customer
      }
    },
    getRedeemStatus (status) {
      if (status === 1) {
        return 'redeemed'
      } else if (status === 0) {
        return 'activated'
      } else if (status === 2) {
        return 'canceled'
      } else {
        return null
      }
    },
    redeemFilterChanged (value, field) {
      if (field === 'reward_id') {
        this.selectedReward = value
      } else if (field === 'company_id') {
        this.selectedStore = value
      } else if (field === 'status') {
        this.selectedStatus = value
      }
      this.$store.commit('dictionaries/UPDATE_FILTER', { field, value: value.flag })
    },
    resetFilter () {
      this.redeemsSearch = null
      this.selectedReward = { title: null, flag: null }
      this.selectedStore = { title: null, flag: null }
      this.selectedStatus = { title: null, flag: null }
      this.$store.dispatch('dictionaries/resetFilter')
    },
    rowClicked (row) {
      if (row.status !== 2) {
        this.$store.commit('redeems/SAVE_CURRENT_REDEEM', row)
        this.isCurrentRedeemShown = true
      }
    },
    async redeemsSearching (value) {
      this.redeemsSearch = value
      if (value.split('').length > 2) {
        this.$store.commit('dictionaries/UPDATE_SEARCH_MODE', true)
        await this.$store.commit('dictionaries/UPDATE_FILTER', { field: 'search_customer', value: this.redeemsSearch })
      } else if (value === '') {
        this.$store.commit('dictionaries/UPDATE_SEARCH_MODE', false)
        await this.$store.commit('dictionaries/UPDATE_FILTER', { field: 'search_customer', value: null })
        await this.$store.dispatch('redeems/fetchRedeems', { page: 1, perPage: 10 })
      }
    },
    async resetCurrentFilter (field) {
      if (field === 'reward_id') {
        this.selectedReward = { title: null, flag: null }
      } else if (field === 'company_id') {
        this.selectedStore = { title: null, flag: null }
      } else if (field === 'status') {
        this.selectedStatus = { title: null, flag: null }
      }
      await this.$store.commit('dictionaries/UPDATE_FILTER', { field, value: null })
      await this.$store.dispatch('dictionaries/sendPageData')
    }
  }
}
</script>
