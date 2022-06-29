<template>
  <div class="login">
    <div class="login-container">
      <smq-icon-logo-full class="login-container-icon" />
      <div class="login-container-form">
        <span class="login-container-form-title">Welcome to Simplaq!</span>
        <span class="login-container-form-subtitle">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.
        </span>
        <smq-form-input
          v-model="formData.email"
          :error="!!errorAuthData.email"
          :message="errorAuthData.email"
          class="login-container-form-input"
          placeholder="Your email"
          @changed-value="saveEmail"
        />
        <smq-form-input
          v-model="formData.password"
          :error="!!errorAuthData.password"
          :message="errorAuthData.password"
          class="login-container-form-input"
          placeholder="Your password"
          @changed-value="savePassword"
          type="password"
        />
        <b-button
          class="login-container-form-button"
          variant="primary"
          v-text="'Login'"
          @click="login"
        />
      </div>
    </div>
  </div>
</template>

<script>
import SmqFormInput from '../components/forms/smq-form-input'
import SmqIconLogoFull from '../components/icons/smq-icon-logo-full'
export default {
  name: 'login',
  components: { SmqIconLogoFull, SmqFormInput },
  computed: {
    formData () {
      return this.$store.getters['authorization/getFormData']
    },
    errorAuthData () {
      return this.$store.getters['authorization/getErrorAuthData']
    }
  },
  methods: {
    saveEmail (value) {
      this.$store.commit('authorization/UPDATE_FORM_DATA', { field: 'email', value })
    },
    savePassword (value) {
      this.$store.commit('authorization/UPDATE_FORM_DATA', { field: 'password', value })
    },
    login () {
      this.$store.dispatch('authorization/login')
    }
  }
}
</script>
