<template>
  <div class="loyalty-setup-page">
    <loyalty-setup-head title="Limit rewards" @handler="saveData" />
    <div class="loyalty-setup-page-container -white">
      <div class="loyalty-setup-container-item">
        <span
          class="loyalty-setup-container-item-title"
          v-text="'Maximum number of scanned receipt per customer:'"
        />
        <div class="loyalty-setup-container-item-settings">
          <div class="loyalty-setup-container-item-settings-counter">
            <div
              class="loyalty-setup-container-item-settings-counter-minus"
              @click="updateValue('minus', 'day')"
            >
              <smq-icon-minus />
            </div>
            <div class="loyalty-setup-container-item-settings-counter-number">
              <span v-text="limit_get_rewards_per_day" />
            </div>
            <div
              class="loyalty-setup-container-item-settings-counter-plus"
              @click="updateValue('plus', 'day')"
            >
              <smq-icon-plus />
            </div>
          </div>
        </div>
        <span
          class="loyalty-setup-container-item-title ml-4"
          v-text="'per day'"
        />
      </div>
      <div class="loyalty-setup-container-item">
        <span
          class="loyalty-setup-container-item-title"
          v-text="'Maximum number of scanned receipt per customer:'"
        />
        <div class="loyalty-setup-container-item-settings">
          <div class="loyalty-setup-container-item-settings-counter">
            <div
              class="loyalty-setup-container-item-settings-counter-minus"
              @click="updateValue('minus', 'month')"
            >
              <smq-icon-minus />
            </div>
            <div class="loyalty-setup-container-item-settings-counter-number">
              <span v-text="limit_get_rewards_per_month" />
            </div>
            <div
              class="loyalty-setup-container-item-settings-counter-plus"
              @click="updateValue('plus', 'month')"
            >
              <smq-icon-plus />
            </div>
          </div>
        </div>
        <span
          class="loyalty-setup-container-item-title ml-4"
          v-text="'per month'"
        />
      </div>
      <div class="loyalty-setup-container-item m-0">
        <span
          class="loyalty-setup-container-item-title"
          v-text="'Maximum number of scanned receipt per customer:'"
        />
        <div class="loyalty-setup-container-item-settings">
          <div class="loyalty-setup-container-item-settings-counter">
            <div
              class="loyalty-setup-container-item-settings-counter-minus"
              @click="updateValue('minus', 'year')"
            >
              <smq-icon-minus />
            </div>
            <div class="loyalty-setup-container-item-settings-counter-number">
              <span v-text="limit_get_rewards_per_year" />
            </div>
            <div
              class="loyalty-setup-container-item-settings-counter-plus"
              @click="updateValue('plus', 'year')"
            >
              <smq-icon-plus />
            </div>
          </div>
        </div>
        <span
          class="loyalty-setup-container-item-title ml-4"
          v-text="'per year'"
        />
      </div>
    </div>
  </div>
</template>

<script>
import LoyaltySetupHead from '~/components/loyalty/setup/setupHead'
import SmqIconPlus from '~/components/icons/smq-icon-plus'
import SmqIconMinus from '~/components/icons/smq-icon-minus'
export default {
  name: 'LoyaltySetupLimitRewards',
  components: { LoyaltySetupHead, SmqIconPlus, SmqIconMinus },
  data () {
    return {
      limit_get_rewards_per_day: null,
      limit_get_rewards_per_month: null,
      limit_get_rewards_per_year: null
    }
  },
  computed: {
    loyaltySettings () {
      return this.$store.getters['settings/getLoyaltySettings']
    }
  },
  async created () {
    await this.$store.dispatch('settings/fetchSettings')
    if (this.loyaltySettings.limit_get_rewards_per_day && this.loyaltySettings.limit_get_rewards_per_day.value) {
      this.limit_get_rewards_per_day = this.loyaltySettings.limit_get_rewards_per_day.value
      this.limit_get_rewards_per_month = this.loyaltySettings.limit_get_rewards_per_month.value
      this.limit_get_rewards_per_year = this.loyaltySettings.limit_get_rewards_per_year.value
    }
  },
  methods: {
    async saveData () {
      await this.$store.dispatch('settings/updateCurrentSetting', {
        field: 'limit_get_rewards_per_day',
        value: this.limit_get_rewards_per_day
      })
      await this.$store.dispatch('settings/updateCurrentSetting', {
        field: 'limit_get_rewards_per_month',
        value: this.limit_get_rewards_per_month
      })
      await this.$store.dispatch('settings/updateCurrentSetting', {
        field: 'limit_get_rewards_per_year',
        value: this.limit_get_rewards_per_year
      })
    },
    updateValue (action, period) {
      if (action === 'minus') {
        if (period === 'day' && this.limit_get_rewards_per_day >= 1) {
          this.limit_get_rewards_per_day--
        } else if (period === 'month' && this.limit_get_rewards_per_month >= 1) {
          this.limit_get_rewards_per_month--
        } else if (period === 'year' && this.limit_get_rewards_per_year >= 1) {
          this.limit_get_rewards_per_year--
        }
      }
      if (action === 'plus') {
        if (period === 'day') {
          this.limit_get_rewards_per_day++
        } else if (period === 'month') {
          this.limit_get_rewards_per_month++
        } else if (period === 'year') {
          this.limit_get_rewards_per_year++
        }
      }
    }
  }
}
</script>
