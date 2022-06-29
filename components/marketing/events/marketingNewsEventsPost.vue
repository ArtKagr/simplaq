<template>
  <div class="marketing-news-post_create">
    <div class="marketing-news-post_create-head flex-column">
      <div class="d-flex align-items-center justify-content-between w-100">
        <span
          class="loyalty-rewards-create-reward_filling-title"
          v-text="'Create news'"
        />
        <div class="marketing-news-post_create-head-close">
          <b-icon-x @click="closeModal" />
        </div>
      </div>
      <div class="d-flex align-items-center justify-content-between w-100 mt-4">
        <div
          class="marketing-news-post_create-head-block"
          :class="publishError && !currentPost.company_id ? '-error' : ''"
        >
          <label class="marketing-news-post_create-head-icon">
            <img
              v-if="currentPost && currentPost.company_id"
              width="48"
              height="48"
              :src="getCurrentPostLogo(currentPost.company_id)"
              alt="news-logo"
              style="border-radius: 100px;"
            >
            <smq-icon-table-logo v-else />
          </label>
          <div class="marketing-news-post_create-head-description">
          <span
            v-if="currentPost && currentPost.publish_at"
            class="marketing-news-post_create-head-description-button"
            v-text="moment(currentPost.publish_at).format('DD.MM.YYYY HH:mm')"
          />
            <span
              v-else
              class="marketing-news-post_create-head-description-button"
              v-text="'Belongs to'"
            />
            <smq-form-dropdown
              class="loyalty-receipts-head-dropdown"
              :items="companies"
              :default-item="currentPost.company_id"
              :width="160"
              placeholder="Company"
              borderless
              @selected-item="currentPostChanged($event.flag, 'company_id')"
            />
          </div>
        </div>
        <marketing-news-send-types />
      </div>
    </div>
    <span class="marketing-news-post_create-news_events-title" v-text="'This is news title'" />
    <div class="mb-2 px-4 pt-3">
      <b-textarea
        v-model="postArticleCopy"
        class="marketing-news-post_create-body-textarea"
        placeholder="Write something..."
        rows="3"
      />
      <span
        v-if="publishError && !currentPost.article"
        class="error-text"
        v-text="'Required field'"
      />
    </div>
    <div class="d-flex align-items-center px-4 mt-3 pb-4 border-bottom-300">
      <div class="mr-3">
        <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect y="8" width="72" height="72" rx="6" fill="#D0D7E2"/>
          <path fill-rule="evenodd" clip-rule="evenodd" d="M39.5672 40.9519C39.591 40.9751 39.614 40.999 39.6362 41.0237L46.0189 48.1104C46.575 48.7279 46.5156 49.6707 45.8861 50.2163C45.6081 50.4572 45.25 50.5901 44.8791 50.5901H26.5209C25.6809 50.5901 25 49.9222 25 49.0982C25 48.6955 25.166 48.3098 25.4603 48.0289L28.0645 45.5433C28.5425 45.0871 29.2678 44.9895 29.8533 45.3028L30.9107 45.8684C31.5051 46.1864 32.2423 46.0807 32.719 45.609L37.4163 40.9611C38.0077 40.3759 38.9707 40.3718 39.5672 40.9519ZM31.713 38C32.8717 38 33.8111 38.9393 33.8111 40.098C33.8111 41.2568 32.8717 42.1961 31.713 42.1961C30.5543 42.1961 29.615 41.2568 29.615 40.098C29.615 38.9393 30.5543 38 31.713 38Z" fill="white"/>
          <circle cx="68" cy="12" r="11.5" fill="white" stroke="#D0D7E2"/>
          <path d="M72.6668 8.27203L71.7268 7.33203L68.0002 11.0587L64.2735 7.33203L63.3335 8.27203L67.0602 11.9987L63.3335 15.7254L64.2735 16.6654L68.0002 12.9387L71.7268 16.6654L72.6668 15.7254L68.9402 11.9987L72.6668 8.27203Z" fill="#192638"/>
        </svg>
      </div>
      <div>
        <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect y="8" width="72" height="72" rx="6" fill="#D0D7E2"/>
          <path fill-rule="evenodd" clip-rule="evenodd" d="M39.5672 40.9519C39.591 40.9751 39.614 40.999 39.6362 41.0237L46.0189 48.1104C46.575 48.7279 46.5156 49.6707 45.8861 50.2163C45.6081 50.4572 45.25 50.5901 44.8791 50.5901H26.5209C25.6809 50.5901 25 49.9222 25 49.0982C25 48.6955 25.166 48.3098 25.4603 48.0289L28.0645 45.5433C28.5425 45.0871 29.2678 44.9895 29.8533 45.3028L30.9107 45.8684C31.5051 46.1864 32.2423 46.0807 32.719 45.609L37.4163 40.9611C38.0077 40.3759 38.9707 40.3718 39.5672 40.9519ZM31.713 38C32.8717 38 33.8111 38.9393 33.8111 40.098C33.8111 41.2568 32.8717 42.1961 31.713 42.1961C30.5543 42.1961 29.615 41.2568 29.615 40.098C29.615 38.9393 30.5543 38 31.713 38Z" fill="white"/>
          <circle cx="68" cy="12" r="11.5" fill="white" stroke="#D0D7E2"/>
          <path d="M72.6668 8.27203L71.7268 7.33203L68.0002 11.0587L64.2735 7.33203L63.3335 8.27203L67.0602 11.9987L63.3335 15.7254L64.2735 16.6654L68.0002 12.9387L71.7268 16.6654L72.6668 15.7254L68.9402 11.9987L72.6668 8.27203Z" fill="#192638"/>
        </svg>
      </div>
      <div class="ml-3">
        <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect y="8" width="72" height="72" rx="6" fill="#D0D7E2"/>
          <path fill-rule="evenodd" clip-rule="evenodd" d="M39.5672 40.9519C39.591 40.9751 39.614 40.999 39.6362 41.0237L46.0189 48.1104C46.575 48.7279 46.5156 49.6707 45.8861 50.2163C45.6081 50.4572 45.25 50.5901 44.8791 50.5901H26.5209C25.6809 50.5901 25 49.9222 25 49.0982C25 48.6955 25.166 48.3098 25.4603 48.0289L28.0645 45.5433C28.5425 45.0871 29.2678 44.9895 29.8533 45.3028L30.9107 45.8684C31.5051 46.1864 32.2423 46.0807 32.719 45.609L37.4163 40.9611C38.0077 40.3759 38.9707 40.3718 39.5672 40.9519ZM31.713 38C32.8717 38 33.8111 38.9393 33.8111 40.098C33.8111 41.2568 32.8717 42.1961 31.713 42.1961C30.5543 42.1961 29.615 41.2568 29.615 40.098C29.615 38.9393 30.5543 38 31.713 38Z" fill="white"/>
          <circle cx="68" cy="12" r="11.5" fill="white" stroke="#D0D7E2"/>
          <path d="M72.6668 8.27203L71.7268 7.33203L68.0002 11.0587L64.2735 7.33203L63.3335 8.27203L67.0602 11.9987L63.3335 15.7254L64.2735 16.6654L68.0002 12.9387L71.7268 16.6654L72.6668 15.7254L68.9402 11.9987L72.6668 8.27203Z" fill="#192638"/>
        </svg>
      </div>
    </div>
    <div class="marketing-news-post_create-settings">
      <div>
        <label
          for="post-title-upload"
          class="marketing-news-post_create-settings-button"
        >
          <smq-icon-multiple-outline />
        </label>
        <input
          id="post-title-upload"
          type="file"
          style="z-index: 1; display: none;"
          accept="image/*"
          ref="uploadPostTitle"
          @change="handleImageTitle"
          multiple
        />
      </div>
      <div>
        <label
          for="post-video-upload"
          class="marketing-news-post_create-settings-button"
        >
          <smq-icon-video-outline />
        </label>
        <input
          id="post-video-upload"
          type="file"
          style="z-index: 1; display: none;"
          accept="image/*"
          ref="uploadPostTitle"
          @change="handleImageTitle"
          multiple
        />
      </div>
    </div>
    <div
      v-if="currentPost && !currentPost.id"
      class="marketing-news-post_create-forms"
    >
      <smq-form-button-small
        title="Cancel"
        variant="outline_primary"
      />
      <div class="marketing-news-post_create-forms-dropdown">
        <smq-form-dropdown
          :width="140"
          icon="clock"
          :items="dropdownTypes"
          :default-item="activePostType"
          bold-title
        />
      </div>
      <smq-form-button-small
        title="Publish"
        variant="primary"
      />
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import MarketingNewsSendTypes from '../news/marketingNewsSendTypes'
import SmqIconTableLogo from '~/components/icons/smq-icon-table-logo'
import SmqFormDropdown from '~/components/forms/smq-form-dropdown'
import SmqFormButtonSmall from '~/components/forms/smq-form-button-small'
import SmqIconMultipleOutline from '~/components/marketing/icons/smq-icon-multiple-outline'
import SmqIconVideoOutline from '~/components/icons/smq-icon-video-outline'
// import SmqFormButtonSmall from '~/components/forms/smq-form-button-small'
// import SmqFormInput from '~/components/forms/smq-form-input'
// import SmqFormTextarea from '~/components/forms/smq-form-textarea'
export default {
  name: 'MarketingNewsEventsPost',
  components: {
    SmqIconVideoOutline,
    SmqFormButtonSmall,
    MarketingNewsSendTypes,
    SmqFormDropdown,
    SmqIconTableLogo,
    SmqIconMultipleOutline
    // SmqFormTextarea,
    // SmqFormInput,
    // SmqFormButtonSmall,
  },
  props: {
    close: {
      type: Function
    },
    schedulePostDate: {
      type: String,
      default: null
    }
  },
  data () {
    return {
      moment,
      postArticleCopy: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
      dropdownTypes: [
        { title: 'Share now', flag: 'share_now' },
        { title: 'Schedule', flag: 'schedule' }
      ],
      activePostType: 'share_now',
      files: [],
      image: '',
      publishError: false,
      currentPostCopy: null
    }
  },
  computed: {
    companies () {
      return this.$store.getters['tenants/getTenantsList'].map((tenant) => {
        return {
          title: tenant.title,
          flag: String(tenant.id)
        }
      })
    },
    newsStatus () {
      return this.$store.getters['news/getStatus']
    },
    postSubtitle () {
      if (this.activePostType === 'share_now') {
        return 'Share Now'
      } else if (this.schedulePostDate && this.activePostType === 'schedule') {
        return `${this.moment(this.schedulePostDate).format('DD.MM.YYYY')} at ${this.moment(this.schedulePostDate).format('HH:mm')}`
      } else {
        return 'Share Now'
      }
    },
    postArticle: {
      get () {
        return this.$store.getters['news/getCurrentPost'].article
      },
      set (newValue) {
        this.$store.commit('news/UPDATE_CURRENT_POST', { field: 'article', value: newValue })
      }
    },
    sidebarMode () {
      return this.$store.getters['news/getCurrentPostSidebarMode']
    },
    currentPost () {
      return this.$store.getters['news/getCurrentPost']
    },
    titleImage () {
      return this.$store.getters['news/getTitleImage']
    }
  },
  watch: {
    newsStatus (newValue) {
      if (newValue.includes('post-status-changed')) {
        this.$emit('close-modal')
      }
    }
  },
  created () {
    if (this.currentPost && this.currentPost.title_picture) {
      this.$store.commit('news/SAVE_NEWS_TITLE_IMAGE', this.currentPost.title_picture)
    }
    if (this.schedulePostDate) {
      this.activePostType = 'schedule'
    }
    this.currentPostCopy = { ...this.$store.getters['news/getCurrentPost'] }
  },
  destroyed () {
    this.activePostType = 'share_now'
  },
  methods: {
    closeModal () {
      if (this.sidebarMode === 'edit') {
        this.$store.commit('news/UPDATE_CURRENT_POST_SIDEBAR_MODE', 'view')
        this.$store.commit('news/SAVE_CURRENT_POST', this.currentPostCopy)
        this.$store.commit('news/CLEAR_NEWS_IMAGES')
      } else {
        this.$store.commit('news/CLEAR_CURRENT_POST')
      }
      this.close()
    },
    postTypeChanged (item) {
      if (
        item.flag === 'schedule' &&
        (this.currentPost.title_picture || this.titleImage) &&
        this.currentPost.article &&
        this.currentPost.title &&
        this.currentPost.company_id
      ) {
        this.publishError = false
        this.activePostType = item.flag
        this.$emit('show-schedule-calendar')
      } else {
        this.publishError = true
      }
    },
    async createPost (status) {
      if (
        this.titleImage &&
        this.currentPost.article &&
        this.currentPost.title &&
        this.currentPost.company_id
      ) {
        this.publishError = false
        await this.$store.commit('news/UPDATE_CURRENT_POST', { field: 'status', value: status })
        await this.$store.dispatch('news/createPost')
        await this.closeModal()
        await this.$store.commit('news/CLEAR_CURRENT_POST')
      } else {
        this.publishError = true
      }
    },
    async saveAsDraft () {
      await this.$store.commit('news/UPDATE_CURRENT_POST', { field: 'status', value: 0 })
      await this.$store.dispatch('news/createPost')
      await this.closeModal()
      await this.$store.commit('news/CLEAR_CURRENT_POST')
    },
    async updateStatus (status, publishAt = this.moment().format('YYYY-MM-DD HH:mm:ss')) {
      const publishDate = this.schedulePostDate ? this.schedulePostDate : publishAt
      if ((this.currentPost.title_picture || this.titleImage) && this.currentPost.article && this.currentPost.title) {
        this.publishError = false
        await this.$store.commit('news/UPDATE_CURRENT_POST', { field: 'status', value: status })
        if (status !== 0) {
          await this.$store.commit('news/UPDATE_CURRENT_POST', { field: 'publish_at', value: publishDate })
        }
        await this.$store.dispatch('news/updatePost', {
          postId: this.currentPost.id,
          status,
          title: this.currentPost.title,
          article: this.currentPost.article
        })
        await this.closeModal()
        await this.$store.commit('news/CLEAR_CURRENT_POST')
      } else {
        this.publishError = true
      }
    },
    async updateCurrentPost () {
      if ((this.currentPost.title_picture || this.titleImage) && this.currentPost.article && this.currentPost.title) {
        this.publishError = false
        await this.$store.dispatch('news/updatePost')
        this.close()
        this.$store.commit('news/UPDATE_CURRENT_POST_SIDEBAR_MODE', 'view')
        await this.$store.commit('news/CLEAR_CURRENT_POST')
      } else {
        this.publishError = true
      }
    },
    currentPostChanged (value, field) {
      this.$store.commit('news/UPDATE_CURRENT_POST', { field, value })
    },
    getCurrentPostLogo (companyId) {
      const result = this.$store.getters['tenants/getTenantsList'].find(tenant => Number(tenant.id) === Number(companyId))
      if (result && result.big_logo) {
        return result.big_logo
      } else {
        return null
      }
    },
    handleImageTitle (e) {
      const selectedImage = e.target.files[0]
      this.createArrayBuffer(selectedImage)
      this.createBase64Image(selectedImage)
    },
    createArrayBuffer (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        this.image = e.target.result
        this.$store.commit('news/SAVE_NEWS_IMAGE_TITLE', this.image)
        // this.$store.dispatch('news/uploadPostTitlePicture', this.image)
      }
      reader.readAsArrayBuffer(file)
    },
    createBase64Image (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        this.$store.commit('news/SAVE_NEWS_TITLE_IMAGE', e.target.result)
      }
      reader.readAsDataURL(file)
    }
    // deleteAttachment (attachment) {
    //   this.$store.dispatch('news/deleteNewsAttachment', attachment.id)
    // },
    // handleBinaryImage (payload) {
    //   this.$store.dispatch('news/addPostFiles', payload)
    // },
  }
}
</script>
