<template>
  <div class="marketing-news-current_post">
    <div class="d-flex flex-column">
      <div class="marketing-news-current_post-head">
        <div
          class="marketing-news-current_post-head-close"
          @click="closeSidebar"
        >
          <b-icon-x />
        </div>
        <div class="marketing-news-current_post-head-dropdown">
          <smq-form-dropdown
            :items="changedItems"
            :default-item="sidebarMode"
            @selected-item="setPostMode"
          />
        </div>
        <div
          v-if="sidebarMode === 'view'"
          class="marketing-news-current_post-head-buttons"
        >
          <smq-form-button-small
            v-if="currentPost && currentPost.status !== 6 && currentPost.status !== 0"
            class="mr-2"
            title="Archive"
            variant="outline_danger"
            icon="reject"
            @click.native="showCurrentPostReject"
          />
          <smq-form-button-small
            v-if="currentPost && currentPost.status !== 5 && currentPost.title_picture && currentPost.article"
            title="Publish"
            variant="primary"
            icon="approve"
            @click.native="postApprove"
          />
        </div>
      </div>
      <div class="marketing-news-current_post-info">
        <div class="marketing-news-current_post-info-description">
          <img
            v-if="currentPost && currentPost.company_id"
            :src="getStoredPostLogo(currentPost.company_id)"
            :alt="`title-picture-${currentPost.id}`"
            class="marketing-news-current_post-info-description-image"
          />
          <div
            v-else
            class="marketing-news-current_post-info-description-image"
          >
            <smq-icon-image-square  />
          </div>
          <div class="marketing-news-current_post-info-description-text">
          <span
            class="marketing-news-current_post-info-description-text-title"
            v-text="currentPost && currentPost.company ? currentPost.company.title : null"
          />
            <span
              class="marketing-news-current_post-info-description-text-date_time"
              v-text="`${currentPost.publish_at ? moment(currentPost.publish_at).format('DD.MM.YYYY HH:mm') : ''}`"
            />
          </div>
        </div>
        <div class="marketing-news-current_post-info-send_types">
<!--          <marketing-news-send-types />-->
        </div>
      </div>
      <div class="marketing-news-post_create-head -border_bottom">
        <span v-text="currentPost.title" class="-bold h6 m-0" />
      </div>
      <div
        class="marketing-news-current_post-content"
        :class="currentPost.article ? '' : 'mt-4'"
      >
        <span
          v-if="currentPost.article"
          class="marketing-news-post_create-body-textarea mt-4 mb-4 px-4"
          v-text="currentPost.article"
        />
        <div
          v-if="currentPost && currentPost.title_picture"
          class="marketing-news-current_post-content-images"
        >
          <div class="marketing-news-current_post-content-images-image">
            <img :src="currentPost.title_picture" :alt="`attachment-${currentPost.id}`" />
          </div>
        </div>
      </div>
    </div>
    <div class="marketing-news-current_post-comments">
      <div class="marketing-news-current_post-comments-head">
        <div class="marketing-news-current_post-comments-head-title">
          <div class="marketing-news-current_post-comments-head-title-icon">
            <smq-icon-post-my-comments />
          </div>
          <span
            class="marketing-news-current_post-comments-head-title-text"
            v-text="'My comments'"
          />
        </div>
        <div class="marketing-news-current_post-comments-head-icon">
          <smq-icon-chevron-down />
        </div>
      </div>
    </div>
    <b-modal v-model="isCurrentPostRejectShown" hide-header hide-footer centered hide-backdrop>
      <template #default="{ close }">
        <marketing-news-post-delete :close="close" @close-post="closeSidebar" />
      </template>
    </b-modal>
  </div>
</template>

<script>
import moment from 'moment'
import MarketingNewsPostDelete from './marketingNewsPostDelete'
import SmqFormDropdown from '~/components/forms/smq-form-dropdown'
import SmqIconImageSquare from '~/components/icons/smq-icon-image-square'
import SmqIconPostMyComments from '~/components/marketing/icons/smq-icon-post-my-comments'
import SmqIconChevronDown from '~/components/icons/smq-icon-chevron-down'
import SmqFormButtonSmall from '~/components/forms/smq-form-button-small'
// import MarketingNewsPostReject from '~/components/marketing/news/marketingNewsPostReject'
// import MarketingNewsSendTypes from '~/components/marketing/news/marketingNewsSendTypes'

