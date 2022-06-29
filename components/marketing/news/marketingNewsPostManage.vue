<template>
  <div class="marketing-news-post_create">
    <div class="marketing-news-post_create-head">
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
          />
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
            v-text="'Publish at'"
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
      <div class="marketing-news-post_create-head-close">
        <b-icon-x @click="closeModal" />
      </div>
    </div>
    <div class="marketing-news-post_create-head -border_top">
      <smq-form-input
        class="m-0"
        label="Post title"
        placeholder="Post title"
        :error="publishError && !currentPost.title"
        message="Required field"
        full-width
        v-model="currentPost.title"
        @changed-value="currentPostChanged($event, 'title')"
      />
    </div>
    <div class="marketing-news-post_create-body">
      <div class="mb-3">
        <b-textarea
          v-model="postArticle"
          class="marketing-news-post_create-body-textarea"
          :class="publishError && !currentPost.article ? '-error py-2 px-3' : ''"
          placeholder="Write something..."
        />
        <span
          v-if="publishError && !currentPost.article"
          class="error-text"
          v-text="'Required field'"
        />
      </div>
      <div class="d-flex align-items-center flex-wrap">
        <div
          v-if="titleImage"
          class="marketing-news-post_create-body-image">
          <img
            :src="titleImage"
            alt=""
          />
        </div>
        <div v-else>
          <div class="d-flex flex-column" :class="publishError ? 'error-logo' : ''">
            <smq-icon-post-main-logo />
          </div>
          <span
            v-if="publishError"
            class="error-text"
            v-text="'Required field'"
          />
        </div>
      </div>
    </div>
    <div class="marketing-news-post_create-settings">
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
    <div
      v-if="currentPost && !currentPost.id"
      class="marketing-news-post_create-forms"
    >
      <smq-form-button-small
        title="Save as Draft"
        variant="outline_primary"
        @handle-action="saveAsDraft"
      />
      <div v-if="currentPost.status !== 5" class="marketing-news-post_create-forms-dropdown">
        <smq-form-dropdown
          :width="140"
          icon="clock"
          :items="dropdownTypes"
          :default-item="activePostType"
          bold-title
          @selected-item="postTypeChanged"
        />
      </div>
      <smq-form-button-small
        v-if="activePostType === 'share_now'"
        title="Publish"
        variant="primary"
        @handle-action="createPost(5)"
      />
      <smq-form-button-small
        v-else-if="activePostType === 'schedule'"
        title="Schedule post"
        variant="primary"
        @handle-action="createPost(4)"
      />
    </div>
    <div
      v-else
      class="marketing-news-post_create-forms -edit"
    >
      <smq-form-button-small
        title="Save changes"
        variant="primary"
        @handle-action="updateCurrentPost"
      />
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import SmqIconMultipleOutline from '~/components/marketing/icons/smq-icon-multiple-outline'
import SmqIconTableLogo from '~/components/icons/smq-icon-table-logo'
import SmqFormButtonSmall from '~/components/forms/smq-form-button-small'
import SmqFormDropdown from '~/components/forms/smq-form-dropdown'
import SmqFormInput from '~/components/forms/smq-form-input'
import SmqIconPostMainLogo from '~/components/marketing/icons/smq-icon-post-main_logo'
export default {
  name: 'MarketingNewsPostManage',
  components: {
    SmqIconPostMainLogo,
    SmqFormInput,
    SmqFormDropdown,
    SmqFormButtonSmall,
    SmqIconMultipleOutline,
    SmqIconTableLogo
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
  watch: {
    newsStatus (newValue) {
      if (newValue.includes('post-status-changed')) {
        this.$emit('close-modal')
      }
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
