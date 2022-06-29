<template>
  <div class="marketing-news">
    <div class="marketing-news-content">
      <div class="marketing-news-content-head">
        <span class="marketing-news-content-head-title">News</span>
        <b-button
          class="marketing-news-content-head-button"
          variant="primary"
          @click="createNewPost"
        >
          <div class="marketing-news-content-head-button-icon">
            <smq-icon-plus />
          </div>
          <span class="marketing-news-content-head-button-text">New post</span>
        </b-button>
      </div>
      <div class="marketing-news-content-menu">
        <div
          v-for="item in menu"
          :key="item.flag"
          :class="item.flag === activeMenuItem ? '-active' : ''"
          class="marketing-news-content-menu-item"
          @click="getCurrentNewsList(item.flag)"
        >
          <span
            class="marketing-news-content-menu-item-title"
            :class="item.flag === activeMenuItem ? '-active' : ''"
            v-text="item.title"
          />
          <div
            v-if="item.counter"
            class="marketing-news-content-menu-item-counter"
            :class="[item.flag === activeMenuItem ? '-active' : '', `-${item.flag}`]"
          >
            <span v-text="item.counter" />
          </div>
        </div>
      </div>
      <div class="marketing-news-content-submenu">
        <smq-form-input
          v-model="newsSearch"
          class="m-0"
          placeholder="Search..."
          dropdown-type="filter"
          prepend="search"
          @changed-value="newsSearching"
        />
      </div>
      <div
        v-if="posts && posts.length"
        class="marketing-news-content-posts"
      >
        <div
          v-for="(post, key) in posts"
          :key="key"
          class="marketing-news-content-posts-post"
          :class="(post.id === currentPost.id) && isCurrentPostOpened ? '-active' : ''"
          @click="openCurrentPost(post)"
          v-b-toggle.current-post
        >
          <div
            v-if="post && post.title_picture"
            class="marketing-news-content-posts-post-image_container"
          >
            <img
              :src="post.title_picture"
              :alt="`attachment-${post.id}`"
              class="marketing-news-content-posts-post-image_container-image"
            />
            <smq-icon-post-attachments class="marketing-news-content-posts-post-image_container-icon" />
          </div>
          <div
            v-else
            class="marketing-news-content-posts-post-image_container"
          >
            <smq-icon-post-photo />
          </div>
          <div class="marketing-news-content-posts-post-content">
            <div class="d-flex w-100">
              <div class="marketing-news-content-posts-post-content-type">
                <div
                  class="marketing-news-content-posts-post-content-type-marker"
                  :class="`-${getNewsStatus(post.status).toLowerCase()}`"
                />
                <span
                  class="marketing-news-content-posts-post-content-type-title"
                  v-text="getNewsStatus(post.status)"
                />
              </div>
            </div>
            <div class="d-flex flex-column">
              <div class="marketing-news-current_post-info-description my-3">
                <img
                  v-if="post && post.company_id"
                  :src="getStoredPostLogo(post.company_id)"
                  :alt="`title-picture-${post.id}`"
                  class="marketing-news-current_post-info-description-image"
                />
                <div v-else class="marketing-news-current_post-info-description-image">
                  <smq-icon-image-square  />
                </div>
                <div class="marketing-news-current_post-info-description-text">
                  <span
                    class="marketing-news-current_post-info-description-text-title"
                    v-text="post && post.company ? post.company.title : null"
                  />
                </div>
              </div>
            </div>
            <span
              class="marketing-news-current_post-info-description-text-title m-0"
              v-text="post && post.title ? post.title : null"
            />
            <span class="marketing-news-content-posts-post-content-text mt-0">
              {{ post.article }}
            </span>
            <div
              v-if="post.publish_at"
              class="marketing-news-content-posts-post-content-border"
            />
            <div
              v-if="post.publish_at"
              class="marketing-news-content-posts-post-content-created_at"
            >
              <div class="marketing-news-content-posts-post-content-created_at-icon">
                <smq-icon-clock-time-four-outline />
              </div>
              <span
                class="marketing-news-content-posts-post-content-created_at-value"
                v-text="moment(post.publish_at).format('DD.MM.YYYY HH:mm')"
              />
            </div>
            <div class="marketing-news-content-posts-post-content-logo">
              <smq-icon-table-logo />
            </div>
          </div>
        </div>
      </div>
      <div v-else-if="searchMode">
        <search-error :query="filter.article" />
      </div>
    </div>
    <smq-form-pagination :sub-route="currentNewsType" />
    <b-modal
      v-model="isPostCreateShown"
      hide-header
      hide-footer
      centered
      hide-backdrop
      no-close-on-backdrop
    >
      <template #default="{ close }">
        <marketing-news-post-manage
          :close="close"
          :schedule-post-date="schedulePostDate"
          @show-schedule-calendar="showScheduleCalendar"
          @close-modal="close()"
        />
      </template>
    </b-modal>
    <b-modal
      v-model="isScheduleCalendarShown"
      hide-header
      hide-footer
      centered
      hide-backdrop
      no-close-on-backdrop
      @hidden="scheduleCalendarIsHidden"
    >
      <template #default="{ close }">
        <marketing-news-schedule-calendar
          :close="close"
          @cancel="showPostCreate"
          @apply="setPostScheduleDate"
        />
      </template>
    </b-modal>
    <b-modal
      v-model="isPostDeleteShown"
      hide-header
      hide-footer
      centered
      hide-backdrop
      no-close-on-backdrop
    >
      <template #default="{ close }">
        <marketing-news-post-delete
          :close="close"
        />
      </template>
    </b-modal>
    <b-sidebar
      id="current-post"
      ref="current-post"
      right
      no-header
      backdrop
      @hidden="currentPostHidden"
    >
      <template #default="{ hide }">
        <marketing-news-current-post
          :close="hide"
          @close-sidebar="closeCurrentPost(hide)"
          @show-approve-post-alert="showAlert('The post has been successfully approved.')"
          @show-delete-post-alert="showAlert('The post has been successfully deleted.')"
          @show-reject-post-alert="showAlert('The post has been rejected and send back to tenant.')"
        />
      </template>
    </b-sidebar>
    <smq-form-alert
      v-model="isAlertShown"
      :title="alertTitle"
      @hide-alert="isAlertShown = false"
    />
  </div>
