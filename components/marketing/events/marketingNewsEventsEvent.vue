<template>
  <div class="marketing-news-post_create">
    <div class="marketing-news-post_create-head flex-column">
      <div class="d-flex align-items-center justify-content-between w-100">
        <span
          class="loyalty-rewards-create-reward_filling-title"
          v-text="'Create event'"
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
    <div class="d-flex justify-content-between w-100">
      <div class="px-4 w-50">
        <smq-form-input
          label="Event title"
          class="mb-4"
          message="Required field"
        />
        <div class="marketing-events-new_event-content-body-date_time">
          <smq-form-input
            label="Start Date"
            append="calendar"
            class="mr-3"
            disabled
          />
          <smq-form-input
            label="Start Time"
            append="time"
            disabled
          />
        </div>
        <div class="marketing-events-new_event-content-body-date_time">
          <smq-form-input
            label="End Date"
            append="calendar"
            class="mr-3"
            disabled
          />
          <smq-form-input
            label="End Time"
            append="time"
            disabled
          />
        </div>
        <div
          class="marketing-events-new_event-content-body-add"
        >
          <div class="marketing-events-new_event-content-body-add-icon">
            <smq-icon-events-event-remove v-if="true" />
            <smq-icon-events-event-add v-else />
          </div>
          <span
            class="marketing-events-new_event-content-body-add-text"
            v-text="'Remove End Date and Time'"
          />
        </div>
        <div class="marketing-events-new_event-content-body-checkbox">
          <div class="marketing-events-new_event-content-body-checkbox-icon">
            <smq-icon-events-event-checkbox-fill v-if="false" />
            <smq-icon-events-event-checkbox-blank v-else  />
          </div>
          <span
            class="marketing-events-new_event-content-body-checkbox-text"
            v-text="'Reservation required'"
          />
        </div>
        <SmqFormTextarea
          label="Event description"
          class="marketing-events-new_event-content-body-description"
          message="Required field"
        />
      </div>
      <div class="pr-4 mr-2 w-50">
        <div>
          <span class="field_title" v-text="'Event photo'"/>
          <drag-drop-image
            class="mt-1"
            :height="200"
            :width="300"
            message="Required field"
          />
        </div>
      </div>
    </div>
    <div class="marketing-news-post_create-forms -news_events mt-2">
      <smq-form-button-small title="Cancel" variant="outline_primary" class="mr-2" />
      <smq-form-button-small title="Send to approve" variant="primary" />
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import MarketingNewsSendTypes from '../news/marketingNewsSendTypes'
import SmqIconTableLogo from '~/components/icons/smq-icon-table-logo'
import SmqFormButtonSmall from '~/components/forms/smq-form-button-small'
import SmqFormDropdown from '~/components/forms/smq-form-dropdown'
import SmqFormInput from '~/components/forms/smq-form-input'
import SmqIconEventsEventAdd from '~/components/marketing/events/icons/smq-icon-events-event_add'
import SmqIconEventsEventRemove from '~/components/marketing/events/icons/smq-icon-events-event_remove'
import SmqIconEventsEventCheckboxBlank from '~/components/marketing/events/icons/smq-icon-events-event-checkbox-blank'
import SmqIconEventsEventCheckboxFill from '~/components/marketing/events/icons/smq-icon-events-event-checkbox-fill'
import SmqFormTextarea from '~/components/forms/smq-form-textarea'
import DragDropImage from '~/components/dragDropImage'
export default {
  name: 'MarketingNewsEventsEvent',
  components: {
    SmqFormTextarea,
    MarketingNewsSendTypes,
    SmqFormInput,
    SmqFormDropdown,
    SmqFormButtonSmall,
    SmqIconTableLogo,
    SmqIconEventsEventAdd,
    SmqIconEventsEventRemove,
    SmqIconEventsEventCheckboxBlank,
    SmqIconEventsEventCheckboxFill,
    DragDropImage
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
