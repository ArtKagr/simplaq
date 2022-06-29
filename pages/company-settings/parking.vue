<template>
  <div class="data_assets-tenants">
    <div class="data_assets-tenants-head">
      <span class="data_assets-tenants-head-title">Parking</span>
      <div class="data_assets-tenants-head-buttons">
        <b-button
          variant="primary"
          class="data_assets-tenants-head-buttons-button"
          v-text="'Save'"
        />
      </div>
    </div>
    <div class="data_assets-tenants-new_tenant-container">
      <div class="data_assets-tenants-new_tenant-container-cards m-0">
        <div class="data_assets-tenants-new_tenant-container-cards-card">
          <wysiwyg />
        </div>
        <div class="data_assets-tenants-new_tenant-container-cards-card">
          <div class="data_assets-tenants-new_tenant-container-cards-card-container p-0">
            <span class="data_assets-tenants-new_tenant-container-cards-card-title -bold">Price per hour</span>
          </div>
          <div class="data_assets-tenants-new_tenant-container-cards-card-container">
            <b-table
              :fields="fields"
              :items="items"
              head-variant="gray-200"
              class="smq-table"
            >
              <template v-slot:cell(mon)>
                <smq-form-input
                  color="gray-800"
                  class="data_assets-tenants-new_tenant-container-cards-card-container-field"
                  message="Required field"
                />
              </template>
              <template v-slot:cell(tue)>
                <smq-form-input
                  color="gray-800"
                  class="data_assets-tenants-new_tenant-container-cards-card-container-field"
                  message="Required field"
                />
              </template>
              <template v-slot:cell(wed)>
                <smq-form-input
                  color="gray-800"
                  class="data_assets-tenants-new_tenant-container-cards-card-container-field"
                  message="Required field"
                />
              </template>
              <template v-slot:cell(thu)>
                <smq-form-input
                  color="gray-800"
                  class="data_assets-tenants-new_tenant-container-cards-card-container-field"
                  message="Required field"
                />
              </template>
              <template v-slot:cell(fri)>
                <smq-form-input
                  color="gray-800"
                  class="data_assets-tenants-new_tenant-container-cards-card-container-field"
                  message="Required field"
                />
              </template>
              <template v-slot:cell(sat)>
                <smq-form-input
                  color="gray-800"
                  class="data_assets-tenants-new_tenant-container-cards-card-container-field"
                  message="Required field"
                />
              </template>
              <template v-slot:cell(sun)>
                <smq-form-input
                  color="gray-800"
                  class="data_assets-tenants-new_tenant-container-cards-card-container-field"
                  message="Required field"
                />
              </template>
            </b-table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SmqFormInput from '~/components/forms/smq-form-input'
export default {
  name: 'CompanySettingsParking',
  components: { SmqFormInput },
  data () {
    return {
      fields: [
        {
          key: 'hours',
          label: '',
          class: 'custom-width-100px -bold'
        },
        {
          key: 'mon',
          label: 'Mon',
          class: 'text-center'
        },
        {
          key: 'tue',
          label: 'Tue',
          class: 'text-center'
        },
        {
          key: 'wed',
          label: 'Wed',
          class: 'text-center'
        },
        {
          key: 'thu',
          label: 'Thu',
          class: 'text-center'
        },
        {
          key: 'fri',
          label: 'Fri',
          class: 'text-center'
        },
        {
          key: 'sat',
          label: 'Sat',
          class: 'text-center'
        },
        {
          key: 'sun',
          label: 'Sun',
          class: 'text-center'
        }
      ]
    }
  },
  computed: {
    items () {
      return [
        { hours: '1 hr', mon: null, tue: null, wed: null, thu: null, fri: null, sat: null, sun: null },
        { hours: '2 hr', mon: null, tue: null, wed: null, thu: null, fri: null, sat: null, sun: null },
        { hours: '3 hr', mon: null, tue: null, wed: null, thu: null, fri: null, sat: null, sun: null },
        { hours: '4 hr', mon: null, tue: null, wed: null, thu: null, fri: null, sat: null, sun: null },
        { hours: '5 hr', mon: null, tue: null, wed: null, thu: null, fri: null, sat: null, sun: null },
        { hours: '6 hr', mon: null, tue: null, wed: null, thu: null, fri: null, sat: null, sun: null }
      ]
    }
  }
}
</script>
