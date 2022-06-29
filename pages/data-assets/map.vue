<template>
  <div class="data_assets-tenants">
    <div class="data_assets-tenants-head">
      <span class="data_assets-tenants-head-title">Navigation</span>
      <div class="data_assets-tenants-head-buttons">
        <b-button
          variant="primary"
          class="data_assets-tenants-head-buttons-button"
          @click="newPlaceCreation"
        >
          <smq-icon-plus class="data_assets-tenants-head-buttons-button-icon_plus" />
          New place
        </b-button>
      </div>
    </div>
    <div class="data_assets-tenants-forms">
      <div class="d-flex align-items-center">
<!--        <div-->
<!--          v-if="selectedCategory && selectedCategory.title"-->
<!--          class="filter_chips-chip"-->
<!--        >-->
<!--          <span v-text="selectedCategory && selectedCategory.title ? selectedCategory.title : null" />-->
<!--          <smq-icon-close @click.native="resetCurrentFilter('company_category_id')" />-->
<!--        </div>-->
        <smq-form-dropdown
          class="loyalty-receipts-head-dropdown"
          :width="160"
          placeholder="Actions"
          dropdown-type="filter"
        />
      </div>
<!--        <b-skeleton v-else type="input" width="160px" class="mr-2" />-->
      <div class="data_assets-tenants-search">
        <smq-form-input
          class="m-0"
          placeholder="Search..."
          dropdown-type="filter"
          prepend="search"
        />
      </div>
<!--      <b-skeleton v-else type="input" width="215px" />-->
    </div>
    <b-table
      :fields="fields"
      :items="items"
      head-variant="gray-200"
      class="smq-table"
      @row-clicked="rowClicked"
    >
      <template v-slot:head(checkbox)>
        <smq-icon-checkbox-blank-outline class="smq-table-checkbox -head" />
      </template>
      <template v-slot:cell(checkbox)>
        <smq-icon-checkbox-blank-outline class="smq-table-checkbox" />
      </template>
    </b-table>
    <b-modal
      v-model="isPlaceShown"
      hide-header
      hide-footer
      centered
      hide-backdrop
      @hidden="isPlaceShown = false"
    >
      <template #default="{ close }">
        <current-place :close="close" />
      </template>
    </b-modal>
  </div>
</template>

<script>
import SmqIconPlus from '~/components/icons/smq-icon-plus'
// import SmqIconClose from '~/components/icons/smq-icon-close'
import SmqFormDropdown from '~/components/forms/smq-form-dropdown'
import SmqFormInput from '~/components/forms/smq-form-input'
import SmqIconCheckboxBlankOutline from '~/components/icons/smq-icon-checkbox-blank-outline'
import CurrentPlace from '~/components/data-assets/map/currentPlace'
export default {
  name: 'DataAssetsMap',
  components: { CurrentPlace, SmqIconCheckboxBlankOutline, SmqFormInput, SmqFormDropdown, SmqIconPlus },
  data () {
    return {
      isPlaceShown: false,
      fields: [
        {
          key: 'checkbox',
          label: '',
          class: 'w-5'
        },
        {
          key: 'place_name',
          label: 'Place name',
          class: 'w-20'
        },
        {
          key: 'place_url',
          label: 'Place URL',
          class: 'w-50'
        },
        {
          key: 'qr_code',
          label: 'QR code',
          class: 'w-25'
        }
      ]
    }
  },
  computed: {
    items () {
      return [
        { id: 1, place_name: 'This is place name', place_url: 'https://www.novoplaza.cz/interaktivni-mapa', qr_code: 'Download QR code' },
        { id: 2, place_name: 'This is place name', place_url: 'https://www.novoplaza.cz/interaktivni-mapa', qr_code: 'Download QR code' },
        { id: 3, place_name: 'This is place name', place_url: 'https://www.novoplaza.cz/interaktivni-mapa', qr_code: 'Download QR code' },
        { id: 4, place_name: 'This is place name', place_url: 'https://www.novoplaza.cz/interaktivni-mapa', qr_code: 'Download QR code' },
        { id: 5, place_name: 'This is place name', place_url: 'https://www.novoplaza.cz/interaktivni-mapa', qr_code: 'Download QR code' },
        { id: 6, place_name: 'This is place name', place_url: 'https://www.novoplaza.cz/interaktivni-mapa', qr_code: 'Download QR code' },
        { id: 7, place_name: 'This is place name', place_url: 'https://www.novoplaza.cz/interaktivni-mapa', qr_code: 'Download QR code' },
        { id: 8, place_name: 'This is place name', place_url: 'https://www.novoplaza.cz/interaktivni-mapa', qr_code: 'Download QR code' },
        { id: 9, place_name: 'This is place name', place_url: 'https://www.novoplaza.cz/interaktivni-mapa', qr_code: 'Download QR code' },
        { id: 10, place_name: 'This is place name', place_url: 'https://www.novoplaza.cz/interaktivni-mapa', qr_code: 'Download QR code' }
      ]
    }
  },
  methods: {
    newPlaceCreation () {
      //
    },
    rowClicked () {
      this.isPlaceShown = true
    }
  }
}
</script>
