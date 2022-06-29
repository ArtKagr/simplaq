<template>
  <div class="loyalty-rewards-create-reward_filling-container-form">
    <smq-form-input
      v-model="currentReward.title"
      :source="source"
      label="Reward title"
      @changed-value="updateCurrentReward($event, 'title')"
    />
    <smq-form-textarea
      v-model='currentReward.description'
      label="Description"
      class="mb-2"
      @changed-value="updateCurrentReward($event, 'description')"
    />
    <smq-form-dropdown
      label="Store"
      class="loyalty-receipts-head-dropdown w-100 mb-3 mr-0"
      :items="tenants"
      :width="160"
      placeholder="Select tenant"
      dropdown-type="filter"
      @changed-value="updateCurrentReward($event, 'company_id')"
    />
    <div class="loyalty-rewards-create-reward_filling-container-form-validity">
      <span class="loyalty-rewards-create-reward_filling-container-form-validity-label">
        Validity
      </span>
      <div class="loyalty-rewards-create-reward_filling-container-form-validity-container">
        <smq-form-input
          id="create-from"
          class="mb-0"
          :source="source"
          :disabled="true"
          label-control="create-from"
          subfield="from"
          placeholder="--/--"
          append="calendar"
        />
        <span>—</span>
        <smq-form-input
          id="create-to"
          class="mb-0"
          :source="source"
          :disabled="true"
          label-control="create-to"
          subfield="to"
          placeholder="--/--"
          append="calendar"
        />
      </div>
    </div>
    <!--    <smq-form-input-->
    <!--      v-if="source !== 'product'"-->
    <!--      v-model="reward.offer_count"-->
    <!--      :source="source"-->
    <!--      field="offer_count"-->
    <!--      label="Offer count"-->
    <!--      :width="140"-->
    <!--      @changed-value="updateReward($event, 'offer_count')"-->
    <!--    />-->
    <!--    <div class="d-flex justify-content-between w-100">-->
    <!--      <smq-form-input-->
    <!--        v-if="source !== 'product'"-->
    <!--        v-model="reward.current_price"-->
    <!--        :source="source"-->
    <!--        field="current_price"-->
    <!--        label="Current price"-->
    <!--        message="Automatically generated"-->
    <!--        :width="140"-->
    <!--        prepend="euro"-->
    <!--        @changed-value="updateReward($event, 'current_price')"-->
    <!--      />-->
    <!--      <smq-form-input-->
    <!--        v-if="source === 'discount'"-->
    <!--        :source="source"-->
    <!--        field="price_after_discount"-->
    <!--        label="Price after discount"-->
    <!--        :width="140"-->
    <!--      />-->
    <!--    </div>-->
    <div
      v-if="source === 'product'"
      class="loyalty-rewards-create-reward_filling-container-form-limited_amounts"
    >
      <smq-form-input
        v-model="currentReward.limit"
        class="w-50 mr-4"
        :source="source"
        label="Limited amounts"
        :width="140"
        @changed-value="updateCurrentReward($event, 'limit')"
      />
      <smq-form-input
        v-model="currentReward.limit_left"
        class="w-50"
        :source="source"
        label="Current in stock"
        :width="140"
        @changed-value="updateCurrentReward($event, 'limit_left')"
      />
      <!--      <span class="loyalty-rewards-create-reward_filling-container-form-limited_amounts-stock">-->
      <!--        Current in stock:-->
      <!--        <span-->
      <!--          class="loyalty-rewards-create-reward_filling-container-form-limited_amounts-stock-value"-->
      <!--          v-text="`${currentReward && currentReward.limit_left ? currentReward.limit_left : '0'} pcs`"-->
      <!--        />-->
      <!--      </span>-->
    </div>
    <smq-form-input
      v-model="currentReward.points_cost"
      :source="source"
      label="Required points for activation"
      :width="200"
      @changed-value="updateCurrentReward($event, 'points_cost')"
    />
  </div>
</template>

<script>
import SmqFormInput from '~/components/forms/smq-form-input'
import SmqFormDropdown from '~/components/forms/smq-form-dropdown'
import SmqFormTextarea from '~/components/forms/smq-form-textarea'
export default {
  name: 'loyaltyRewardsCreateForms',
  components: { SmqFormTextarea, SmqFormDropdown, SmqFormInput },
  // props: {
  //   source: {
  //     type: String,
  //     default: null
  //   }
  // },
  data () {
    return {
      source: 'Product'
    }
  },
  computed: {
    reward () {
      return this.$store.getters['rewards/getReward']
    },
    currentReward () {
      return this.$store.getters['rewards/getCurrentReward']
    },
    tenants () {
      return this.$store.getters['tenants/getTenantsList'].map((tenant) => {
        return {
          title: tenant.title,
          flag: String(tenant.id)
        }
      })
    }
    // rewardType () {
    //   return this.$store.getters['rewards/getRewardTypes'].find(type => type.current_type === this.source).filling_card
    // }
  },
  methods: {
    updateCurrentReward (value, field) {
      this.$emit('updated-field', { field, value })
    }
  }
}
</script>
