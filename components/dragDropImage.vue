<template>
  <div class="d-flex flex-column">
    <div
      class="drag_drop_image"
      :class="error ? '-error' : ''"
      :style="`width: ${width}px; height: ${height}px`"
    >
      <img
        v-if="image"
        :src="image"
        alt="tenant-logo"
        class="drag_drop_image-content-image"
      />
      <div v-else class="drag_drop_image-content">
        <smq-icon-drag-drop-icon class="drag_drop_image-content-icon" />
        <span class="drag_drop_image-content-title">Upload image</span>
        <span class="drag_drop_image-content-subtitle">Drag & drop or
        <span class="drag_drop_image-content-subtitle-link">browse</span>
      </span>
      </div>
      <UploadImages
        class="drag_drop_image-container"
        :max="1"
        @binary-data="handleBinaryImage"
        @change="uploadedFile"
      />
    </div>
    <span
      v-if="message && error"
      class="smq-forms-input-message"
      :class="error ? '-error' : ''"
      v-text="message"
    />
  </div>
</template>

<script>
import SmqIconDragDropIcon from './icons/smq-icon-drag-drop-icon'
import UploadImages from '~/components/uploadImages'
export default {
  name: 'dragDropImage',
  props: {
    image: {
      type: String,
      default: null
    },
    width: {
      type: Number,
      default: 229
    },
    height: {
      type: Number,
      default: 229
    },
    error: {
      type: Boolean,
      default: false
    },
    message: {
      type: String,
      default: null
    }
  },
  components: {
    SmqIconDragDropIcon,
    UploadImages
  },
  methods: {
    uploadedFile (file) {
      this.$emit('uploaded-file', file[0])
    },
    handleUrlImage (file) {
      this.$emit('uploaded-url-image', file)
    },
    handleBinaryImage (payload) {
      this.$emit('uploaded-binary-image', payload)
    }
  }
}
</script>
