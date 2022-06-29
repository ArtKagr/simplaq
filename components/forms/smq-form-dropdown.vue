<template>
  <div
    class="smq-forms-dropdown"
    :style="`width: ${width}px`"
  >
    <span v-if="label" class="smq-forms-dropdown-title" v-text="label" />
    <b-dd
      :lazy="true"
      :toggle-class="`smq-forms-dropdown-container ${borderless ? '-borderless' : ''} ${error ? '-error' : ''}`"
      variant="link"
      no-caret
      :disabled="disabled"
      boundary="viewport"
    >
      <template #button-content>
        <div
          class="smq-forms-dropdown-container-title"
        >
          <div class="d-flex align-items-center">
            <smq-icon-clock-time-four v-if="icon === 'clock'" class="mr-2" />
            <span
              v-if="activeItem && activeItem.title"
              class="smq-forms-dropdown-container-title-text"
              :class="[
                titleColor ? `-${titleColor}` : '',
                boldTitle ? '-bold_title' : '',
                dropdownType === 'filter' ? '-filter' : ''
              ]"
              v-text="activeItem && activeItem.title ? activeItem.title : null"
            />
            <span
              v-else-if="placeholder"
              class="smq-forms-dropdown-container-title-text -placeholder"
              v-text="placeholder"
            />
          </div>
          <smq-icon-chevron-down
            class="smq-forms-dropdown-container-title-chevron"
            :class="borderless ? '-borderless' : ''"
          />
        </div>
      </template>
      <div class="smq-forms-dropdown-container-items">
        <b-dd-item-btn
          v-for="(item, key) in currentItems"
          :key="key"
          button-class="smq-forms-dropdown-container-items-item"
          @click="setActiveItem(item)"
        >
          <div class="smq-forms-dropdown-container-items-item-container">
            {{ item && item.title ? item.title : null }}
          </div>
        </b-dd-item-btn>
      </div>
    </b-dd>
    <span
      v-if="message && error"
      class="smq-forms-input-message"
      :class="error ? '-error' : ''"
      v-text="message"
    />
  </div>
</template>

<script>
import SmqIconChevronDown from '../icons/smq-icon-chevron-down'
import SmqIconClockTimeFour from '../marketing/icons/smq-icon-clock-time-four'
export default {
  name: 'SmqFormDropdown',
  components: { SmqIconClockTimeFour, SmqIconChevronDown },
  props: {
    label: {
      type: String,
      default: null
    },
    items: {
      type: Array,
      default: () => []
    },
    width: {
      type: Number,
      default: null
    },
    titleColor: {
      type: String,
      default: null
    },
    defaultItem: {
      default: null
    },
    dropdownType: {
      type: String,
      default: null
    },
    icon: {
      type: String,
      default: null
    },
    boldTitle: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    placeholder: {
      type: String,
      default: null
    },
    borderless: {
      type: Boolean,
      default: null
    },
    error: {
      type: Boolean,
      default: false
    },
    message: {
      type: String,
      default: null
    },
    filterType: {
      type: String,
      default: null
    }
  },
  data () {
    return {
      pagination: [
        { title: 5, flag: '5' },
        { title: 10, flag: '10' },
        { title: 25, flag: '25' },
        { title: 50, flag: '50' },
        { title: null, flag: 'All' }
      ],
      activeItem: null
    }
  },
  computed: {
    changedPagination () {
      return this.pagination.map((item) => {
        if (item.flag === 'All') {
          item.title = this.$store.getters['dictionaries/getPagination'].total
        }
        return item
      })
    },
    currentItems () {
      return this.dropdownType === 'pagination' ? this.changedPagination : this.items
    },
    filter () {
      return this.$store.getters['dictionaries/getFilter']
    },
    resetFilter () {
      return this.$store.getters['dictionaries/getResetFilter']
    },
    currentFilter () {
      return this.$store.getters['dictionaries/getFilter'][this.filterType]
    }
  },
  watch: {
    defaultItem () {
      this.setDefaultItem()
    },
    resetFilter (newValue) {
      if (this.dropdownType === 'filter' && newValue) {
        this.activeItem = null
      }
    },
    currentFilter (newValue) {
      if (this.dropdownType === 'filter' && !newValue) {
        this.activeItem = null
        this.$store.dispatch('dictionaries/sendPageData')
      }
    }
  },
  created () {
    this.setDefaultItem()
  },
  methods: {
    setActiveItem (item) {
      this.activeItem = item
      this.$emit('selected-item', item)
      this.$store.commit('dictionaries/TOGGLE_RESET_FILTER', false)
    },
    setDefaultItem () {
      const defaultItem = this.defaultItem
      if (this.dropdownType === 'pagination') {
        if (this.activeItem && this.activeItem.flag === 'All') {
          this.activeItem = this.changedPagination.find(item => String(item.title) === String(this.defaultItem))
        } else if (this.defaultItem && this.defaultItem !== 'month' && this.defaultItem !== 'day') {
          this.activeItem = this.changedPagination.find(item => item.flag === String(this.defaultItem))
        }
      } else if (this.items && this.items.length) {
        this.activeItem = this.items.find(function (item) {
          return item && item.flag && item.flag === String(defaultItem)
        })
      } else {
        this.activeItem = this.items[0]
      }
    }
  }
}
</script>
