<template>
 <div class="navigation">
   <div class="navigation-logo">
     <Logo />
   </div>
   <div class="navigation-container">
     <div
       v-for="(item, key) in items"
       :key="item.title"
       class="navigation-container-item"
       @mouseover="itemIsHovered(key, true)"
       @mouseleave="itemIsHovered(key, false)"
       @click="setActiveItem(item)"
     >
       <div
         class="navigation-container-item-parent"
         :class="item.is_hovered || activeItem.parent === item.title ? '-is_hovered' : ''"
       >
         <div
           class="navigation-container-item-parent-icon"
           :class="item.is_hovered || activeItem.parent === item.title ? '-is_hovered': ''"
         >
           <smq-icon-account-group v-if="item.title === 'Community'" />
           <SmqIconMessageOutline1 v-else-if="item.title === 'Requests'" />
           <smq-icon-hammer-wrench v-else-if="item.title === 'Maintenance'" />
           <smq-icon-shield-check-outline v-else-if="item.title === 'Security'" />
           <smq-icon-car v-else-if="item.title === 'Parking'" />
           <smq-icon-bullhorn-outline v-else-if="item.title === 'Marketing'" />
           <smq-icon-hand-heart-outline v-else-if="item.title === 'Loyalty'" />
           <smq-icon-database-outline v-else-if="item.title === 'Data & Assets'" />
           <smq-icon-poll-box-outline v-else-if="item.title === 'Analytics'" />
           <smq-icon-cog-outline v-else-if="item.title === 'Company Settings'" />
         </div>
         <span class="navigation-container-item-parent-title" v-text="item.title" />
         <div
           v-if="(item.child && item.is_hovered) || (item.child && activeItem.parent === item.title)"
           class="navigation-container-item-parent-chevron"
           :class="
           activeItem.parent === item.title ? '-is_opened' : ''"
         >
           <smq-icon-chevron-down />
         </div>
         <div
           v-if="item.title === 'Company Settings'"
           class="navigation-container-item-parent-dotted_line"
         />
       </div>
       <div
         v-if="item.child && activeItem.parent === item.title"
         class="navigation-container-item-child"
       >
         <template v-for="(child, index) in item.child">
           <nuxt-link
             v-if="getAvailableMenuItem(child)"
             :key="index"
             class="navigation-container-item-child-item"
             @click.native="setActiveChild($event, key, index)"
             :to="`/${item.flag}/${child.flag}`"
           >
             <smq-icon-dot
               v-if="child.title === activeItem.child"
               class="navigation-container-item-child-item-dot"
             />
             <SmqIconDot1
               v-else
               class="navigation-container-item-child-item-dot"
             />
             <smq-icon-dotted-line
               v-if="dottedLineIsShown(item, index)"
               class="navigation-container-item-child-item-dotted_line" />
             <span
               class="navigation-container-item-child-item-title"
               v-text="child.title"
             />
           </nuxt-link>
         </template>
       </div>
     </div>
   </div>
 </div>
</template>

<script>
import Logo from './Logo'
import SmqIconAccountGroup from './icons/smq-icon-account-group'
import SmqIconMessageOutline1 from './icons/smq-icon-message-outline-1'
import SmqIconHammerWrench from './icons/smq-icon-hammer-wrench'
import SmqIconShieldCheckOutline from './icons/smq-icon-shield-check-outline'
import SmqIconCar from './icons/smq-icon-car'
import SmqIconBullhornOutline from './icons/smq-icon-bullhorn-outline'
import SmqIconHandHeartOutline from './icons/smq-icon-hand-heart-outline'
import SmqIconDatabaseOutline from './icons/smq-icon-database-outline'
import SmqIconPollBoxOutline from './icons/smq-icon-poll-box-outline'
import SmqIconCogOutline from './icons/smq-icon-cog-outline'
import SmqIconChevronDown from './icons/smq-icon-chevron-down'
import SmqIconDot1 from './icons/smq-icon-dot-1'
import SmqIconDot from './icons/smq-icon-dot'
import SmqIconDottedLine from './icons/smq-icon-dotted-line'
export default {
  name: 'Navigation',
  components: {
    SmqIconDottedLine,
    SmqIconDot,
    SmqIconDot1,
    SmqIconChevronDown,
    SmqIconCogOutline,
    SmqIconPollBoxOutline,
    SmqIconDatabaseOutline,
    SmqIconHandHeartOutline,
    SmqIconBullhornOutline,
    SmqIconCar,
    SmqIconShieldCheckOutline,
    SmqIconHammerWrench,
    SmqIconMessageOutline1,
    SmqIconAccountGroup,
    Logo
  },
  // watch: {
  //   activeItem: {
  //     handler (newValue, oldValue) {
  //       let parentLink = newValue.parent.toLowerCase()
  //       let childLink = newValue.child ? newValue.child.toLowerCase() : null
  //       if (parentLink === 'data & assets') {
  //         parentLink = 'data-assets'
  //       } else if (parentLink.includes(' ')) {
  //         parentLink = parentLink.split(' ').join('-')
  //       }
  //       if (childLink && childLink.includes(' ')) {
  //         childLink = childLink.split(' ').join('-')
  //       }
  //       const link = newValue.child ? `/${parentLink}/${childLink}` : `/${parentLink}`
  //       const activeNavigationItem = this.items.find(item => item.title === newValue.parent)
  //       if (newValue.child) {
  //         this.$router.push(link)
  //       } else if ((activeNavigationItem.child && !activeNavigationItem.child.length && (newValue.parent !== oldValue.parent))) {
  //         this.$router.push(link)
  //       }
  //     },
  //     deep: true
  //   }
  // },
  computed: {
    activeItem () {
      return this.$store.getters['dictionaries/getActiveNavigationItem']
    },
    items () {
      return this.$store.getters['dictionaries/getNavigation']
    },
    permissionsMenu () {
      let result = Object.values(this.$store.getters['authorization/getPermissions'].menu).map(element => element.items)
      result = result.reduce((preVal, item) => {
        (Object.keys(item)).forEach((field, key) => {
          preVal[field] = Object.values(item)[key]
        })
        return preVal
      }, {})
      return result
    }
  },
  methods: {
    itemIsHovered (key, flag) {
      this.items[key].is_hovered = flag
    },
    setActiveItem (item) {
      this.$store.commit('dictionaries/SET_ACTIVE_NAVIGATION_ITEM', item)
    },
    setActiveChild (e, parentKey, childKey) {
      e.stopPropagation()
      this.$store.commit('dictionaries/SET_ACTIVE_NAVIGATION_CHILD', { parentKey, childKey })
    },
    dottedLineIsShown (item, index) {
      return item.child && item.child.length !== index + 1
    },
    getAvailableMenuItem (item) {
      let result
      (Object.keys(this.permissionsMenu)).forEach((field, key) => {
        if (item.flag === field) {
          result = Object.values(this.permissionsMenu)[key]
        }
      })
      return result
    }
  }
}
</script>
