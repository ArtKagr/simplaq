<template>
  <div v-if="this.$route.name === 'login'" class="main">
    <Nuxt class="main-container-page" />
  </div>
  <div v-else class="main">
    <Navigation class="main-navigation" />
    <div class="main-container">
      <Header class="main-container-header" />
      <Nuxt class="main-container-page" />
    </div>
    <b-modal
      ref="preloader"
      hide-header
      hide-footer
      centered
      hide-backdrop
      no-close-on-backdrop
    >
      <template #default>
        <div class="preloader">
          <div class="loader"></div>
        </div>
      </template>
    </b-modal>
    <b-toast
      id="smq-toast"
      :class="`smq-toast -${messageToast.variant}`"
      :title="messageToast.title"
      static
    >
      {{ messageToast.description }}
    </b-toast>
  </div>
</template>
<script>
import Header from '../components/Header'
import Navigation from '../components/Navigation'
export default {
  components: { Navigation, Header },
  computed: {
    accessToken () {
      return this.$store.getters['authorization/getAccessToken']
    },
    authToken () {
      return this.$store.getters['authorization/getAuthToken']
    },
    isPreloaderShown () {
      return this.$store.getters['dictionaries/getPreloaderShown']
    },
    status () {
      return this.$store.getters['dictionaries/getStatus']
    },
    sort () {
      return this.$store.getters['dictionaries/getSort']
    },
    querySort () {
      return this.$store.getters['dictionaries/getQuerySort']
    },
    filter () {
      return this.$store.getters['dictionaries/getFilter']
    },
    source () {
      return this.$store.getters['dictionaries/getSource']
    },
    currentPage () {
      return String(
        this.$store.getters['dictionaries/getPagination'].current_page
          ? this.$store.getters['dictionaries/getPagination'].current_page
          : this.$route.query.current_page
      )
    },
    navigation () {
      return this.$store.getters['dictionaries/getNavigation']
    },
    pagination () {
      return this.$store.getters['dictionaries/getPagination']
    },
    messageToast () {
      return this.$store.getters['dictionaries/getMessageToast']
    },
    routeUrl () {
      return this.$store.getters['dictionaries/getRouteUrl']
    },
    routeQuery () {
      return this.$route.query
    },
    childPageIsOpen () {
      return this.$store.getters['dictionaries/getChildPageIsOpen']
    }
  },
  watch: {
    sort: {
      handler (newValue) {
        if (Object.values(newValue).some(field => field)) {
          this.$store.dispatch('dictionaries/sendPageData')
        }
      },
      deep: true
    },
    filter: {
      handler (newValue) {
        if (Object.values(newValue).some(field => field)) {
          this.$store.dispatch('dictionaries/sendPageData')
        }
      },
      deep: true
    },
    routeUrl: {
      handler (newValue) {
        const params = {}
        Object.values(newValue).forEach((value, index) => {
          if (value) {
            params[Object.keys(newValue)[index]] = value
          }
        })
        this.$router.push({ query: params })
      },
      deep: true
    },
    source () {
      this.$store.dispatch('dictionaries/sendPageData')
    },
    async status (newValue) {
      switch (newValue) {
        case 'fetch':
          await this.$refs.preloader.show()
          break
        case 'logout-success':
          await this.$router.push('/login')
          break
        case 'unauthorized':
          await this.$router.push('/login')
          break
        default:
          await this.$refs.preloader.hide()
      }
    },
    authToken (newValue) {
      if (newValue) {
        this.authSuccess()
      } else {
        this.authError()
      }
    }
  },
  created () {
    this.createdRequest()
  },
  methods: {
    async authSuccess () {
      await this.$store.commit('dictionaries/SET_ACTIVE_NAVIGATION_PARENT_ITEM', 'Data & Assets')
      await this.$store.commit('dictionaries/SET_ACTIVE_NAVIGATION_CHILD_ITEM', 'Customers')
      await this.$router.push('/data-assets/customers')
    },
    async authError () {
      await this.$router.push('/login')
    },
    async createdRequest () {
      if (this.$route.name !== 'login' && !this.accessToken) {
        await this.$router.push('/login')
      }
      await this.$store.dispatch('dictionaries/fetchCompanyCategories')
      await this.$store.dispatch('tenants/fetchTenantsList')
      await this.$store.dispatch('dictionaries/fetchCompanyTypes')
      await this.$store.dispatch('dictionaries/fetchPrograms')
      // Set active navigation element
      this.navigation.forEach((navigationItem) => {
        if (this.$route.fullPath.includes(navigationItem.title.toLowerCase())) {
          this.$store.commit('dictionaries/SET_ACTIVE_NAVIGATION_PARENT_ITEM', navigationItem.title)
        }
        if (this.$route.fullPath.includes('data-assets')) {
          this.$store.commit('dictionaries/SET_ACTIVE_NAVIGATION_PARENT_ITEM', 'Data & Assets')
        }
        if (navigationItem.child && navigationItem.child.length) {
          navigationItem.child.forEach((navigationChildItem) => {
            if (this.$route.fullPath.includes(navigationChildItem.title.toLowerCase())) {
              this.$store.commit('dictionaries/SET_ACTIVE_NAVIGATION_CHILD_ITEM', navigationChildItem.title)
            }
          })
        }
      })
    }
    // async updateRoute () {
    //   const query = {
    //     page: String(this.pagination.current_page),
    //     per_page: String(this.pagination.per_page)
    //   }
    //   if (this.querySort) {
    //     query.sort = this.querySort
    //   }
    //   if (Object.values(this.filter) && Object.values(this.filter).some(value => value)) {
    //     Object.keys(this.filter).forEach((field, index) => {
    //       query[field] = Object.values(this.filter)[index]
    //     })
    //   }
    //   await this.$router.push({ query })
    //   await this.$store.dispatch('dictionaries/sendPageData', {
    //     page: this.pagination.current_page || 1,
    //     perPage: this.pagination.per_page || 10
    //   })
    // }
  }
}
</script>
<style lang="scss">
@import '../assets/scss/app.scss';
@keyframes spin {
  from {
    transform: translate(-50%, -50%) rotate(0deg);
  }
  to {
    transform: translate(-50%, -50%) rotate(360deg);
  }
}

.preloader {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: 10;
}

.loader {
  width: 70px;
  height: 70px;
  border: 5px solid $primary;
  border-radius: 50%;
  border-top-color: $primary-variant;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  animation: 0.75s spin infinite linear;
}
</style>
