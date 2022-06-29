<template>
  <div class="marketing-news-current_post">
    <div class="d-flex flex-column">
      <div class="marketing-news-current_post-head">
        <div class="d-flex align-items-center">
          <div
            class="marketing-news-current_post-head-close"
            @click="closeSidebar"
          >
            <b-icon-x />
          </div>
          <smq-form-button-small
            title="Edit"
            variant="outline_primary"
          />
        </div>
        <div class="marketing-news-current_post-head-buttons">
          <smq-form-button-small
            class="mr-2"
            title="Archive"
            variant="outline_danger"
            icon="reject"
          />
          <smq-form-button-small
            title="Approve"
            variant="primary"
            icon="approve"
          />
        </div>
      </div>
      <div class="marketing-events-list-item border-top-300 px-4 mt-3">
        <div class="marketing-events-list-item-head">
          <span class="marketing-events-list-item-head-type" v-text="currentNewsEvent.type" />
          <span
            class="marketing-events-list-item-head-status"
            :class="`-${currentNewsEvent.status}`"
            v-text="currentNewsEvent.status"
          />
        </div>
        <div class="marketing-events-list-item-description">
          <smq-icon-calendar class="marketing-events-list-item-description-icon" />
          <span class="marketing-events-list-item-description-date" v-text="currentNewsEvent.published"/>
          <smq-icon-dot class="marketing-events-list-item-description-dot" />
          <span class="marketing-events-list-item-description-company" v-text="`Publish as ${currentNewsEvent.company}`" />
        </div>
      </div>
      <div class="marketing-events-list-item-description mt-4 pt-0 d-flex flex-column">
        <span class="marketing-events-list-item-title -current px-4 pt-0" v-text="currentNewsEvent.title" />
        <span class="marketing-events-list-item-description -current px-4 pt-3" v-text="currentNewsEvent.description" />
        <span class="marketing-events-list-item-logo -current mx-4 mt-4" />
      </div>
    </div>
  </div>
</template>

<script>
import SmqFormButtonSmall from '~/components/forms/smq-form-button-small'
import SmqIconCalendar from '~/components/icons/smq-icon-calendar'
import SmqIconDot from '~/components/icons/smq-icon-dot'
export default {
  name: 'currentNewsEvent',
  components: { SmqIconDot, SmqIconCalendar, SmqFormButtonSmall },
  props: {
    close: {
      type: Function
    }
  },
  computed: {
    currentNewsEvent () {
      return this.$store.getters['newsEvents/getCurrentNewsEvent']
    }
  },
  methods: {
    closeSidebar () {
      this.$emit('close-sidebar')
      this.$store.commit('newsEvents/CLEAR_CURRENT_NEWS_EVENT')
    }
  }
}
</script>
