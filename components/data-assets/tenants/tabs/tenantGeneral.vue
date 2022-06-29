<template>
  <div class="data_assets-tenants-new_tenant-container">
    <div class="data_assets-tenants-new_tenant-container-cards m-0">
      <div class="data_assets-tenants-new_tenant-container-cards-card">
        <div class="data_assets-tenants-new_tenant-container-cards-card-container">
          <smq-form-input
            v-model="changedTitle"
            label="Name"
            color="gray-800"
            class="data_assets-tenants-new_tenant-container-cards-card-container-field"
            message="Required field"
            :error="tenantError && !changedTitle"
            @changed-value="updateCurrentTenant($event, 'title')"
          />
        </div>
        <span class="data_assets-tenants-new_tenant-container-cards-card-title">Legal details</span>
        <div class="data_assets-tenants-new_tenant-container-cards-card-container">
          <smq-form-input
            v-model="changedLegalName"
            label="Legal name"
            color="gray-800"
            class="data_assets-tenants-new_tenant-container-cards-card-container-field"
            message="Required field"
            @changed-value="updateCurrentTenant($event, 'legal_name', 'company_identification')"
          />
          <smq-form-input
            v-model="changedLegalAddress"
            label="Legal address"
            color="gray-800"
            class="data_assets-tenants-new_tenant-container-cards-card-container-field"
            @changed-value="updateCurrentTenant($event, 'legal_address', 'company_identification')"
          />
          <smq-form-input
            v-model="changedCompanyId"
            label="Company ID"
            color="gray-800"
            class="data_assets-tenants-new_tenant-container-cards-card-container-field"
            @changed-value="updateCurrentTenant($event, 'legal_company_id', 'company_identification')"
          />
          <smq-form-input
            v-model="changedVatId"
            label="VAT ID"
            color="gray-800"
            class="data_assets-tenants-new_tenant-container-cards-card-container-field"
            @changed-value="updateCurrentTenant($event, 'vat', 'company_identification')"
          />
        </div>
        <span class="data_assets-tenants-new_tenant-container-cards-card-title">Logo</span>
        <div class="data_assets-tenants-new_tenant-container-cards-card-container">
          <div class="data_assets-tenants-new_tenant-container-image_drop-body p-0">
            <drag-drop-image
              :width="208"
              :height="208"
              :image="tenantBase64Images.small"
              :error="tenantError && !tenantBase64Images.small"
              message="Required field"
              @uploaded-file="tenantSmallLogoUpdated"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SmqFormInput from '~/components/forms/smq-form-input'
import DragDropImage from '~/components/dragDropImage'
export default {
  name: 'tenantGeneral',
  components: { DragDropImage, SmqFormInput },
  props: {
    tenantError: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: null
    },
    legalName: {
      type: String,
      default: null
    },
    legalAddress: {
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
    }
  },
  computed: {
    changedTitle () {
      return this.title
    },
    changedLegalName () {
      return this.legalName
    },
    changedLegalAddress () {
      return this.legalAddress
    },
    changedCompanyId () {
      return this.companyId
    },
    changedVatId () {
      return this.vatId
    },
    tenantBase64Images () {
      return this.$store.getters['tenants/getBase64images']
    }
  },
  methods: {
    updateCurrentTenant (value, field, block) {
      this.$emit('changed-value', { value, field, block })
    },
    createArrayBuffer (file, type) {
      const reader = new FileReader()
      reader.onload = (e) => {
        this.$store.commit('tenants/SAVE_TENANT_LOGO', {
          image: e.target.result,
          field: 'arrayBuffer',
          type
        })
      }
      reader.readAsArrayBuffer(file)
    },
    createBase64Image (file, type) {
      const reader = new FileReader()
      reader.onload = (e) => {
        this.$store.commit('tenants/SAVE_TENANT_LOGO', {
          image: e.target.result,
          field: 'base64',
          type
        })
      }
      reader.readAsDataURL(file)
    },
    tenantSmallLogoUpdated (file) {
      this.createBase64Image(file, 'small')
      this.createArrayBuffer(file, 'small')
    }
  }
}
</script>
