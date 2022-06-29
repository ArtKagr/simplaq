<template>
  <div class="data_assets-tenants-new_tenant-container">
    <div class="data_assets-tenants-new_tenant-container-cards m-0">
      <div class="data_assets-tenants-new_tenant-container-cards-card">
        <span class="data_assets-tenants-new_tenant-container-cards-card-title">Contact details</span>
        <div class="data_assets-tenants-new_tenant-container-cards-card-container">
          <smq-form-input
            v-model="changedPhone"
            label="Phone number"
            color="gray-800"
            class="data_assets-tenants-new_tenant-container-cards-card-container-field"
            @changed-value="updateCurrentTenant($event, 'phone')"
          />
          <smq-form-input
            v-model="changedEmail"
            label="Email address"
            color="gray-800"
            class="data_assets-tenants-new_tenant-container-cards-card-container-field"
            @changed-value="updateCurrentTenant($event, 'email')"
          />
          <smq-form-input
            v-model="changedWebsite"
            label="Website"
            color="gray-800"
            class="data_assets-tenants-new_tenant-container-cards-card-container-field"
            @changed-value="updateCurrentTenant($event, 'website')"
          />
          <smq-form-input
            v-model="changedFacebook"
            label="Facebook"
            default-text="Insert profile URL"
            color="gray-800"
            class="data_assets-tenants-new_tenant-container-cards-card-container-field"
            @changed-value="updateCurrentTenant($event, 'facebook')"
          />
          <smq-form-input
            v-model="changedInstagram"
            label="Instagram"
            default-text="Insert profile URL"
            color="gray-800"
            class="data_assets-tenants-new_tenant-container-cards-card-container-field"
            @changed-value="updateCurrentTenant($event, 'instagram')"
          />
        </div>
        <span class="data_assets-tenants-new_tenant-container-cards-card-title">Store photo</span>
        <div class="data_assets-tenants-new_tenant-container-cards-card-container">
          <div class="data_assets-tenants-new_tenant-container-image_drop-body p-0">
            <drag-drop-image
              :width="208"
              :height="208"
              :image="tenantBase64Images.big"
              :error="tenantError && !tenantBase64Images.big"
              message="Required field"
              @uploaded-file="tenantLogoUpdated"
            />
          </div>
        </div>
        <span class="data_assets-tenants-new_tenant-container-cards-card-title">Store details</span>
        <div class="data_assets-tenants-new_tenant-container-cards-card-container">
          <smq-form-dropdown
            :items="companyCategories"
            :default-item="changedCompanyCategoryId"
            placeholder="Company category"
            label="Category"
            class="data_assets-tenants-new_tenant-container-cards-card-container-field"
            :error="tenantError && !changedCompanyCategoryId"
            message="Required field"
            @selected-item="updateCurrentTenant($event.flag, 'company_category_id')"
          />
          <smq-form-input
            v-model="changedFloor"
            label="Floor"
            color="gray-800"
            class="data_assets-tenants-new_tenant-container-cards-card-container-field"
            :error="tenantError && !changedFloor"
            message="Required field"
            @changed-value="updateCurrentTenant($event, 'floor')"
          />
          <smq-form-textarea
            v-model="changedDescription"
            high-field
            label="Description"
            class="data_assets-tenants-new_tenant-container-cards-card-container-field"
            @changed-value="updateCurrentTenant($event, 'description')"
          />
        </div>
        <span class="data_assets-tenants-new_tenant-container-cards-card-title">Opening Hours</span>
        <div class="data_assets-tenants-new_tenant-container-cards-card-checkboxes">
          <div class="data_assets-tenants-new_tenant-container-cards-card-checkboxes-item">
            <smq-icon-checkbox-fill
              v-if="changedNonStop"
              class="data_assets-tenants-new_tenant-container-cards-card-checkboxes-item-checkbox"
              @click.native="updateCurrentTenant(false, 'non_stop')"
            />
            <smq-icon-checkbox-blank-outline
              v-else
              class="data_assets-tenants-new_tenant-container-cards-card-checkboxes-item-checkbox -outline"
              @click.native="updateCurrentTenant(true, 'non_stop')"
            />
            <span class="data_assets-tenants-new_tenant-container-cards-card-checkboxes-item-text">Open Nonstop</span>
          </div>
          <div class="data_assets-tenants-new_tenant-container-cards-card-checkboxes-item">
            <smq-icon-checkbox-fill
              v-if="changedTemporaryClosed"
              class="data_assets-tenants-new_tenant-container-cards-card-checkboxes-item-checkbox"
              @click.native="updateCurrentTenant(false, 'temporary_closed')"
            />
            <smq-icon-checkbox-blank-outline
              v-else
              class="data_assets-tenants-new_tenant-container-cards-card-checkboxes-item-checkbox -outline"
              @click.native="updateCurrentTenant(true, 'temporary_closed')"
            />
            <span class="data_assets-tenants-new_tenant-container-cards-card-checkboxes-item-text">Temporary Closed</span>
          </div>
        </div>
        <div
          v-if="!changedNonStop"
          class="data_assets-tenants-new_tenant-container-cards-card-week"
        >
          <div
            class="data_assets-tenants-new_tenant-container-cards-card-week-block"
            :class="tenantError && !someWeekDayFilled ? '-error' : ''"
          >
            <div
              v-for="(day, key) in changedOpenHours"
              :key="key"
              class="data_assets-tenants-new_tenant-container-cards-card-week-day"
            >
              <smq-icon-checkbox-fill
                v-if="day.from && day.to"
                class="data_assets-tenants-new_tenant-container-cards-card-week-day-checkbox"
                @click.native="setDay(false, key)"
              />
              <smq-icon-checkbox-blank-outline
                v-else
                class="data_assets-tenants-new_tenant-container-cards-card-week-day-checkbox -outline"
                @click.native="setDay(true, key)"
              />
              <span
                class="data_assets-tenants-new_tenant-container-cards-card-week-day-title"
                v-text="getWeekDayName(key)"
              />
              <VueTimepicker
                format="HH:mm:ss"
                v-model="day.from"
                :disabled="!day.from && !day.to"
                class="data_assets-tenants-new_tenant-container-cards-card-week-day-field"
                :placeholder="day.from && day.to ? 'Open time' : 'Weekends - closed'"
                hide-clear-button
                @change="updateWorkSchedule($event, key,'from')"
              />
              <VueTimepicker
                format="HH:mm:ss"
                v-model="day.to"
                :disabled="!day.from && !day.to"
                class="data_assets-tenants-new_tenant-container-cards-card-week-day-field"
                :placeholder="day.from && day.to ? 'Close time' : 'Weekends - closed'"
                hide-clear-button
                @change="updateWorkSchedule($event, key,'to')"
              />
            </div>
          </div>
          <span
            v-if="tenantError && !someWeekDayFilled"
            class="data_assets-tenants-new_tenant-container-cards-card-week-error"
            v-text="'Required to fill in at least one field'"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import VueTimepicker from 'vue2-timepicker/src/vue-timepicker.vue'
