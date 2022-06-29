<template>
  <div class="d-flex flex-column mt-4">
    <span class="text-center h3 mb-3">Sorry, no result found for "{{ query }}"</span>
    <span class="text-center h3">Try entering fewer or broader query terms.</span>
  </div>
</template>

<script>
export default {
  name: 'searchError',
  props: {
    query: {
      type: String,
      default: null
    }
  }
}
</script>