</template>

<script>
import moment from 'moment'
import SmqFormPagination from '~/components/forms/smq-form-pagination'
import SmqIconPlus from '~/components/icons/smq-icon-plus'
import SmqIconPostPhoto from '~/components/marketing/icons/smq-icon-post-photo'
import SmqIconClockTimeFourOutline from '~/components/marketing/icons/smq-icon-clock-time-four-outline'
import SmqIconTableLogo from '~/components/icons/smq-icon-table-logo'
// import MarketingNewsPostCreate from '~/components/marketing/news/marketingNewsPostCreate'
import MarketingNewsScheduleCalendar from '~/components/marketing/news/marketingNewsScheduleCalendar'
import MarketingNewsCurrentPost from '~/components/marketing/news/marketingNewsCurrentPost'
import SmqFormAlert from '~/components/forms/smq-form-alert'
import SmqIconPostAttachments from '~/components/marketing/icons/smq-icon-post-attachments'
import MarketingNewsPostDelete from '~/components/marketing/news/marketingNewsPostDelete'
import SmqFormInput from '~/components/forms/smq-form-input'
import SmqIconImageSquare from '~/components/icons/smq-icon-image-square'
import SearchError from '~/components/searchError'
import MarketingNewsPostManage from '~/components/marketing/news/marketingNewsPostManage'
export default {
  name: 'MarketingNews',
  components: {
    MarketingNewsPostManage,
    SearchError,
    SmqIconImageSquare,
    SmqFormInput,
    MarketingNewsPostDelete,
    SmqIconPostAttachments,
    SmqFormAlert,
    MarketingNewsCurrentPost,
    MarketingNewsScheduleCalendar,
    // MarketingNewsPostCreate,
    SmqIconTableLogo,
    SmqIconClockTimeFourOutline,
    SmqIconPostPhoto,
    SmqFormPagination,
    SmqIconPlus
  },
  data () {
    return {
      moment,
      isPostCreateShown: false,
      isScheduleCalendarShown: false,
      isAlertShown: false,
      alertTitle: null,
      schedulePostDate: null,
      isCurrentPostOpened: false,
      isPostDeleteShown: false,
      newsSearch: null
    }
  },
  computed: {
    activeMenuItem () {
      return this.$store.getters['news/getActiveNewsMenuItem']
    },
    menu () {
      return this.$store.getters['news/getNewsMenu']
    },
    posts () {
      return this.$store.getters['news/getNewsList']
    },
    currentPost () {
      return this.$store.getters['news/getCurrentPost']
    },
    currentNewsType () {
      return this.$store.getters['news/getCurrentNewsType']
    },
    sidebarMode () {
      return this.$store.getters['news/getCurrentPostSidebarMode']
    },
    status () {
      return this.$store.getters['dictionaries/getStatus']
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
  watch: {
    async sidebarMode (newValue) {
      if (newValue === 'schedule') {
        this.isScheduleCalendarShown = true
      } else if (newValue === 'reschedule') {
        this.isScheduleCalendarShown = true
      } else if (newValue === 'edit') {
        this.isPostCreateShown = true
      } else if (newValue === 'cancel_schedule') {
        await this.$store.dispatch('news/updatePostStatus', {
          postId: this.currentPost.id,
          status: 0,
          publish_at: null
        })
        this.$refs['current-post'].hide()
        await this.$store.commit('news/UPDATE_CURRENT_POST_SIDEBAR_MODE', 'view')
      } else if (newValue === 'archive') {
        this.isPostDeleteShown = true
      }
    },
    status (newValue) {
      switch (newValue) {
        case 'post-successfully-created':
          this.$store.commit('news/SET_ACTIVE_NEWS_MENU_ITEM', 'all_posts')
          this.$refs['current-post'].hide()
          break
        case 'post-successfully-updated':
          this.isPostCreateShown = false
          this.$refs['current-post'].hide()
          break
        case 'post-successfully-archived':
          this.$refs['current-post'].hide()
          break
      }
    }
  },
  created () {
    this.$store.dispatch('dictionaries/updateSortPaginationFilter', this.$route.query)
    this.$store.commit('dictionaries/UPDATE_SOURCE', 'news')
    this.$store.dispatch('tenants/fetchTenantsList')
    this.setFilters()
    // this.$store.dispatch('news/fetchNewsStatuses')
  },
  methods: {
    setFilters () {
      if (this.routeQuery && this.routeQuery.article) {
        this.newsSearch = this.routeQuery.article
      }
    },
    async newsSearching (value) {
      this.newsSearch = value
      if (value.split('').length > 2) {
        this.$store.commit('dictionaries/UPDATE_SEARCH_MODE', true)
        await this.$store.commit('dictionaries/UPDATE_FILTER', { field: 'article', value: this.newsSearch })
      } else if (value === '') {
        this.$store.commit('dictionaries/UPDATE_SEARCH_MODE', false)
        await this.$store.commit('dictionaries/UPDATE_FILTER', { field: 'article', value: null })
        await this.$store.dispatch('news/fetchNews', { page: 1, perPage: 10 })
      }
    },
    getCurrentNewsList (item) {
      this.$store.commit('news/SET_ACTIVE_NEWS_MENU_ITEM', item)
      this.$store.dispatch('news/fetchNews', { page: 1, perPage: 10 })
    },
    getPostTypeTitle (type) {
      if (type === 'draft') {
        return 'Draft'
      } else if (type === 'pending_approval') {
        return 'Pending approval'
      } else if (type === 'rejected') {
        return 'Rejected'
      } else if (type === 'scheduled') {
        return 'Scheduled'
      } else if (type === 'published') {
        return 'Published'
      } else if (type === 'archived') {
        return 'Archived'
      }
    },
    createNewPost () {
      // await this.$store.commit('news/CLEAR_STORED_POST')
      // await this.$store.dispatch('news/createPost')
      this.schedulePostDate = null
      this.isPostCreateShown = true
      this.isScheduleCalendarShown = false
    },
    showPostCreate () {
      this.isScheduleCalendarShown = false
      if (this.sidebarMode === 'view') {
        this.isPostCreateShown = true
      }
    },
    showScheduleCalendar () {
      this.isPostCreateShown = false
      this.isScheduleCalendarShown = true
    },
    setPostScheduleDate (date) {
      if (this.sidebarMode === 'schedule' || this.sidebarMode === 'reschedule') {
        this.$store.commit('news/UPDATE_CURRENT_POST', { field: 'publish_at', value: date })
        this.$store.commit('news/UPDATE_CURRENT_POST', { field: 'status', value: 4 })
        this.$store.dispatch('news/updatePost')
        this.isScheduleCalendarShown = false
        this.$store.commit('news/UPDATE_CURRENT_POST_SIDEBAR_MODE', 'view')
      } else {
        this.showPostCreate()
        this.$store.commit('news/UPDATE_CURRENT_POST', { field: 'publish_at', value: date })
        this.schedulePostDate = date
      }
    },
    showAlert (alertTitle) {
      this.alertTitle = alertTitle
      this.isAlertShown = true
    },
    openCurrentPost (post) {
      this.isCurrentPostOpened = true
      this.$store.commit('news/SAVE_CURRENT_POST', post)
    },
    closeCurrentPost (hide) {
      this.isCurrentPostOpened = false
      hide()
    },
    currentPostHidden () {
      this.$store.commit('news/CLEAR_CURRENT_POST')
    },
    getNewsStatus (status) {
      if (status === 0) {
        return 'Draft'
      } else if (status === 1) {
        return 'Pending approval'
      } else if (status === 3) {
        return 'Rejected'
      } else if (status === 4) {
        return 'Scheduled'
      } else if (status === 5) {
        return 'Published'
      } else if (status === 6) {
        return 'Archived'
      } else {
        return 'Unknown'
      }
    },
    scheduleCalendarIsHidden () {
      if (this.sidebarMode !== 'edit') {
        this.$store.commit('news/UPDATE_CURRENT_POST_SIDEBAR_MODE', 'view')
      }
    },
    getStoredPostLogo (companyId) {
      const result = this.$store.getters['tenants/getTenantsList'].find(tenant => Number(tenant.id) === Number(companyId))
      if (result) {
        return result.big_logo
      } else {
        return null
      }
    }
  }
}
</script>
