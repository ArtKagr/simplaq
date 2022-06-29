<template>
  <div class="marketing-news-post_create">
    <div class="marketing-news-post_create-head">
      <label class="marketing-news-post_create-head-icon">
        <template v-if="sidebarMode === 'view'">
          <img
            v-if="storedPost && storedPost.company_id"
            width="48"
            height="48"
            :src="getStoredPostLogo(storedPost.company_id)"
            alt="logo"
            style="border-radius: 100px;"
          />
          <smq-icon-table-logo v-else/>
        </template>
        <template v-else>
          <img
            v-if="currentPost && currentPost.company_id"
            width="48"
            height="48"
            :src="getStoredPostLogo(currentPost.company_id)"
            alt="news-logo"
            style="border-radius: 100px;"
          />
          <smq-icon-table-logo v-else />
        </template>
      </label>
      <div class="marketing-news-post_create-head-description">
        <smq-form-dropdown
          v-if="sidebarMode === 'view'"
          class="loyalty-receipts-head-dropdown"
          :items="companies"
          :default-item="storedPost.company_id"
          :width="160"
          placeholder="Company"
          borderless
          @selected-item="companyChanged($event.flag, 'company_id')"
        />
        <smq-form-dropdown
          v-else
          class="loyalty-receipts-head-dropdown"
          :items="companies"
          :default-item="currentPost.company_id"
          :width="160"
          placeholder="Company"
          borderless
          @selected-item="currentPostChanged($event.flag, 'company_id')"
        />
        <template v-if="sidebarMode === 'view'">
          <span
            v-if="storedPostId"
            class="marketing-news-post_create-head-description-button"
            v-text="postSubtitle"
          />
          <span
            v-else
            class="marketing-news-post_create-head-description-button"
            v-text="postSubtitle"
          />
        </template>
        <span
          v-else-if="currentPost && currentPost.publish_at"
          class="marketing-news-post_create-head-description-button"
          v-text="moment(currentPost.publish_at).format('DD.MM.YYYY HH:mm')"
        />
      </div>
      <div class="marketing-news-post_create-head-close">
        <b-icon-x v-if="sidebarMode === 'view' || sidebarMode === 'edit'" @click="closeModal" />
      </div>
<!--      <marketing-news-send-types v-if="sidebarMode === 'edit'" />-->
    </div>
    <div class="marketing-news-post_create-head -border_top">
<!--      <label-->
<!--        v-if="sidebarMode === 'view'"-->
<!--        class="marketing-news-post_create-head-icon"-->
<!--      >-->
<!--        <input-->
<!--          id="post-title-upload"-->
<!--          type="file"-->
<!--          style="z-index: 1; display: none;"-->
<!--          accept="image/*"-->
<!--          ref="uploadPostTitle"-->
<!--          @change="handleImageTitle"-->
<!--          multiple-->
<!--        />-->
<!--        <smq-icon-table-logo v-if="!postImageTitle.length" for="post-title-upload"/>-->
<!--        <img-->
<!--          for="post-title-upload"-->
<!--          v-else-->
<!--          width="48"-->
<!--          height="48"-->
<!--          :src="postImageTitle"-->
<!--          alt=""-->
<!--          style="border-radius: 100px;"-->
<!--        />-->
<!--      </label>-->
<!--      <label-->
<!--        v-else-->
<!--        class="marketing-news-post_create-head-icon"-->
<!--      >-->
<!--        <input-->
<!--          id="current-post-title-upload"-->
<!--          type="file"-->
<!--          style="z-index: 1; display: none;"-->
<!--          accept="image/*"-->
<!--          ref="uploadPostTitle"-->
<!--          @change="handleImageTitle"-->
<!--          multiple-->
<!--        />-->
<!--        <img-->
<!--          for="current-post-title-upload"-->
<!--          v-if="currentPost.title_picture"-->
<!--          width="48"-->
<!--          height="48"-->
<!--          :src="currentPost.title_picture"-->
<!--          alt=""-->
<!--          style="border-radius: 100px;"-->
<!--        />-->
<!--        <smq-icon-table-logo v-else for="current-post-title-upload"/>-->
<!--      </label>-->
      <smq-form-input
        v-if="sidebarMode === 'view'"
        class="m-0"
        label="Post title"
        placeholder="Post title"
        full-width
        v-model="storedPost.title"
        @changed-value="companyChanged($event, 'title')"
      />
      <smq-form-input
        v-else
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
        <template v-if="sidebarMode === 'view'">
          <img
            v-if="storedPost && storedPost.title_picture"
            width="72"
            height="72"
            style="border-radius: 6px;"
            :src="storedPost.title_picture"
            alt=""
          />
          <smq-icon-post-main-logo v-else />
        </template>
        <template v-else>
          <img
            v-if="currentPost && currentPost.title_picture"
            width="72"
            height="72"
            style="border-radius: 6px;"
            :src="currentPost.title_picture"
            alt=""
          />
          <div v-else>
            <div
              class="d-flex flex-column"
              :class="publishError ? 'error-logo' : ''"
            >
              <smq-icon-post-main-logo />
            </div>
            <span
              v-if="publishError"
              class="error-text"
              v-text="'Required field'"
            />
          </div>
        </template>
