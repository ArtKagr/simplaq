<template>
  <div class="data_assets-tenants-new_tenant">
    <div class="data_assets-tenants-new_tenant-head">
      <div class="data_assets-tenants-new_tenant-head-title">
        <smq-icon-arrow-left
          class="data_assets-tenants-new_tenant-head-title-icon"
          @click.native="openTenantsList"
        />
        <span
          class="data_assets-tenants-new_tenant-head-title-text"
          v-text="pageName"
        />
        <div v-if="source === 'current-tenant'" class="ml-4">
          <span
            :class="`smq-table-status -${getCurrentStatusClass(currentTenantCopy.status)}`"
            v-text="getCurrentStatus(currentTenantCopy.status)"
          />
        </div>
      </div>
      <div class="d-flex align-items-center">
        <b-button
          v-if="source === 'new-tenant'"
          variant="primary"
          class="data_assets-tenants-new_tenant-head-button"
          v-text="'Save'"
          @click="createTenant"
        />
        <b-button
          v-else
          variant="primary"
          class="data_assets-tenants-new_tenant-head-button mr-3"
          v-text="'Update'"
          @click="changeTenant"
        />
        <div
          v-if="source === 'current-tenant'"
          class="d-flex align-items-center"
        >
          <b-button
            v-if="currentTenantCopy && currentTenantCopy.status === 1"
            variant="danger"
            class="data_assets-tenants-new_tenant-head-button"
            @click="archiveTenant"
            v-text="'Archive'"
          />
          <b-button
            v-else
            variant="success"
            class="data_assets-tenants-new_tenant-head-button"
            @click="publishTenant"
            v-text="'Publish'"
          />
        </div>
      </div>
    </div>
    <div class="marketing-news-content-menu mb-4">
      <div
        v-for="item in menu"
        :key="item.flag"
        :class="item.flag === activeMenuItem ? '-active' : ''"
        class="marketing-news-content-menu-item"
        @click="setActiveTenantTab(item.flag)"
      >
          <span
            class="marketing-news-content-menu-item-title"
            :class="item.flag === activeMenuItem ? '-active' : ''"
            v-text="item.title"
          />
      </div>
    </div>
    <div class="data_assets-tenants-new_tenant-container">
      <tenant-general
        v-if="activeMenuItem === 'general'"
        :tenant-error="tenantError"
        :title="currentTenantCopy.title"
        :legal-name="currentTenantCopy.company_identification.legal_name"
        :legal-address="currentTenantCopy.company_identification.legal_address"
        :company-id="currentTenantCopy.company_identification.legal_company_id"
        :vat-id="currentTenantCopy.company_identification.vat"
        @changed-value="updateCurrentTenant"
      />
      <tenant-store
        v-else-if="activeMenuItem === 'store'"
        :tenant-error="tenantError"
        :phone="currentTenantCopy.phone"
        :email="currentTenantCopy.email"
        :website="currentTenantCopy.website"
        :facebook="currentTenantCopy.facebook"
        :instagram="currentTenantCopy.instagram"
        :company-category-id="currentTenantCopy.company_category_id"
        :floor="currentTenantCopy.floor"
        :description="currentTenantCopy.description"
        :non-stop="currentTenantCopy.non_stop"
        :temporary-closed="currentTenantCopy.temporary_closed"
        :open-hours="currentTenantCopy.open_hours"
        @changed-value="updateCurrentTenant"
        @set-day="setDay"
        @update-work-schedule="updateWorkSchedule"
      />
      <tenant-loyalty
        v-else-if="activeMenuItem === 'loyalty'"
        :loyalty-status="currentTenantCopy.loyalty_status"
        :legal-name="currentTenantCopy.company_identification.legal_name"
        :mall-name="currentTenantCopy.company_identification.loyalty_company_name"
        :stop-words="currentTenantCopy.company_identification.loyalty_receipt_copy_words"
        :unic-marker="currentTenantCopy.company_identification.loyalty_unique_string"
        :company-id="currentTenantCopy.company_identification.legal_company_id"
        :vat-id="currentTenantCopy.company_identification.vat"
        :source="source"
        @changed-value="updateCurrentTenant"
      />
    </div>
  </div>
