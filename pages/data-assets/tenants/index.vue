<template>
  <div class="data_assets-tenants">
    <div class="data_assets-tenants-head">
      <span class="data_assets-tenants-head-title">Tenants</span>
      <div class="data_assets-tenants-head-buttons">
        <b-button
          variant="primary"
          class="data_assets-tenants-head-buttons-button"
          @click="newTenantCreation"
        >
          <smq-icon-plus class="data_assets-tenants-head-buttons-button-icon_plus" />
          New tenant
        </b-button>
        <!--        <b-button variant="outline-primary" class="data_assets-tenants-head-buttons-button">-->
        <!--          <smq-icon-import class="data_assets-tenants-head-buttons-button-icon_import" />-->
        <!--          Import-->
        <!--        </b-button>-->
      </div>
    </div>
    <div class="data_assets-tenants-forms">
      <div class="d-flex align-items-center">
        <div
          v-if="selectedCategory && selectedCategory.title"
          class="filter_chips-chip"
        >
          <span v-text="selectedCategory && selectedCategory.title ? selectedCategory.title : null" />
          <smq-icon-close @click.native="resetCurrentFilter('company_category_id')" />
        </div>
        <smq-form-dropdown
          v-else-if="companyCategories && companyCategories.length"
          class="loyalty-receipts-head-dropdown"
          :items="companyCategories"
          :width="160"
          placeholder="Category"
          dropdown-type="filter"
          @selected-item="tenantFilterChanged($event, 'company_category_id')"
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
          v-else-if="companyCategories && companyCategories.length"
          class="loyalty-receipts-head-dropdown"
          :items="tenantStatuses"
          :width="160"
          placeholder="Status"
          dropdown-type="filter"
          @selected-item="tenantFilterChanged($event, 'status')"
        />
        <b-skeleton v-else type="input" width="160px" class="mr-2" />
        <div v-if="companyCategories && companyCategories.length" class="loyalty-redeems-head-reset" @click="resetFilter">
          <smq-icon-restart class="loyalty-redeems-head-reset-icon" />
          <span class="loyalty-redeems-head-reset-text">Reset filter</span>
        </div>
        <b-skeleton v-else type="text" width="90px" class="ml-4" />
      </div>
      <div v-if="companyCategories && companyCategories.length" class="data_assets-tenants-search">
        <smq-form-input
          v-model="tenantsSearch"
          class="m-0"
          placeholder="Search..."
          dropdown-type="filter"
          prepend="search"
          @changed-value="tenantSearching"
        />
      </div>
      <b-skeleton v-else type="input" width="215px" />
    </div>
    <b-table
      v-if="tenants && tenants.length"
      :fields="fields"
      :items="tenants"
      head-variant="gray-200"
      class="smq-table"
    >
      <template v-slot:head(checkbox)>
        <smq-icon-checkbox-blank-outline class="smq-table-checkbox -head" />
      </template>
      <template v-slot:cell(checkbox)>
        <smq-icon-checkbox-blank-outline class="smq-table-checkbox" />
      </template>
      <template v-slot:cell(logo_picture)="row">
        <nuxt-link
          style="height: 48px;"
          class="d-flex w-100 smq-table-text"
          :to="`/data-assets/tenants/${row.item.id}`"
        >
          <img
            v-if="row.item.logo_picture"
            class="smq-table-tenant_logo"
            :src="row.item.logo_picture"
            :alt="`logo-${row.item.id}`"
          />
          <smq-icon-image-square
            v-else
          />
        </nuxt-link>
      </template>
      <template v-slot:cell(title)="row">
        <nuxt-link
          style="height: 48px;"
          class="d-flex w-100 smq-table-text"
          :to="`/data-assets/tenants/${row.item.id}`"
        >
          <span class="my-auto" v-text="row.item.title" />
        </nuxt-link>
      </template>
      <template v-slot:cell(status)="row">
        <nuxt-link
          style="height: 48px;"
          class="d-flex w-100 smq-table-text"
          :to="`/data-assets/tenants/${row.item.id}`"
        >
          <div class="m-auto">
            <span
              class="smq-table-status"
              :class="`-${getTenantsStatusClass(row.item.status)}`"
              v-text="getTenantsStatus(row.item.status)"
            />
          </div>
        </nuxt-link>
      </template>
      <template v-slot:cell(action)>
        <smq-icon-dots-horizontal class="smq-table-dots -vertical" />
      </template>
    </b-table>
    <div v-else-if="searchMode">
      <search-error :query="filter.store_name" />
    </div>
    <smq-form-pagination />
  </div>
</template>

