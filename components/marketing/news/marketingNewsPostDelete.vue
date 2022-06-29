<template>
  <div class="marketing-news-post_delete">
    <div class="marketing-news-post_delete-description">
      <span
        class="marketing-news-post_delete-description-title"
        v-text="'Are you sure you want to archive this post?'"
      />
      <span
        class="marketing-news-post_delete-description-subtitle"
        v-text="'Your post will be archived.'"
      />
    </div>
    <div class="marketing-news-post_delete-buttons">
      <smq-form-button-small
        class="marketing-news-post_delete-buttons-button"
        title="Cancel"
        variant="outline_primary"
        @click.native="closeModal"
      />
      <smq-form-button-small
        class="marketing-news-post_delete-buttons-button"
        title="Archive post"
        variant="primary"
        @click.native="deleteCurrentPost"
      />
    </div>
    <div class="marketing-news-post_delete-close">
      <b-icon-x @click="closeModal" />
    </div>
  </div>
</template>

<script>
import SmqFormButtonSmall from '~/components/forms/smq-form-button-small'
export default {
  name: 'marketingNewsPostDelete',
  components: { SmqFormButtonSmall },
  props: {
    close: {
      type: Function
    }
  },
  computed: {
    currentPost () {
      return this.$store.getters['news/getCurrentPost']
    }
  },
  methods: {
    async closeModal () {
      await this.$store.commit('news/UPDATE_CURRENT_POST_SIDEBAR_MODE', 'view')
      await this.close()
    },
    async deleteCurrentPost () {
      await this.close()
      await this.$store.dispatch('news/archivePost', this.currentPost.id)
      await this.$store.commit('news/UPDATE_CURRENT_POST_SIDEBAR_MODE', 'view')
    }
  }
}
</script>
