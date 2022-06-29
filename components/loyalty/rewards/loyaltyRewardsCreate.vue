<template>
  <div class="loyalty-rewards-create">
    <smq-icon-close
      class="loyalty-rewards-create-close"
      @click.native="close()"
    />
    <div class="loyalty-rewards-create-reward_filling">
      <div class="w-100 d-flex justify-content-between">
        <span
          class="loyalty-rewards-create-reward_filling-title"
          v-text="'Product for points'"
        />
        <span
          class="smq-table-status -reward_status"
          :class="`-${getRewardsStatus(currentRewardCopy.status)}`"
          v-text="getRewardsStatus(currentRewardCopy.status)"
        />
      </div>
      <div class="loyalty-rewards-create-reward_filling-container">
        <drag-drop-image
          :width="229"
          :height="229"
          :error="rewardError && !imageReward"
          message="Required field"
          :image="imageReward"
          @uploaded-image="saveUploadedImage"
          @uploaded-file="saveUploadedImage"
        />
        <div class="loyalty-rewards-create-reward_filling-container-form">
          <div
            class="marketing-news-post_create-head-block mb-3"
            style="width: 200px; overflow: hidden;"
          >
            <label class="marketing-news-post_create-head-icon">
              <img
                width="48"
                height="48"
                :src="novoPlazaLogo"
                alt="news-logo"
                style="border-radius: 100px;"
              />
            </label>
            <div class="marketing-news-post_create-head-description">
              <span
                class="marketing-news-post_create-head-description-button"
                v-text="'Publish by'"
              />
              <smq-form-dropdown
                class="loyalty-receipts-head-dropdown"
                :items="malls"
                :default-item="'62'"
                placeholder="Company"
                borderless
              />
            </div>
          </div>
          <smq-form-input
            v-model="currentRewardCopy.title"
            label="Reward title"
            :error="rewardError && !currentRewardCopy.title"
            message="Required field"
            @changed-value="updateCurrentReward($event, 'title')"
          />
          <smq-form-textarea
            v-model='currentRewardCopy.description'
            label="Description"
            class="mb-2"
            message="Required field"
            @changed-value="updateCurrentReward($event, 'description')"
          />
          <smq-form-dropdown
            label="Store"
            class="loyalty-receipts-head-dropdown w-100 mb-3 mr-0"
            :items="tenants"
            :default-item="rewardCompanyId"
            :width="160"
            :error="rewardError && !currentRewardCopy.company_id"
            message="Required field"
            placeholder="Select tenant"
            dropdown-type="filter"
            @selected-item="updateCurrentReward(Number($event.flag), 'company_id')"
          />
          <div class="loyalty-rewards-create-reward_filling-container-form-validity">
            <span
              class="loyalty-rewards-create-reward_filling-container-form-validity-label"
              v-text="'Validity'"
            />
            <div class="loyalty-rewards-create-reward_filling-container-form-validity-container">
              <smq-form-input
                id="create-from"
                v-model='currentRewardCopy.date_from'
                class="mb-0"
                :disabled="true"
                label-control="create-from"
                subfield="from"
                placeholder="--/--"
                append="calendar"
                @changed-value="updateCurrentReward($event, 'date_from')"
              />
              <span>—</span>
              <smq-form-input
                id="create-to"
                v-model='currentRewardCopy.date_to'
                class="mb-0"
                :disabled="true"
                label-control="create-to"
                :calendar-period="currentRewardCopy.date_from"
                subfield="to"
                placeholder="--/--"
                append="calendar"
                @changed-value="updateCurrentReward($event, 'date_to')"
              />
            </div>
          </div>
          <div class="loyalty-rewards-create-reward_filling-container-form-limited_amounts">
            <smq-form-input
              v-model="currentRewardCopy.limit"
              class="w-50 mr-4"
              label="Limited amounts"
              :width="140"
              type="number"
              min="0"
              :error="rewardError && !currentRewardCopy.limit"
              message="Required field"
              @changed-value="updateCurrentReward($event, 'limit')"
            />
            <smq-form-input
              v-model="currentRewardCopy.limit_left"
              class="w-50"
              label="Current in stock"
              :width="140"
              type="number"
              min="0"
              :error="rewardError && !currentRewardCopy.limit_left"
              message="Required field"
              @changed-value="updateCurrentReward($event, 'limit_left')"
            />
          </div>
          <smq-form-input
            v-model="currentRewardCopy.points_cost"
            label="Required points for activation"
            type="number"
            min="0"
            :width="200"
            :error="rewardError && !currentRewardCopy.points_cost"
            message="Required field"
            @changed-value="updateCurrentReward($event, 'points_cost')"
          />
          <smq-form-input
            v-model="currentRewardCopy.limit_per_customer"
            label="Limit redeems per person"
            type="number"
            min="0"
            :width="200"
            :error="rewardError && !currentRewardCopy.limit_per_customer"
            message="Required field"
            @changed-value="updateCurrentReward(Number($event), 'limit_per_customer')"
          />
        </div>
      </div>
    </div>
    <div class="loyalty-rewards-create-buttons">
      <b-button
        v-if="currentRewardCopy && currentRewardCopy.id && !currentRewardCopy.archived"
        class="loyalty-rewards-create-buttons-button"
        variant="danger"
        @click="archiveCurrentRewardStatus('archive')"
      >
        <span
          class="loyalty-rewards-create-buttons-button-text"
          v-text="'Archive'"
        />
      </b-button>
      <b-button
        v-if="currentRewardCopy && currentRewardCopy.id && currentRewardCopy.archived"
        class="loyalty-rewards-create-buttons-button"
        variant="success"
        @click="publishCurrentRewardStatus('publish')"
      >
        <span
          class="loyalty-rewards-create-buttons-button-text"
          v-text="'Publish'"
        />
      </b-button>
      <!--      <b-button-->
      <!--        v-if="currentRewardCopy && currentRewardCopy.id && currentRewardCopy.allow_action"-->
      <!--        class="loyalty-rewards-create-buttons-button -remove_reward mr-2"-->
      <!--        variant="warning"-->
      <!--        @click="toggleCurrentRewardStatus(currentRewardCopy.allow_action === 'disable' ? 'archive' : 'publish')"-->
      <!--      >-->
      <!--        <span-->
      <!--          class="loyalty-rewards-create-buttons-button-text"-->
      <!--          v-text="currentRewardCopy.allow_action"-->
      <!--        />-->
      <!--      </b-button>-->
      <b-button
        v-if="currentRewardCopy && currentRewardCopy.id"
        class="loyalty-rewards-create-buttons-button"
        variant="primary"
        @click="updateReward"
      >
        <span
          class="loyalty-rewards-create-buttons-button-text"
          v-text="'Save changes'"
        />
      </b-button>
      <b-button
        v-else
        class="loyalty-rewards-create-buttons-button -create_offer"
        variant="primary"
        @click="createReward"
      >
        <div class="loyalty-rewards-create-buttons-button-icon">
          <smq-icon-plus />
        </div>
        <span
          class="loyalty-rewards-create-buttons-button-text"
          v-text="'Create offer'"
        />
      </b-button>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import DragDropImage from '../../dragDropImage'
