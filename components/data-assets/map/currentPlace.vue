<template>
  <div class="loyalty-rewards-create">
    <smq-icon-close
      class="loyalty-rewards-create-close"
      @click.native="close()"
    />
    <div class="d-flex flex-column" style="width: 450px">
      <div class="w-100 d-flex justify-content-between">
        <span
          class="loyalty-rewards-create-reward_filling-title"
          v-text="'New place'"
        />
      </div>
      <div class="d-flex flex-column">
        <smq-form-input
          label="Place name"
          color="gray-800"
          class="mt-4"
        />
        <smq-form-input
          label="Place URL"
          color="gray-800"
          class="mt-1"
        />
        <b-button variant="primary" v-text="'Create place'" class="mt-3" />
      </div>
    </div>
  </div>
</template>

<script>
import SmqIconClose from '~/components/icons/smq-icon-close'
import SmqFormInput from '~/components/forms/smq-form-input'
export default {
  name: 'currentPlace',
  components: { SmqFormInput, SmqIconClose },
  props: {
    close: {
      type: Function
    }
  }
}
</script>
