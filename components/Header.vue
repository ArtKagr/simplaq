<template>
  <div class="header">
    <smq-icon-message-outline class="header-message" />
    <smq-icon-bell-badge-outline class="header-notify" />
    <b-dd
      :lazy="true"
      toggle-class="header-menu"
      variant="link"
      no-caret
      boundary="viewport"
    >
      <template #button-content>
        <div class="header-menu-avatar" />
      </template>
      <div class="header-menu-items">
        <b-dd-item-btn
          v-for="item in items"
          :key="item.flag"
          button-class="header-menu-items-item"
          @click="selectItem(item)"
        >
          <span class="header-menu-items-item-title" v-text="item.title" />
        </b-dd-item-btn>
      </div>
    </b-dd>
  </div>
</template>

<script>
import SmqIconMessageOutline from './icons/smq-icon-message-outline'
import SmqIconBellBadgeOutline from './icons/smq-icon-bell-badge-outline'
export default {
  name: 'Header',
  components: { SmqIconBellBadgeOutline, SmqIconMessageOutline },
  data () {
    return {
      items: [
        { title: 'Logout', flag: 'logout' }
      ]
    }
  },
  methods: {
    selectItem (item) {
      if (item.flag === 'logout') {
        this.$store.dispatch('authorization/logout')
      }
    }
  }
}
</script>