export default {
  name: 'MarketingNewsCurrentPost',
  components: {
    MarketingNewsPostDelete,
    SmqFormButtonSmall,
    SmqIconChevronDown,
    SmqIconPostMyComments,
    SmqIconImageSquare,
    SmqFormDropdown
    // MarketingNewsPostReject,
    // MarketingNewsSendTypes,
  },
  props: {
    close: {
      type: Function
    }
  },
  data () {
    return {
      moment,
      isCurrentPostRejectShown: false,
      items: [
        { title: 'View', flag: 'view' },
        { title: 'Edit', flag: 'edit' },
        { title: 'Reschedule', flag: 'reschedule' },
        { title: 'Archive', flag: 'archive' }
        // { title: 'Cancel schedule', flag: 'cancel_schedule' },
        // { title: 'Delete', flag: 'delete' }
      ],
      currentPost: {
        id: null,
        status: null,
        title: null,
        article: null,
        news_attachments: [],
        title_picture: null,
        publish_at: null,
        company_id: null
      }
    }
  },
  watch: {
    currentPostCopy: {
      handler (newValue, oldValue) {
        if (newValue.id !== oldValue.id) {
          this.currentPost = JSON.parse(JSON.stringify(newValue))
        }
      },
      deep: true
    },
    newsStatus (newValue) {
      switch (newValue) {
        case 'post-successfully-created':
          this.$emit('close-sidebar')
          break
        case 'post-successfully-updated':
          this.$emit('close-sidebar')
          break
        case 'post-successfully-archived':
          this.$emit('close-sidebar')
          break
      }
    }
  },
  computed: {
    changedItems () {
      if (this.currentPost.status === 6) {
        let itemsCopy = JSON.parse(JSON.stringify(this.items))
        itemsCopy = itemsCopy.filter(item => item.flag !== 'archive')
        return itemsCopy.map(function (item) {
          if (item.flag === 'reschedule') {
            item = { title: 'Schedule', flag: 'schedule' }
          }
          return item
        })
      } else if (!this.currentPost.title_picture || !this.currentPost.article) {
        return [
          { title: 'View', flag: 'view' },
          { title: 'Edit', flag: 'edit' },
          { title: 'Delete', flag: 'delete' }
        ]
      } else if (this.currentPost.publish_at) {
        return this.items
      } else {
        return this.items.map(function (item) {
          if (item.flag === 'reschedule') {
            item = { title: 'Schedule', flag: 'schedule' }
          }
          return item
        })
      }
    },
    newsStatus () {
      return this.$store.getters['news/getStatus']
    },
    sidebarMode () {
      return this.$store.getters['news/getCurrentPostSidebarMode']
    },
    currentPostCopy () {
      return this.$store.getters['news/getCurrentPost']
    }
  },
  created () {
    this.$store.commit('news/UPDATE_CURRENT_POST_SIDEBAR_MODE', 'view')
  },
  destroyed () {
    this.$store.commit('news/UPDATE_CURRENT_POST_SIDEBAR_MODE', 'view')
  },
  methods: {
    showCurrentPostReject () {
      this.isCurrentPostRejectShown = true
    },
    async postApprove () {
      await this.$store.commit('news/UPDATE_STORED_POST', { field: 'status', value: 5 })
      await this.$store.dispatch('news/publishPostImmediately', { postId: this.currentPost.id })
    },
    postReject () {
      this.$emit('close-sidebar')
      this.$emit('show-reject-post-alert')
    },
    closeSidebar () {
      this.$emit('close-sidebar')
      this.$store.commit('news/CLEAR_CURRENT_POST')
    },
    updatePost () {
      this.$store.dispatch('news/updatePost', this.currentPost.id)
    },
    setPostMode (mode) {
      this.$store.commit('news/UPDATE_CURRENT_POST_SIDEBAR_MODE', mode.flag)
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