<script>
import SmqFormDropdown from '~/components/forms/smq-form-dropdown'
import SmqIconPlus from '~/components/icons/smq-icon-plus'
import SmqIconImageSquare from '~/components/icons/smq-icon-image-square'
import SmqIconDotsHorizontal from '~/components/icons/smq-icon-dots-horizontal'
import SmqIconCheckboxBlankOutline from '~/components/icons/smq-icon-checkbox-blank-outline'
import SmqFormPagination from '~/components/forms/smq-form-pagination'
import SmqFormInput from '~/components/forms/smq-form-input'
import SmqIconRestart from '~/components/icons/smq-icon-restart'
import SearchError from '~/components/searchError'
import SmqIconClose from '~/components/icons/smq-icon-close'
// import SmqIconImport from '~/components/icons/smq-icon-import'
export default {
  name: 'DataAssetsTenants',
  components: {
    SmqIconClose,
    SearchError,
    SmqIconRestart,
    SmqFormInput,
    SmqFormPagination,
    SmqIconCheckboxBlankOutline,
    SmqIconDotsHorizontal,
    SmqIconImageSquare,
    SmqIconPlus,
    SmqFormDropdown
    // SmqIconImport,
  },
  data () {
    return {
      selectedCategory: { title: null, flag: null },
      selectedStatus: { title: null, flag: null },
      tenantsSearch: null,
      fields: [
        {
          key: 'checkbox',
          label: '',
          class: 'w-5'
        },
        {
          key: 'logo_picture',
          label: '',
          class: 'w-10'
        },
        {
          key: 'title',
          label: 'Tenant',
          class: 'w-50'
        },
        {
          key: 'company_category.company_category',
          label: 'Category',
          class: 'w-10'
        },
        {
          key: 'floor',
          label: 'Floor',
          class: 'w-10'
        },
        {
          key: 'status',
          label: 'Status',
          class: 'w-10 text-center'
        },
        {
          key: 'action',
          label: 'Action',
          class: 'w-5'
        }
      ]
    }
  },
  watch: {
    companyCategories: {
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
      return this.$store.getters['tenants/getTenants']
    },
    companyCategories () {
      return this.$store.getters['dictionaries/getCompanyCategories'].map((tenant) => {
        return {
          title: tenant.company_category,
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
    statuses () {
      return this.$store.getters['dictionaries/getStatuses']
    },
    tenantStatuses () {
      return this.$store.getters['dictionaries/getVoucherStatuses']
    },
    routeQuery () {
      return JSON.parse(JSON.stringify(this.$route.query))
    },
    localeStorageUrl () {
      return localStorage.getItem('routeUrl') ? JSON.parse(localStorage.getItem('routeUrl')) : {}
    },
    isRouteQuery () {
      return Object.keys(this.routeQuery).length
    }
  },
  created () {
    this.$store.dispatch('dictionaries/updateSortPaginationFilter', this.isRouteQuery ? this.routeQuery : this.localeStorageUrl)
    this.$store.commit('dictionaries/UPDATE_SOURCE', 'tenants')
  },
  mounted () {
    this.setFilters()
  },
  destroyed () {
    localStorage.removeItem('routeUrl')
  },
  methods: {
    setFilters () {
      if (this.routeQuery && this.routeQuery.status) {
        this.selectedStatus = this.tenantStatuses.find(status => status.flag === this.routeQuery.status)
      } else if (this.localeStorageUrl && this.localeStorageUrl.status) {
        this.selectedStatus = this.tenantStatuses.find(status => status.flag === this.localeStorageUrl.status)
      }
      if (this.routeQuery && this.routeQuery.company_category_id) {
        this.selectedCategory = this.companyCategories.find(status => status.flag === this.routeQuery.company_category_id)
      } else if (this.localeStorageUrl && this.localeStorageUrl.company_category_id) {
        this.selectedCategory = this.companyCategories.find(status => status.flag === this.localeStorageUrl.company_category_id)
      }
      if (this.routeQuery && this.routeQuery.store_name) {
        this.tenantsSearch = this.routeQuery.store_name
      } else if (this.localeStorageUrl && this.localeStorageUrl.store_name) {
        this.tenantsSearch = this.localeStorageUrl.store_name
      }
    },
    async rowClicked (row) {
      await this.$router.push(`/data-assets/tenants/${row.id}`)
    },
    newTenantCreation () {
      this.$router.push('/data-assets/tenants/new-tenant')
    },
    tenantFilterChanged (value, field) {
      if (field === 'company_category_id') {
        this.selectedCategory = value
      } else if (field === 'status') {
        this.selectedStatus = value
      }
      this.$store.commit('dictionaries/UPDATE_FILTER', { field, value: value.flag })
    },
    resetFilter () {
      this.tenantsSearch = null
      this.selectedCategory = { title: null, flag: null }
      this.selectedStatus = { title: null, flag: null }
      this.$store.dispatch('dictionaries/resetFilter')
    },
    async tenantSearching (value) {
      this.tenantsSearch = value
      if (value.split('').length > 2) {
        this.$store.commit('dictionaries/UPDATE_SEARCH_MODE', true)
        await this.$store.commit('dictionaries/UPDATE_FILTER', { field: 'store_name', value: this.tenantsSearch })
      } else if (value === '') {
        this.$store.commit('dictionaries/UPDATE_SEARCH_MODE', false)
        await this.$store.commit('dictionaries/UPDATE_FILTER', { field: 'store_name', value: null })
        await this.$store.dispatch('tenants/fetchTenants', { page: 1, perPage: 10 })
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
      if (field === 'company_category_id') {
        this.selectedCategory = { title: null, flag: null }
      } else if (field === 'status') {
        this.selectedStatus = { title: null, flag: null }
      }
      await this.$store.commit('dictionaries/UPDATE_FILTER', { field, value: null })
      await this.$store.dispatch('dictionaries/sendPageData')
    }
  }
}
</script>
