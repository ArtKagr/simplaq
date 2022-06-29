<template>
  <div class="loyalty-rewards-cards-card">
    <div
      class="loyalty-rewards-cards-card-offer_photo"
      @click="editRewardCard"
    >
      <img
        v-if="image"
        :src="image"
        :alt="`${id}-image`"
      />
      <loyalty-rewards-offer-photo v-else />
    </div>
    <div class="loyalty-rewards-cards-card-description">
      <span
        class="loyalty-rewards-cards-card-description-title"
        v-text="title"
      />
      <span class="loyalty-rewards-cards-card-description-subtitle">
        Valid until:
        <span
          class="loyalty-rewards-cards-card-description-subtitle-date"
          v-text="validUntilDate"
        />
      </span>
    </div>
    <div class="loyalty-rewards-cards-card-scale_container">
      <span class="loyalty-rewards-cards-card-scale_container-title">
        Products left:
        <span
          class="loyalty-rewards-cards-card-scale_container-title-data"
          v-text="`${productLeft}/${quantity}`"
        />
      </span>
      <b-progress :max="quantity" class="loyalty-rewards-cards-card-scale_container-scale_bar">
        <b-progress-bar
          :value="productLeft"
          variant="primary"
          class="loyalty-rewards-cards-card-scale_container-scale_bar-scale"
        />
      </b-progress>
    </div>
    <span
      class="loyalty-rewards-cards-card-points"
      v-text="points + ' points'"
    />
  </div>
</template>

<script>
import LoyaltyRewardsOfferPhoto from './loyaltyRewardsOfferPhoto'
export default {
  name: 'loyaltyRewardsCard',
  components: { LoyaltyRewardsOfferPhoto },
  props: {
    id: {
      type: Number,
      default: null
    },
    title: {
      type: String,
      default: null
    },
    image: {
      type: String,
      default: null
    },
    validUntil: {
      type: String,
      default: null
    },
    productLeft: {
      type: Number,
      default: null
    },
    quantity: {
      type: Number,
      default: null
    },
    points: {
      type: Number,
      default: null
    },
    cardType: {
      type: String,
      default: null
    }
  },
  computed: {
    validUntilDate () {
      return this.validUntil
    }
  },
  methods: {
    editRewardCard () {
      this.$emit('card-edited', this.cardType)
    }
  }
}
</script>
