<template>
  <div class="marketing-news-post_reject">
    <span
      class="marketing-news-post_reject-title"
      v-text="'Reason for rejection'"
    />
    <div class="marketing-news-post_reject-textarea">
      <smq-form-textarea placeholder="Briefly state the reason for the rejection the post..." />
    </div>
    <div class="marketing-news-post_reject-buttons">
      <smq-form-button-small
        class="marketing-news-post_reject-buttons-button"
        title="Cancel"
        variant="outline_primary"
        @click.native="close()"
      />
      <smq-form-button-small
        class="marketing-news-post_reject-buttons-button"
        title="Reject"
        variant="danger"
        @click.native="rejectPost"
      />
    </div>
  </div>
</template>

<script>
import SmqFormButtonSmall from '~/components/forms/smq-form-button-small'
import SmqFormTextarea from '~/components/forms/smq-form-textarea'
export default {
  name: 'MarketingNewsPostReject',
  components: { SmqFormTextarea, SmqFormButtonSmall },
  props: {
    close: {
      type: Function
    }
  },
  watch: {
    newsStatus (newValue) {
      if (newValue && newValue.includes('3')) {
        this.close()
        this.$emit('show-reject-post-alert')
      }
    }
  },
  computed: {
    currentPost () {
      return this.$store.getters['news/getCurrentPost']
    },
    newsStatus () {
      return this.$store.getters['news/getStatus']
    }
  },
  methods: {
    async rejectPost () {
      await this.$store.commit('news/UPDATE_CURRENT_POST', { field: 'status', value: 6 })
      this.close()
      await this.$store.dispatch('news/updatePost')
    }
  }
}
</script>
