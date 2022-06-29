<template>
  <div class="loyalty-rewards">
    <div class="d-flex flex-column">
      <div class="loyalty-rewards-head">
        <span class="loyalty-rewards-head-title">Rewards</span>
        <b-button
          class="loyalty-rewards-head-button"
          variant="primary"
          @click="showRewardCreate"
        >
          <div class="loyalty-rewards-head-button-icon">
            <smq-icon-plus />
          </div>
          <span class="loyalty-rewards-head-button-text">New reward</span>
        </b-button>
      </div>
      <div class="loyalty-receipts-head-search mb-4">
        <smq-form-input
          class="m-0"
          placeholder="Search..."
          dropdown-type="filter"
          prepend="search"
          @changed-value="rewardsSearching"
        />
      </div>
      <div
        v-if="rewards && rewards.length"
        class="loyalty-rewards-cards"
      >
        <loyalty-rewards-card
          v-for="(reward, key) in rewards"
          :id="reward.id"
          :key="key"
          :title="reward.title"
          :image="reward.photo_link"
          :valid-until="reward.valid_until || null"
          :product-left="reward.limit_left"
          :quantity="reward.limit"
          :points="reward.points_cost"
          :card-type="reward.type || null"
          @card-edited="cardEdited($event, reward)"
          @click.native="openCurrentReward(reward)"
        />
      </div>
      <div v-else-if="searchMode">
        <search-error :query="filter.title" />
      </div>
    </div>
    <smq-form-pagination />
    <b-modal v-model="isRewardCreateShown" hide-header hide-footer centered hide-backdrop>
      <template #default="{ close }">
        <loyalty-rewards-create
          :close="close"
          :prop-step="propStep"
          :card-type="editedCardType"
          @close-modal="closeCreateRewardModal"
        />
      </template>
    </b-modal>
  </div>
</template>

<script>
import LoyaltyRewardsCard from '~/components/loyalty/rewards/loyaltyRewardsCard'
import SmqIconPlus from '~/components/icons/smq-icon-plus'
import LoyaltyRewardsCreate from '~/components/loyalty/rewards/loyaltyRewardsCreate'
import SmqFormPagination from '~/components/forms/smq-form-pagination'
import SmqFormInput from '~/components/forms/smq-form-input'
import SearchError from '~/components/searchError'
export default {
  name: 'LoyaltyRewardsGrid',
  components: {
    SearchError,
    SmqFormInput,
    SmqFormPagination,
    LoyaltyRewardsCreate,
    SmqIconPlus,
    LoyaltyRewardsCard
  },
  data () {
    return {
      isRewardCreateShown: false,
      propStep: null,
      editedCardType: null
    }
  },
  computed: {
    rewards () {
      return this.$store.getters['rewards/getRewards']
    },
    searchMode () {
      return this.$store.getters['dictionaries/getSearchMode']
    },
    filter () {
      return this.$store.getters['dictionaries/getFilter']
    }
  },
  created () {
    this.$store.dispatch('dictionaries/updateSortPaginationFilter', this.$route.query)
    this.$store.commit('dictionaries/UPDATE_SOURCE', 'rewards')
    this.$store.dispatch('dictionaries/fetchPrograms')
  },
  methods: {
    showRewardCreate () {
      this.$store.commit('rewards/CLEAR_CURRENT_REWARD')
      this.propStep = 0
      this.editedCardType = null
      this.isRewardCreateShown = true
    },
    cardEdited (cardType, currentReward) {
      this.$store.commit('rewards/SAVE_CURRENT_REWARD', currentReward)
      this.propStep = 2
      this.editedCardType = cardType
      this.isRewardCreateShown = true
    },
    openCurrentReward (currentReward) {
      this.$store.commit('rewards/SAVE_CURRENT_REWARD', currentReward)
    },
    closeCreateRewardModal () {
      this.isRewardCreateShown = false
    },
    async rewardsSearching (value) {
      if (value.split('').length > 2) {
        this.$store.commit('dictionaries/UPDATE_SEARCH_MODE', true)
        await this.$store.commit('dictionaries/UPDATE_FILTER', { field: 'title', value })
      } else if (value === '') {
        this.$store.commit('dictionaries/UPDATE_SEARCH_MODE', false)
        await this.$store.commit('dictionaries/UPDATE_FILTER', { field: 'title', value: null })
        await this.$store.dispatch('rewards/fetchRewards', { page: 1, perPage: 10 })
      }
    }
  }
}
</script>
