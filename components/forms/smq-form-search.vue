<template>
  <div class="smq-forms-search">
    <b-input-group class="smq-forms-search-container">
      <b-input-group-prepend class="smq-forms-search-container-icon">
        <smq-icon-magnify />
      </b-input-group-prepend>
      <b-form-input
        class="smq-forms-search-container-input"
        placeholder="Search..."
      />
    </b-input-group>
  </div>
</template>

<script>
import SmqIconMagnify from '../../components/icons/smq-icon-magnify'
export default {
  name: 'smqFormSearch',
  components: { SmqIconMagnify }
}
</script>
