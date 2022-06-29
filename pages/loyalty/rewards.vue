<template>
  <div class="loyalty-rewards">
    <div class="d-flex flex-column">
      <div class="loyalty-rewards-head">
        <span class="loyalty-rewards-head-title">Rewards</span>
        <b-button
          class="loyalty-rewards-head-button"
          variant="primary"
          @click="showRewardCreate"
        >
          <div class="loyalty-rewards-head-button-icon">
            <smq-icon-plus />
          </div>
          <span class="loyalty-rewards-head-button-text">New reward</span>
        </b-button>
      </div>
      <div class="loyalty-receipts-head-search mb-4">
        <div class="d-flex align-items-center">
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
            @selected-item="rewardFilterChanged($event, 'company_id')"
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
            :items="rewardStatuses"
            :width="160"
            placeholder="Status"
            dropdown-type="filter"
            @selected-item="rewardFilterChanged($event, 'status')"
          />
          <b-skeleton v-else type="input" width="160px" class="mr-2" />
          <div
            v-if="tenants && tenants.length"
            class="loyalty-receipts-head-reset"
            @click="resetFilter"
          >
            <smq-icon-restart class="loyalty-receipts-head-reset-icon" />
            <span class="loyalty-receipts-head-reset-text">Reset filter</span>
          </div>
          <b-skeleton v-else type="text" width="90px" class="ml-4" />
        </div>
        <smq-form-input
          v-if="tenants && tenants.length"
          v-model="rewardsSearch"
          class="m-0"
          placeholder="Search..."
          dropdown-type="filter"
          prepend="search"
          @changed-value="rewardsSearching"
        />
        <b-skeleton v-else type="input" width="215px" />
      </div>
      <b-table
        v-if="rewards && rewards.length"
        :fields="fields"
        :items="rewards"
        head-variant="gray-200"
        class="smq-table"
        :sort-by.sync="sortBy"
        :sort-desc.sync="sortDesc"
        @row-clicked="rowClicked"
      >
        <template v-slot:cell(photo_link)="row">
          <img
            v-if="row.item && row.item.photo_link"
            class="smq-table-tenant_logo"
            :src="row.item.photo_link"
            :alt="`company_logo-${row.item.id}`"
          />
          <smq-icon-table-logo v-else />
        </template>
        <template v-slot:cell(title)="row">
          <span class="smq-table-text w-100 text-left" v-text="row.item.title" />
        </template>
        <template v-slot:cell(date_to)="row">
          <span class="smq-table-text" v-text="row.item.date_to ? moment(row.item.date_to).format('DD.MM.YYYY') : null" />
        </template>
        <template v-slot:cell(points_cost)="row">
          <span class="smq-table-text -primary" v-text="row.item.points_cost" />
        </template>
        <template v-slot:cell(limit_left)="row">
          <div class="d-flex flex-column align-items-center">
            <span class="mb-3" v-text="row.item.limit_left + '/' + row.item.limit" />
            <b-progress :max="row.item.limit" class="loyalty-rewards-cards-card-scale_container-scale_bar -table">
              <b-progress-bar
                :value="row.item.limit_left"
                variant="primary"
                class="loyalty-rewards-cards-card-scale_container-scale_bar-scale"
              />
            </b-progress>
          </div>
        </template>
        <template v-slot:cell(archived)="row">
          <span
            class="smq-table-status"
            :class="`-${getRewardsStatus(row.item.status)}`"
            v-text="getRewardsStatus(row.item.status)"
          />
        </template>
      </b-table>
      <div v-else-if="searchMode">
        <search-error :query="filter.title" />
      </div>
      <smq-form-pagination />
      <b-modal v-model="isRewardCreateShown" hide-header hide-footer centered hide-backdrop>
        <template #default="{ close }">
          <loyalty-rewards-create
            :close="close"
            :prop-step="propStep"
            :card-type="editedCardType"
            @close-modal="closeCreateRewardModal"
          />
        </template>
      </b-modal>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import SmqIconPlus from '~/components/icons/smq-icon-plus'
