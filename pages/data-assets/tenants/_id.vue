<template>
  <tenant source="current-tenant" />
</template>

<script>
import Tenant from '~/components/data-assets/tenants/tenant'
export default {
  name: 'currentTenant',
  components: { Tenant },
  computed: {
    currentTenant () {
      return this.$store.getters['tenants/getCurrentTenant']
    }
  }
}
</script>