import SmqIconClose from '~/components/icons/smq-icon-close'
import SmqIconPlus from '~/components/icons/smq-icon-plus'
import SmqFormDropdown from '~/components/forms/smq-form-dropdown'
import SmqFormInput from '~/components/forms/smq-form-input'
import SmqFormTextarea from '~/components/forms/smq-form-textarea'
export default {
  name: 'loyaltyRewardsCreate',
  components: {
    SmqFormTextarea,
    SmqFormInput,
    SmqFormDropdown,
    DragDropImage,
    SmqIconPlus,
    SmqIconClose
  },
  props: {
    close: {
      type: Function
    }
  },
  data () {
    return {
      moment,
      currentRewardCopy: {
        id: null,
        loyalty_program_id: 1,
        title: null,
        company_id: null,
        points_cost: null,
        name: null,
        date_from: null,
        date_to: null,
        description: null,
        photo_link: null,
        limit: null,
        limit_left: null,
        limit_per_customer: null
      },
      rewardError: false
    }
  },
  computed: {
    status () {
      return this.$store.getters['dictionaries/getStatus']
    },
    testArray () {
      return this.$store.getters['dictionaries/getTestArray']
    },
    currentReward () {
      return this.$store.getters['rewards/getCurrentReward']
    },
    rewardImage () {
      return this.$store.getters['rewards/getRewardImage']
    },
    imageReward () {
      return this.$store.getters['rewards/getImageReward']
    },
    tenants () {
      return this.$store.getters['tenants/getTenantsList'].map((tenant) => {
        return {
          title: tenant.title,
          flag: String(tenant.id)
        }
      })
    },
    sidebarMode () {
      return this.$store.getters['news/getCurrentPostSidebarMode']
    },
    updateCreateDisable () {
      return !(
        this.currentRewardCopy.title &&
        this.currentRewardCopy.company_id &&
        this.currentRewardCopy.limit &&
        this.currentRewardCopy.limit_left &&
        this.currentRewardCopy.points_cost &&
        this.imageReward
      )
    },
    rewardCompanyId () {
      return this.currentRewardCopy && this.currentRewardCopy.company_id ? String(this.currentRewardCopy.company_id) : null
    },
    malls () {
      return [{ title: 'Novo Plaza s.r.o.', flag: '62' }]
    },
    novoPlazaLogo () {
      return 'https://firebasestorage.googleapis.com/v0/b/novo-plaza-cz.appspot.com/o/logos%2F1000x1000%2Fnovo_plaza_1000x1000.jpg?alt=media&token=fe25fee1-84dd-4504-a502-1d1d75e3f186'
    }
  },
  watch: {
    currentReward: {
      handler (newValue, oldValue) {
        if (newValue.id !== oldValue.id) {
          this.currentRewardCopy = JSON.parse(JSON.stringify(newValue))
        }
      },
      deep: true
    },
    status (newValue) {
      switch (newValue) {
        case 'reward-successfully-created':
          this.$emit('close-modal')
          break
        case 'reward-successfully-updated':
          this.$emit('close-modal')
          break
        case 'reward-successfully-deleted':
          this.$emit('close-modal')
          break
        case 'reward-successfully-archived':
          this.$emit('close-modal')
          break
        case 'reward-successfully-published':
          this.$emit('close-modal')
          break
      }
    }
  },
  created () {
    if (this.currentReward && this.currentReward.photo_link) {
      this.$store.commit('rewards/SAVE_REWARD_IMAGE_UPLOAD', this.currentReward.photo_link)
    }
    if (this.currentReward && this.currentReward.id) {
      this.currentRewardCopy = this.currentReward
    }
  },
  destroyed () {
    this.$store.commit('rewards/CLEAR_CURRENT_REWARD')
  },
  methods: {
    getRewardsStatus (status) {
      if (status === 0) {
        return 'archived'
      } else if (status === 1) {
        return 'published'
      } else if (status === 3) {
        return 'scheduled'
      }
    },
    createReward () {
      if (this.updateCreateDisable) {
        this.rewardError = true
      } else {
        this.rewardError = false
        this.$store.dispatch('rewards/createCurrentReward', this.currentRewardCopy)
      }
    },
    updateCurrentReward (value, field) {
      let valueChanged = value
      if ((field === 'limit' || field === 'limit_left' || field === 'points_cost') && value.includes('-')) {
        valueChanged = value.split('').filter(symbol => symbol !== '-').join('')
      }
      if (field === 'date_from' && this.moment(value) >= this.moment(this.currentRewardCopy.date_to)) {
        this.currentRewardCopy.date_to = this.moment(value).add(1, 'day').format('YYYY-MM-DD')
      }
      this.currentRewardCopy[field] = valueChanged
    },
    updateReward () {
      if (this.updateCreateDisable) {
        this.rewardError = true
      } else {
        this.rewardError = false
        this.$store.dispatch('rewards/updateCurrentReward', this.currentRewardCopy)
      }
    },
    deleteCurrentReward () {
      this.$store.dispatch('rewards/removeCurrentReward', this.currentRewardCopy.id)
    },
    archiveCurrentRewardStatus (flag) {
      this.$store.dispatch('rewards/archiveCurrentReward', this.currentRewardCopy.id)
    },
    publishCurrentRewardStatus () {
      this.$store.dispatch('rewards/publishCurrentReward', this.currentRewardCopy.id)
    },
    saveUploadedImage (file) {
      this.createArrayBuffer(file)
      this.createBase64Image(file)
    },
    createArrayBuffer (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        this.$store.commit('rewards/SAVE_REWARD_UPLOAD_IMAGE', e.target.result)
      }
      reader.readAsArrayBuffer(file)
    },
    createBase64Image (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        this.$store.commit('rewards/SAVE_REWARD_IMAGE_UPLOAD', e.target.result)
      }
      reader.readAsDataURL(file)
    }
  }
}
</script>