</template>

<script>
import TenantGeneral from './tabs/tenantGeneral'
import TenantStore from './tabs/tenantStore'
import TenantLoyalty from './tabs/tenantLoyalty'
import SmqIconArrowLeft from '~/components/icons/smq-icon-arrow-left'
export default {
  name: 'tenant',
  components: {
    TenantLoyalty,
    TenantStore,
    TenantGeneral,
    SmqIconArrowLeft
  },
  props: {
    source: {
      type: String,
      default: 'current-tenant'
    }
  },
  data () {
    return {
      tenantError: false,
      currentTenantCopy: {
        title: null,
        floor: null,
        description: null,
        store_name: null,
        phone: null,
        email: null,
        website: null,
        facebook: null,
        instagram: null,
        mall_id: 1,
        status: null,
        company_category_id: null,
        company_identification: {
          company_id: null,
          legal_address: null,
          legal_company_id: null,
          legal_name: null,
          loyalty_company_name: null,
          loyalty_receipt_copy_words: null,
          loyalty_store_name: null,
          loyalty_unique_string: null,
          vat: null
        },
        loyalty_status: null,
        country_id: 1,
        company_type_id: 2,
        non_stop: false,
        temporary_closed: false,
        big_logo: null,
        logo_picture: null,
        open_hours: [
          { from: '09:00:00', to: '21:00:00' },
          { from: '09:00:00', to: '21:00:00' },
          { from: '09:00:00', to: '21:00:00' },
          { from: '09:00:00', to: '21:00:00' },
          { from: '09:00:00', to: '21:00:00' },
          { from: '09:00:00', to: '21:00:00' },
          { from: '09:00:00', to: '21:00:00' }
        ]
      }
    }
  },
  watch: {
    status (newValue) {
      switch (newValue) {
        case 'tenant-successfully-created':
          this.$router.push('/data-assets/tenants')
          break
        case 'tenant-successfully-updated':
          this.$router.push('/data-assets/tenants')
          break
        case 'tenant-successfully-deleted':
          this.$router.push('/data-assets/tenants')
          break
        case 'tenant-successfully-archived':
          this.$router.push('/data-assets/tenants')
          break
        case 'tenant-successfully-published':
          this.$router.push('/data-assets/tenants')
          break
      }
    },
    currentTenant: {
      handler (newValue, oldValue) {
        if (newValue.status !== oldValue.status) {
          this.currentTenantCopy.status = newValue.status
        }
      },
      deep: true
    }
  },
  computed: {
    activeMenuItem () {
      return this.$store.getters['tenants/getActiveNewsMenuItem']
    },
    menu () {
      return this.$store.getters['tenants/getTenantMenu']
    },
    updateCreateDisable () {
      return !(
        this.currentTenantCopy.title &&
        this.tenantCategory &&
        this.currentTenantCopy.floor &&
        this.tenantBase64Images.big &&
        this.tenantBase64Images.small &&
        this.someWeekDayFilled
      )
    },
    status () {
      return this.$store.getters['dictionaries/getStatus']
    },
    pageName () {
      return this.source === 'new-tenant' ? 'New Tenant' : this.currentTenant.title
    },
    currentTenant () {
      return this.$store.getters['tenants/getCurrentTenant']
    },
    companyCategories () {
      const categories = this.$store.getters['dictionaries/getCompanyCategories']
      if (categories && categories.length) {
        return categories.map((category) => {
          return { title: category.company_category, flag: String(category.id) }
        })
      } else {
        return this.testArray
      }
    },
    tenantCategory () {
      return this.currentTenantCopy.company_category_id ? String(this.currentTenantCopy.company_category_id) : null
    },
    tenantImages () {
      return this.$store.getters['tenants/getTenantImages']
    },
    tenantBase64Images () {
      return this.$store.getters['tenants/getBase64images']
    },
    someWeekDayFilled () {
      return this.currentTenantCopy.open_hours.some(day => day.from && day.to)
    },
    statuses () {
      return this.$store.getters['dictionaries/getStatuses']
    },
    testArray () {
      return this.$store.getters['dictionaries/getTestArray']
    },
    routeUrl () {
      return this.$store.getters['dictionaries/getRouteUrl']
    }
  },
  destroyed () {
    this.$store.commit('tenants/CLEAR_CURRENT_TENANT')
    this.$store.commit('settings/SAVE_CURRENT_VALUE_POINT', { value: null })
  },
  async created () {
    localStorage.setItem('routeUrl', JSON.stringify(Object.fromEntries(Object.entries(this.routeUrl).filter(([_, v]) => v != null))))
    this.$store.commit('dictionaries/CLEAR_PAGINATION_SORT_FILTER')
    this.setActiveTenantTab('general')
    if (this.source === 'current-tenant') {
      await this.$store.dispatch('tenants/fetchCurrentTenant', this.$route.params.id)
      await this.$store.dispatch('settings/fetchCurrentValuePoints', this.$route.params.id)
    } else {
      await this.$store.dispatch('settings/fetchSettings')
    }
    this.currentTenantCopy = { ...this.$store.getters['tenants/getCurrentTenant'] }
    this.currentTenantCopy.company_identification.company_id = this.currentTenantCopy.id
    if (this.currentTenantCopy && this.currentTenantCopy.big_logo) {
      this.$store.commit('tenants/SAVE_TENANT_LOGO', {
        image: this.currentTenantCopy.big_logo,
        field: 'base64',
        type: 'big'
      })
    }
    if (this.currentTenantCopy && this.currentTenantCopy.logo_picture) {
      this.$store.commit('tenants/SAVE_TENANT_LOGO', {
        image: this.currentTenantCopy.logo_picture,
        field: 'base64',
        type: 'small'
      })
    }
    await this.$store.dispatch('dictionaries/fetchCompanyCategories')
  },
  methods: {
    setActiveTenantTab (item) {
      this.$store.commit('tenants/SET_ACTIVE_NEWS_MENU_ITEM', item)
    },
    archiveTenant () {
      this.$store.dispatch('tenants/archiveCurrentTenant', this.currentTenantCopy.id)
    },
    publishTenant () {
      this.$store.dispatch('tenants/publishCurrentTenant', this.currentTenantCopy.id)
    },
    getCurrentStatusClass (statusFlag) {
      const result = this.statuses.find(status => status.flag === statusFlag)
      return result && result.name ? result.name : 'archived'
    },
    getCurrentStatus (statusFlag) {
      const result = this.statuses.find(status => status.flag === statusFlag)
      return result && result.title ? result.title : 'Archived'
    },
    async openTenantsList () {
      await this.$router.push('/data-assets/tenants')
    },
    setDay (payload) {
      if (payload.flag) {
        this.currentTenantCopy.open_hours[payload.key].from = '09:00:00'
        this.currentTenantCopy.open_hours[payload.key].to = '21:00:00'
      } else {
        this.currentTenantCopy.open_hours[payload.key].from = null
        this.currentTenantCopy.open_hours[payload.key].to = null
      }
    },
    updateWorkSchedule (payload) {
      if (payload.time && payload.time.displayTime) {
        this.currentTenantCopy.open_hours[payload.key][payload.period] = payload.time.displayTime
      }
    },
    updateCurrentTenant (payload) {
      if (payload.block) {
        this.currentTenantCopy[payload.block][payload.field] = payload.value
      } else if (payload.field === 'title') {
        this.currentTenantCopy.store_name = payload.value
        this.currentTenantCopy.title = payload.value
      } else {
        this.currentTenantCopy[payload.field] = payload.value
      }
    },
    changeTenant () {
      if (this.updateCreateDisable) {
        this.tenantError = true
      } else {
        this.tenantError = false
        this.$store.dispatch('tenants/updateCurrentTenant', this.currentTenantCopy)
      }
    },
    async createTenant () {
      if (this.updateCreateDisable) {
        this.tenantError = true
        await this.$store.commit('dictionaries/SAVE_MESSAGE_TOAST', {
          title: 'Validation error',
          description: 'Required fields are empty',
          variant: 'danger'
        })
        await this.$bvToast.show('smq-toast')
      } else {
        this.tenantError = false
        await this.$store.dispatch('tenants/createCurrentTenant', this.currentTenantCopy)
      }
    }
  }
}
</script>
