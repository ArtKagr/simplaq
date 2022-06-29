<template>
  <div class="smq-forms-pagination">
    <span
      class="smq-forms-pagination-requests"
      v-text="pagination.total + ' requests'"
    />
    <b-pagination
      v-if="pagination.total > 0"
      class="smq-forms-pagination-body"
      v-model="currentPage"
      :per-page="perPage"
      :total-rows="pagination.total"
      last-number
      @change="sendPageData ({ page: $event, perPage })"
    >
      <template #first-text>
        <smq-icon-chevron-double-left class="smq-forms-pagination-body-first_page" />
      </template>
      <template #prev-text>
        <smq-icon-chevron-left class="smq-forms-pagination-body-previous_page" />
      </template>
      <template #next-text>
        <smq-icon-chevron-right class="smq-forms-pagination-body-next_page" />
      </template>
      <template #last-text>
        <smq-icon-chevron-double-right class="smq-forms-pagination-body-last_page" />
      </template>
      <template #page="{ page, active }">
        <span class="smq-forms-pagination-body-text -active" v-if="active">{{ page }}</span>
        <span class="smq-forms-pagination-body-text" v-else>{{ page }}</span>
      </template>
    </b-pagination>
    <div class="smq-forms-pagination-per_page">
      <span class="smq-forms-pagination-per_page-text">View</span>
      <smq-form-dropdown
        class="smq-forms-pagination-per_page-body"
        dropdown-type="pagination"
        :default-item="perPage"
        :width="56"
        @selected-item="sendData ({ perPage: $event.title, page: 1 })"
      />
      <span class="smq-forms-pagination-per_page-text">items per page</span>
    </div>
  </div>
</template>

<script>
import SmqIconChevronDoubleLeft from '../icons/smq-icon-chevron-double-left'
import SmqIconChevronDoubleRight from '../icons/smq-icon-chevron-double-right'
import SmqIconChevronRight from '../icons/smq-icon-chevron-right'
import SmqIconChevronLeft from '../icons/smq-icon-chevron-left'
import SmqFormDropdown from './smq-form-dropdown'
export default {
  name: 'smqFormPagination',
  components: {
    SmqFormDropdown,
    SmqIconChevronLeft,
    SmqIconChevronRight,
    SmqIconChevronDoubleRight,
    SmqIconChevronDoubleLeft
  },
  props: {
    subRoute: {
      type: String,
      default: null
    }
  },
  // watch: {
  //   pagination: {
  //     handler (newValue) {
  //       this.$router.push({
  //         query: {
  //           page: String(newValue.current_page),
  //           per_page: String(newValue.per_page)
  //         }
  //       })
  //     },
  //     deep: true
  //   }
  // },
  computed: {
    source () {
      return this.$store.getters['dictionaries/getSource']
    },
    pagination () {
      return this.$store.getters['dictionaries/getPagination']
    },
    sort () {
      return this.$store.getters['dictionaries/getSort']
    },
    filter () {
      return this.$store.getters['dictionaries/getFilter']
    },
    currentPage: {
      get () {
        return String(this.pagination.current_page ? this.pagination.current_page : this.$route.query.current_page)
      },
      set (newValue) {
        this.$store.commit('dictionaries/UPDATE_PAGINATION_FIELD', { field: 'current_page', value: newValue })
      }
    },
    perPage () {
      return this.$route.query.per_page ? this.$route.query.per_page : this.pagination.per_page
    }
  },
  methods: {
    sendPageData (payload) {
      this.$store.dispatch('dictionaries/sendPageData', payload)
    },
    async sendData (payload) {
      await this.$store.commit('dictionaries/UPDATE_PAGINATION_FIELD', { field: 'current_page', value: payload.page || 1 })
      await this.$store.commit('dictionaries/UPDATE_PAGINATION_FIELD', { field: 'per_page', value: payload.perPage || 10 })
      await this.$store.dispatch('dictionaries/sendPageData', payload)
    }
  }
}
</script>
