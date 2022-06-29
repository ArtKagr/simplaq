<template>
  <div class="loyalty-setup">
    <span class="loyalty-setup-title">Setup</span>
    <div class="loyalty-setup-container">
      <div class="loyalty-setup-container-item">
        <span class="loyalty-setup-container-item-title">
          Loyalty point value
        </span>
        <div class="loyalty-setup-container-item-settings">
          <smq-form-dropdown
            :items="costPoints"
            :width="70"
            title-color="primary"
            @selected-item="selectedItem($event, 'cost')"
          />
          <span class="loyalty-setup-container-item-settings-text">Kč is one loyalty point</span>
        </div>
      </div>
      <div class="loyalty-setup-container-item">
        <span class="loyalty-setup-container-item-title">
          Set a limit for points collection
        </span>
        <div class="loyalty-setup-container-item-settings">
          <smq-form-input
            v-model="settings.reward_points.count"
            :width="90"
            class="m-0"
            @changed-value="setRewardPoints"
          />
          <span class="loyalty-setup-container-item-settings-text">reward points per</span>
          <smq-form-dropdown
            :items="dayMonth"
            :width="124"
            :default-item="settings.reward_points.period"
            title-color="primary"
            @selected-item="selectedItem($event, 'reward_points')"
          />
        </div>
      </div>
      <div class="loyalty-setup-container-item">
        <span class="loyalty-setup-container-item-title">
          Set a limit for vouchers redeem
        </span>
        <div class="loyalty-setup-container-item-settings">
          <div class="loyalty-setup-container-item-settings-counter">
            <div
              class="loyalty-setup-container-item-settings-counter-minus"
              @click="manageVouchers('minus')"
            >
              <smq-icon-minus />
            </div>
            <div class="loyalty-setup-container-item-settings-counter-number">
              <span v-text="settings.voucher_points.count" />
            </div>
            <div
              class="loyalty-setup-container-item-settings-counter-plus"
              @click="manageVouchers('plus')"
            >
              <smq-icon-plus />
            </div>
          </div>
          <span class="loyalty-setup-container-item-settings-text">voucher activations per</span>
          <smq-form-dropdown
            :items="dayMonth"
            :width="124"
            :default-item="settings.voucher_points.period"
            title-color="primary"
            @selected-item="selectedItem($event, 'voucher_points')"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SmqIconPlus from '~/components/icons/smq-icon-plus'
import SmqIconMinus from '~/components/icons/smq-icon-minus'
import SmqFormDropdown from '~/components/forms/smq-form-dropdown'
import SmqFormInput from '~/components/forms/smq-form-input'
export default {
  name: 'LoyaltySetupOld',
  components: { SmqFormInput, SmqFormDropdown, SmqIconMinus, SmqIconPlus },
  data () {
    return {
      dayMonth: [
        { title: 'Day', flag: 'day' },
        { title: 'Month', flag: 'month' }
      ],
      costPoints: [
        { title: 1, flag: '1' },
        { title: 2, flag: '2' },
        { title: 5, flag: '5' },
        { title: 10, flag: '10' },
        { title: 20, flag: '20' },
        { title: 25, flag: '25' },
        { title: 50, flag: '50' },
        { title: 100, flag: '100' }
      ],
      settings: {
        cost: 1,
        reward_points: {
          count: 1000,
          period: 'month'
        },
        voucher_points: {
          count: 1,
          period: 'day'
        }
      }
    }
  },
  methods: {
    manageVouchers (flag) {
      if (flag === 'plus') {
        this.settings.voucher_points.count += 1
      } else if (this.settings.voucher_points.count >= 2) {
        this.settings.voucher_points.count -= 1
      }
    },
    selectedItem (item, setting) {
      if (setting === 'cost') {
        this.settings.cost = item.title
      } else {
        this.settings[setting].period = item.flag
      }
    },
    setRewardPoints (points) {
      this.settings.reward_points.count = Number(points)
    }
  }
}
</script>