import LoyaltyRewardsCreate from '~/components/loyalty/rewards/loyaltyRewardsCreate'
import SmqFormPagination from '~/components/forms/smq-form-pagination'
import SmqFormInput from '~/components/forms/smq-form-input'
import SearchError from '~/components/searchError'
import SmqIconTableLogo from '~/components/icons/smq-icon-table-logo'
import SmqFormDropdown from '~/components/forms/smq-form-dropdown'
import SmqIconRestart from '~/components/icons/smq-icon-restart'
import SmqIconClose from '~/components/icons/smq-icon-close'
export default {
  name: 'LoyaltyRewards',
  components: {
    SmqIconClose,
    SmqIconRestart,
    SmqFormDropdown,
    SmqIconTableLogo,
    SearchError,
    SmqFormInput,
    SmqFormPagination,
    LoyaltyRewardsCreate,
    SmqIconPlus
  },
  data () {
    return {
      moment,
      selectedStore: { title: null, flag: null },
      selectedStatus: { title: null, flag: null },
      sortBy: null,
      sortDesc: false,
      isRewardCreateShown: false,
      propStep: null,
      editedCardType: null,
      rewardsSearch: null,
      fields: [
        {
          key: 'photo_link',
          label: ''
        },
        {
          key: 'title',
          label: 'Offer'
        },
        {
          key: 'points_cost',
          label: 'Points',
          class: 'text-center'
        },
        {
          key: 'company.title',
          label: 'Tenant',
          sortable: true
        },
        {
          key: 'date_to',
          label: 'Valid',
          sortable: true
        },
        {
          key: 'limit_left',
          label: 'Available',
          sortable: true,
          class: 'text-center'
        },
        {
          key: 'archived',
          label: 'Status',
          sortable: true,
          class: 'text-center'
        }
      ]
    }
  },
  watch: {
    sortDesc (newValue) {
      this.$store.commit('dictionaries/UPDATE_SORTING', {
        order_by: this.sortBy === 'company.title' ? 'name' : this.sortBy,
        asc_desc: newValue ? 'asc' : 'desc'
      })
    },
    sortBy (newValue) {
      this.$store.commit('dictionaries/UPDATE_SORTING', {
        order_by: newValue === 'company.title' ? 'name' : newValue,
        asc_desc: this.sortDesc ? 'asc' : 'desc'
      })
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
    tenants () {
      return this.$store.getters['tenants/getTenantsList'].map((tenant) => {
        return {
          title: tenant.title,
          flag: String(tenant.id)
        }
      })
    },
    rewards () {
      return this.$store.getters['rewards/getRewards']
    },
    searchMode () {
      return this.$store.getters['dictionaries/getSearchMode']
    },
    filter () {
      return this.$store.getters['dictionaries/getFilter']
    },
    rewardStatuses () {
      return this.$store.getters['dictionaries/getRewardStatuses']
    },
    routeQuery () {
      return JSON.parse(JSON.stringify(this.$route.query))
    }
  },
  created () {
    this.$store.dispatch('dictionaries/updateSortPaginationFilter', this.$route.query)
    this.$store.commit('dictionaries/UPDATE_SOURCE', 'rewards')
    this.$store.dispatch('dictionaries/fetchPrograms')
  },
  methods: {
    setFilters () {
      if (this.routeQuery && this.routeQuery.company_id) {
        this.selectedStore = this.tenants.find(tenant => tenant.flag === this.routeQuery.company_id)
      }
      if (this.routeQuery && this.routeQuery.status) {
        this.selectedStatus = this.rewardStatuses.find(status => status.flag === this.routeQuery.status)
      }
      if (this.routeQuery && this.routeQuery.title) {
        this.rewardsSearch = this.routeQuery.title
      }
    },
    showRewardCreate () {
      this.$store.commit('rewards/CLEAR_CURRENT_REWARD')
      this.propStep = 0
      this.editedCardType = null
      this.isRewardCreateShown = true
    },
    cardEdited (cardType, currentReward) {
      this.$store.commit('rewards/SAVE_CURRENT_REWARD', currentReward)
      this.propStep = 2
      this.editedCardType = cardType
      this.isRewardCreateShown = true
    },
    openCurrentReward (currentReward) {
      this.$store.commit('rewards/SAVE_CURRENT_REWARD', currentReward)
    },
    closeCreateRewardModal () {
      this.isRewardCreateShown = false
    },
    async rewardsSearching (value) {
      this.rewardsSearch = value
      if (value.split('').length > 2) {
        this.$store.commit('dictionaries/UPDATE_SEARCH_MODE', true)
        await this.$store.commit('dictionaries/UPDATE_FILTER', { field: 'title', value: this.rewardsSearch })
      } else if (value === '') {
        this.$store.commit('dictionaries/UPDATE_SEARCH_MODE', false)
        await this.$store.commit('dictionaries/UPDATE_FILTER', { field: 'title', value: null })
        await this.$store.dispatch('rewards/fetchRewards', { page: 1, perPage: 10 })
      }
    },
    getRewardsStatus (status) {
      if (status === 0) {
        return 'archived'
      } else if (status === 1) {
        return 'published'
      } else if (status === 3) {
        return 'scheduled'
      }
    },
    rewardFilterChanged (value, field) {
      if (field === 'company_id') {
        this.selectedStore = value
      } else if (field === 'status') {
        this.selectedStatus = value
      }
      this.$store.commit('dictionaries/UPDATE_FILTER', { field, value: value.flag })
    },
    resetFilter () {
      this.rewardsSearch = null
      this.selectedStore = { title: null, flag: null }
      this.selectedStatus = { title: null, flag: null }
      this.$store.dispatch('dictionaries/resetFilter')
    },
    rowClicked (item) {
      this.$store.commit('rewards/SAVE_CURRENT_REWARD', item)
      this.isRewardCreateShown = true
    },
    async resetCurrentFilter (field) {
      if (field === 'company_id') {
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
