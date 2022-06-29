<template>
  <div class="marketing-news-post_create-settings-send">
<!--    <div-->
<!--      v-if="sendTypes.store"-->
<!--      class="marketing-news-post_create-settings-send-icon"-->
<!--      @click="setSendType('store', false)"-->
<!--    >-->
<!--      <smq-icon-post-store-fill />-->
<!--    </div>-->
<!--    <div-->
<!--      v-else-->
<!--      class="marketing-news-post_create-settings-send-icon"-->
<!--      @click="setSendType('store', true)"-->
<!--    >-->
<!--      <smq-icon-post-store-blanked />-->
<!--    </div>-->
    <div
      v-if="sendTypes.phone"
      class="marketing-news-post_create-settings-send-icon"
      @click="setSendType('phone', false)"
    >
      <smq-icon-post-phone-fill />
    </div>
    <div
      v-else
      class="marketing-news-post_create-settings-send-icon"
      @click="setSendType('phone', true)"
    >
      <smq-icon-post-phone-blanked />
    </div>
    <div
      v-if="sendTypes.web"
      class="marketing-news-post_create-settings-send-icon"
      @click="setSendType('web', false)"
    >
      <smq-icon-post-web-fill />
    </div>
    <div
      v-else
      class="marketing-news-post_create-settings-send-icon"
      @click="setSendType('web', true)"
    >
      <smq-icon-post-web-blanked />
    </div>
    <div
      v-if="sendTypes.instagram"
      class="marketing-news-post_create-settings-send-icon"
      @click="setSendType('instagram', false)"
    >
      <smq-icon-post-instagram-fill />
    </div>
    <div
      v-else
      class="marketing-news-post_create-settings-send-icon"
      @click="setSendType('instagram', true)"
    >
      <smq-icon-post-instagram-blanked />
    </div>
    <div
      v-if="sendTypes.facebook"
      class="marketing-news-post_create-settings-send-icon"
      @click="setSendType('facebook', false)"
    >
      <smq-icon-post-facebook-fill  />
    </div>
    <div
      v-else
      class="marketing-news-post_create-settings-send-icon"
      @click="setSendType('facebook', true)"
    >
      <smq-icon-post-facebook-blanked />
    </div>
  </div>
</template>

<script>
// import SmqIconPostStoreBlanked from '~/components/marketing/icons/smq-icon-post-store-blanked'
// import SmqIconPostStoreFill from '~/components/marketing/icons/smq-icon-post-store-fill'
import SmqIconPostPhoneBlanked from '~/components/marketing/icons/smq-icon-post-phone-blanked'
import SmqIconPostPhoneFill from '~/components/marketing/icons/smq-icon-post-phone-fill'
import SmqIconPostWebBlanked from '~/components/marketing/icons/smq-icon-post-web-blanked'
import SmqIconPostWebFill from '~/components/marketing/icons/smq-icon-post-web-fill'
import SmqIconPostInstagramBlanked from '~/components/marketing/icons/smq-icon-post-instagram-blanked'
import SmqIconPostInstagramFill from '~/components/marketing/icons/smq-icon-post-instagram-fill'
import SmqIconPostFacebookBlanked from '~/components/marketing/icons/smq-icon-post-facebook-blanked'
import SmqIconPostFacebookFill from '~/components/marketing/icons/smq-icon-post-facebook-fill'

export default {
  name: 'MarketingNewsSendTypes',
  components: {
    SmqIconPostFacebookFill,
    SmqIconPostFacebookBlanked,
    SmqIconPostInstagramFill,
    SmqIconPostInstagramBlanked,
    SmqIconPostWebFill,
    SmqIconPostWebBlanked,
    SmqIconPostPhoneFill,
    SmqIconPostPhoneBlanked
    // SmqIconPostStoreFill,
    // SmqIconPostStoreBlanked
  },
  data () {
    return {
      sendTypes: {
        store: false,
        phone: false,
        web: false,
        instagram: false,
        facebook: false
      }
    }
  },
  props: {
    disabled: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    setSendType (field, flag) {
      if (!this.disabled) {
        this.sendTypes[field] = flag
      } else {
        this.$emit('error')
      }
    }
  }
}
</script>
