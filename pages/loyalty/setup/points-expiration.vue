<template>
  <div class="loyalty-setup-page">
    <loyalty-setup-head title="Points expiration" @handler="saveData" />
    <div class="loyalty-setup-page-container">
      <div class="loyalty-setup-page-container-block flex-column">
        <span class="w-100 mb-3 -bold" v-text="'Points expire'" />
        <div class="d-flex align-items-center w-100">
          <span class="mb-4" v-text="'Points expire if the program is not used in the last'" />
          <smq-form-input prepend="days" class="m-0" default-text="Default is 60 days" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import LoyaltySetupHead from '~/components/loyalty/setup/setupHead'
import SmqFormInput from '~/components/forms/smq-form-input'
export default {
  name: 'LoyaltySetupPointsExpiration',
  components: { SmqFormInput, LoyaltySetupHead },
  methods: {
    saveData () {

    }
  }
}
</script>