<!--        <div v-if="sidebarMode === 'edit' && currentPost && currentPost.news_attachments.length">-->
<!--          <div class="marketing-news-post_create-files_uploader-items">-->
<!--            <div-->
<!--              class="marketing-news-post_create-files_uploader-items-item"-->
<!--              v-for="(item, key) in currentPost.news_attachments"-->
<!--              :key="key"-->
<!--            >-->
<!--              <img-->
<!--                width="72"-->
<!--                height="72"-->
<!--                style="border-radius: 6px;"-->
<!--                :src="item.attachment_link"-->
<!--                alt=""-->
<!--              />-->
<!--              <span-->
<!--                class="marketing-news-post_create-files_uploader-items-item-delete"-->
<!--                style="color: white"-->
<!--                @click="deleteAttachment(item)"-->
<!--              >-->
<!--          <smq-icon-post-attach-close />-->
<!--        </span>-->
<!--            </div>-->
<!--          </div>-->
<!--        </div>-->
<!--        <image-uploader-->
<!--          :max="100"-->
<!--          @change-binary="handleBinaryImage"-->
<!--          :marginless="currentPost && currentPost.news_attachments && currentPost.news_attachments.length"-->
<!--          :pictures="storedPost.news_attachments.map(attachment => attachment.attachment_link)"-->
<!--        >-->
<!--          <template #upload-logo-video>-->
<!--            <smq-icon-video-outline />-->
<!--          </template>-->
<!--          <template #delete-icon>-->
<!--            <b-icon-trash />-->
<!--          </template>-->
<!--        </image-uploader>-->
      </div>
    </div>
        <div class="marketing-news-post_create-settings">
          <template>
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
          </template>
            <!--          <div-->
            <!--            class="marketing-news-post_create-settings-button"-->
            <!--            @click="postNotCreated"-->
            <!--          >-->
            <!--            <smq-icon-multiple-outline />-->
            <!--          </div>-->
            <!--                <label-->
            <!--                  v-if="storedPostId || sidebarMode === 'edit'"-->
            <!--                  for="post-attach-video-upload"-->
            <!--                  class="marketing-news-post_create-settings-button"-->
            <!--                >-->
            <!--                  <smq-icon-video-outline />-->
            <!--                </label>-->
            <!--                <div-->
            <!--                  v-else-->
            <!--                  class="marketing-news-post_create-settings-button"-->
            <!--                  @click="postNotCreated"-->
            <!--                >-->
            <!--                  <smq-icon-video-outline />-->
            <!--                </div>-->
            <!--                <marketing-news-send-types-->
            <!--                  v-if="sidebarMode === 'view'"-->
            <!--                  :disabled="!storedPostId"-->
            <!--                  @error="postNotCreated"-->
            <!--                />-->
        </div>
    <div
      v-if="sidebarMode === 'view'"
      class="marketing-news-post_create-forms"
    >
      <smq-form-button-small
        title="Save as Draft"
        :disabled="storedPost && !storedPost.company_id"
        variant="outline_primary"
        @handle-action="saveAsDraft"
      />
    </div>
    <div
      v-else-if="sidebarMode === 'edit'"
      class="marketing-news-post_create-forms"
      :class="currentPost.status === 5 ? '-edit' : ''"
    >
      <smq-form-button-small
        v-if="currentPost.status === 0"
        title="Save as Draft"
        :disabled="storedPost && !storedPost.company_id"
        variant="outline_primary"
        @handle-action="updateCurrentPost"
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
        v-if="activePostType === 'share_now' && currentPost.status !== 5"
        title="Publish"
        variant="primary"
        @handle-action="updateStatus(5)"
      />
      <smq-form-button-small
        v-else-if="activePostType === 'schedule' && currentPost.status !== 5"
        title="Schedule post"
        variant="primary"
        @handle-action="updateStatus(4)"
      />
      <smq-form-button-small
        v-if="currentPost.status === 5"
        title="Save changes"
        variant="primary"
        @handle-action="updateCurrentPost"
      />
    </div>
  </div>
</template>