import SmqFormInput from '~/components/forms/smq-form-input'
import DragDropImage from '~/components/dragDropImage'
import SmqFormDropdown from '~/components/forms/smq-form-dropdown'
import SmqFormTextarea from '~/components/forms/smq-form-textarea'
import SmqIconCheckboxFill from '~/components/icons/smq-icon-checkbox-fill'
import SmqIconCheckboxBlankOutline from '~/components/icons/smq-icon-checkbox-blank-outline'
export default {
  name: 'tenantStore',
  components: {
    SmqIconCheckboxBlankOutline,
    SmqIconCheckboxFill,
    SmqFormTextarea,
    SmqFormDropdown,
    DragDropImage,
    SmqFormInput,
    VueTimepicker
  },
  props: {
    tenantError: {
      type: Boolean,
      default: false
    },
    phone: {
      type: String,
      default: null
    },
    email: {
      type: String,
      default: null
    },
    website: {
      type: String,
      default: null
    },
    facebook: {
      type: String,
      default: null
    },
    instagram: {
      type: String,
      default: null
    },
    companyCategoryId: {
      type: Number,
      default: null
    },
    floor: {
      type: String,
      default: null
    },
    description: {
      type: String,
      default: null
    },
    nonStop: {
      type: Boolean,
      default: false
    },
    temporaryClosed: {
      type: Boolean,
      default: false
    },
    openHours: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    changedPhone () {
      return this.phone
    },
    changedEmail () {
      return this.email
    },
    changedWebsite () {
      return this.website
    },
    changedFacebook () {
      return this.facebook
    },
    changedInstagram () {
      return this.instagram
    },
    changedCompanyCategoryId () {
      return this.companyCategoryId ? String(this.companyCategoryId) : null
    },
    changedDescription () {
      return this.description
    },
    changedFloor () {
      return this.floor
    },
    changedNonStop () {
      return this.nonStop
    },
    changedTemporaryClosed () {
      return this.temporaryClosed
    },
    changedOpenHours () {
      return this.openHours
    },
    tenantBase64Images () {
      return this.$store.getters['tenants/getBase64images']
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
    someWeekDayFilled () {
      return this.openHours.some(day => day.from && day.to)
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
    tenantLogoUpdated (file) {
      this.createBase64Image(file, 'big')
      this.createArrayBuffer(file, 'big')
    },
    setDay (flag, key) {
      this.$emit('set-day', { flag, key })
    },
    getWeekDayName (key) {
      let name
      switch (key) {
        case 0:
          name = 'monday'
          break
        case 1:
          name = 'tuesday'
          break
        case 2:
          name = 'wednesday'
          break
        case 3:
          name = 'thursday'
          break
        case 4:
          name = 'friday'
          break
        case 5:
          name = 'saturday'
          break
        case 6:
          name = 'sunday'
          break
      }
      return name
    },
    updateWorkSchedule (time, key, period) {
      this.$emit('update-work-schedule', { time, key, period })
    }
  }
}
</script>