<script>
import moment from 'moment'
// import ImageUploader from '~/components/imageUploader'
import SmqIconMultipleOutline from '~/components/marketing/icons/smq-icon-multiple-outline'
// import SmqIconVideoOutline from '~/components/icons/smq-icon-video-outline'
import SmqIconTableLogo from '~/components/icons/smq-icon-table-logo'
// import SmqFormDropdown from '~/components/forms/smq-form-dropdown'
// import MarketingNewsSendTypes from '~/components/marketing/news/marketingNewsSendTypes'
// import SmqIconMultipleOutline from '~/components/marketing/icons/smq-icon-multiple-outline'
import SmqFormButtonSmall from '~/components/forms/smq-form-button-small'
// import SmqIconPostAttachClose from '~/components/marketing/icons/smq-icon-post-attach-close'
import SmqFormDropdown from '~/components/forms/smq-form-dropdown'
import SmqFormInput from '~/components/forms/smq-form-input'
import SmqIconPostMainLogo from '~/components/marketing/icons/smq-icon-post-main_logo'
export default {
  name: 'MarketingNewsPostCreate',
  components: {
    SmqIconPostMainLogo,
    SmqFormInput,
    SmqFormDropdown,
    SmqFormButtonSmall,
    SmqIconMultipleOutline,
    // MarketingNewsSendTypes,
    // SmqFormDropdown,
    // SmqIconPostAttachClose,
    SmqIconTableLogo
    // SmqIconVideoOutline,
    // ImageUploader
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
      publishError: false
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
    postImageTitle () {
      return this.$store.getters['news/getStoredPostTitlePicture']
    },
    storedPostId () {
      return this.$store.getters['news/getStoredPostId']
    },
    storedPost () {
      return this.$store.getters['news/getStoredPost']
    },
    postArticle: {
      get () {
        if (this.sidebarMode === 'view') {
          return this.$store.getters['news/getStoredPost'].article
        } else {
          return this.$store.getters['news/getCurrentPost'].article
        }
      },
      set (newValue) {
        if (this.sidebarMode === 'view') {
          this.$store.commit('news/UPDATE_STORED_POST', { field: 'article', value: newValue })
        } else {
          this.$store.commit('news/UPDATE_CURRENT_POST', { field: 'article', value: newValue })
        }
      }
    },
    sidebarMode () {
      return this.$store.getters['news/getCurrentPostSidebarMode']
    },
    currentPost () {
      return this.$store.getters['news/getCurrentPost']
    }
  },
  created () {
    if (this.schedulePostDate) {
      this.activePostType = 'schedule'
    }
  },
  destroyed () {
    this.activePostType = 'share_now'
  },
  methods: {
    handleImageTitle (e) {
      const selectedImage = e.target.files[0]
      this.createArrayBuffer(selectedImage)
      this.createBase64Image(selectedImage)
    },
    createArrayBuffer (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        this.image = e.target.result
        if (this.sidebarMode === 'view') {
          this.$store.dispatch('news/uploadPostTitlePicture', this.image)
        } else if (this.sidebarMode === 'edit') {
          this.$store.dispatch('news/uploadCurrentPostTitlePicture', this.image)
        }
      }
      reader.readAsArrayBuffer(file)
    },
    createBase64Image (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        this.image = e.target.result
        if (this.sidebarMode === 'view') {
          this.$store.commit('news/SAVE_NEW_POST_IMAGE_TITLE', this.image)
        } else if (this.sidebarMode === 'edit') {
          this.$store.commit('news/UPDATE_CURRENT_POST', { field: 'title_picture', value: this.image })
        }
      }
      reader.readAsDataURL(file)
    },
    postTypeChanged (item) {
      if (item.flag === 'schedule' && this.currentPost.title_picture && this.currentPost.article && this.currentPost.title) {
        this.publishError = false
        this.activePostType = item.flag
        this.$emit('show-schedule-calendar')
      } else {
        this.publishError = true
      }
    },
    handleBinaryImage (payload) {
      this.$store.dispatch('news/addPostFiles', payload)
    },
    saveAsDraft () {
      this.$store.dispatch('news/updatePost')
    },
    async updateStatus (status, publishAt = this.moment().format('YYYY-MM-DD HH:mm:ss')) {
      const publishDate = this.schedulePostDate ? this.schedulePostDate : publishAt
      if (this.currentPost.title_picture && this.currentPost.article && this.currentPost.title) {
        this.publishError = false
        await this.$store.commit('news/UPDATE_CURRENT_POST', { field: 'status', value: status })
        if (status !== 0) {
          await this.$store.commit('news/UPDATE_CURRENT_POST', { field: 'publish_at', value: publishDate })
        }
        await this.$store.dispatch('news/updateCurrentPost', {
          postId: this.currentPost.id,
          status,
          title: this.currentPost.title,
          article: this.currentPost.article
        })
        await this.closeModal()
      } else {
        this.publishError = true
      }
    },
    postNotCreated () {
      this.$emit('post-not-created')
    },
    async closeModal () {
      if (this.sidebarMode === 'edit') {
        this.$store.commit('news/UPDATE_CURRENT_POST_SIDEBAR_MODE', 'view')
      }
      await this.close()
    },
    async updateCurrentPost () {
      if (this.currentPost.title_picture && this.currentPost.article && this.currentPost.title) {
        this.publishError = false
        await this.$store.dispatch('news/updateCurrentPost')
        this.$store.commit('news/UPDATE_CURRENT_POST_SIDEBAR_MODE', 'view')
        this.close()
      } else {
        this.publishError = true
      }
    },
    deleteAttachment (attachment) {
      this.$store.dispatch('news/deleteNewsAttachment', attachment.id)
    },
    companyChanged (value, field) {
      this.$store.commit('news/UPDATE_STORED_POST', { field, value })
    },
    currentPostChanged (value, field) {
      this.$store.commit('news/UPDATE_CURRENT_POST', { field, value })
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
