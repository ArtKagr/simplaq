<template>
  <div
    class="marketing-news-post_create-files_uploader"
    :class="[ images.length ? '-items' : '' ]"
    @dragover.prevent="dragOver"
    @dragleave.prevent="dragLeave"
    @drop.prevent="drop($event)"
  >
    <div v-show="images.length === 0">
      <input
        id="post-attach-image-upload"
        type="file"
        style="z-index: 1; display: none;"
        accept="image/*"
        ref="uploadInput"
        @change="previewImgs($event, 'image')"
        multiple
      />
      <input
        id="post-attach-video-upload"
        type="file"
        style="z-index: 1; display: none;"
        accept="video/*"
        ref="uploadInput"
        @change="previewImgs($event, 'video')"
        multiple
      />
    </div>
    <div
      class="marketing-news-post_create-files_uploader-items"
      v-show="changedImages.length > 0 && sidebarMode !== 'edit'"
    >
      <div
        class="marketing-news-post_create-files_uploader-items-item"
        v-for="(item, key) in changedImages"
        :key="key"
      >
        <img
          width="72"
          height="72"
          style="border-radius: 6px;"
          :src="item"
          alt=""
        />
        <!--        <video-->
        <!--          v-else-if="item.includes('video')"-->
        <!--          width="72"-->
        <!--          height="72"-->
        <!--          style="border-radius: 6px;"-->
        <!--          controls-->
        <!--        />-->
        <span
          class="marketing-news-post_create-files_uploader-items-item-delete"
          style="color: white"
          @click="deleteImg(key)"
        >
          <smq-icon-post-attach-close />
        </span>
      </div>
    </div>
  </div>
</template>
<script>
import SmqIconPostAttachClose from '~/components/marketing/icons/smq-icon-post-attach-close'
export default {
  name: 'imageUploader',
  components: {
    SmqIconPostAttachClose
  },
  data () {
    return {
      error: '',
      files: [],
      dropped: 0,
      images: []
    }
  },
  props: {
    max: Number,
    uploadMsg: {
      type: String,
      default: null
    },
    maxError: {
      type: String,
      default: null
    },
    fileError: {
      type: String,
      default: null
    },
    clearAll: {
      type: String,
      default: null
    },
    pictures: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    sidebarMode () {
      return this.$store.getters['news/getCurrentPostSidebarMode']
    },
    changedImages () {
      return this.pictures && this.pictures.length ? this.pictures : this.images
    }
  },
  methods: {
    dragOver () {
      this.dropped = 2
    },
    dragLeave () {},
    drop (e) {
      let status = true
      if (e && e.dataTransfer.files) {
        e.dataTransfer.files.forEach((file) => {
          if (file.type.startsWith('image') === false) {
            status = false
          }
        })
        if (status === true) {
          if (
            this.$props.max &&
            e.dataTransfer.files.length + this.files.length > this.$props.max
          ) {
            this.error = this.$props.maxError
              ? this.$props.maxError
              : 'Maximum files is' + this.$props.max
          } else {
            this.files.push(...e.dataTransfer.files)
            this.previewImgs()
          }
        } else {
          this.error = this.$props.fileError
            ? this.$props.fileError
            : 'Unsupported file type'
        }
      }
      this.dropped = 0
    },
    readAsDataURL (file) {
      return new Promise(function (resolve, reject) {
        const fr = new FileReader()
        fr.onload = function () {
          resolve(fr.result)
        }
        fr.onerror = function () {
          reject(fr)
        }
        fr.readAsDataURL(file)
      })
    },
    readAsArrayBuffer (file) {
      return new Promise(function (resolve, reject) {
        const fr = new FileReader()
        fr.onload = function () {
          resolve(fr.result)
        }
        fr.onerror = function () {
          reject(fr)
        }
        fr.readAsArrayBuffer(file)
      })
    },
    deleteImg (index) {
      this.images.splice(index, 1)
      this.files.splice(index, 1)
      this.$emit('change', this.files)
      this.$refs.uploadInput.value = null
    },
    previewImgs (event, type) {
      if (
        this.$props.max &&
        event &&
        event.currentTarget.files.length + this.files.length > this.$props.max
      ) {
        this.error = this.$props.maxError
          ? this.$props.maxError
          : 'Maximum files is' + this.$props.max
        return
      }
      if (this.dropped === 0) {
        this.files.push(...event.currentTarget.files)
      }
      this.error = ''
      this.$emit('change', { file: this.files, type })
      const readers = []
      const readersArrayBuffer = []
      if (!this.files.length) {
        return
      }
      for (let i = 0; i < this.files.length; i++) {
        readers.push(this.readAsDataURL(this.files[i]))
      }
      Promise.all(readers).then((values) => {
        this.images = values
        this.$emit('change', { file: values, type })
      })
      for (let i = 0; i < this.files.length; i++) {
        readersArrayBuffer.push(this.readAsArrayBuffer(this.files[i]))
      }
      Promise.all(readersArrayBuffer).then((values) => {
        this.$emit('change-binary', { file: values, type })
      })
    },
    reset () {
      this.$refs.uploadInput.value = null
      this.images = []
      this.files = []
      this.$emit('change', this.files)
    }
  }
}
</script>
<style scoped lang="scss">
.container {
  position: relative;
}
.drop {
  width: 100%;
  height: 100%;
  top: 0;
  border-radius: 10px;
  position: absolute;
  background-color: #f4f6ff;
  left: 0;
  border: 3px dashed #a3a8b1;
}
.error {
  text-align: center;
  color: red;
  font-size: 15px;
}
.beforeUpload {
  position: relative;
  text-align: center;
}
.beforeUpload input {
  width: 100%;
  margin: auto;
  height: 100%;
  opacity: 0;
  position: absolute;
  background: red;
  display: block;
}
.beforeUpload input:hover {
  cursor: pointer;
}
.beforeUpload .icon {
  width: 150px;
  margin: auto;
  display: block;
}

.imgsPreview {
  display: flex;
  align-items: center;
}

.imgsPreview .imageHolder {
  width: 72px !important;
  height: 72px !important;
  background: #fff;
  position: relative;
  border-radius: 10px;
  margin: 5px 5px;
  display: inline-block;
}
.imgsPreview .imageHolder img {
  object-fit: cover;
  width: 100%;
  height: 100%;
}
.delete {
  display: flex;
  align-items: center;
  position: absolute;
  top: -8px;
  right: -8px;
  width: 24px;
  height: 24px;
  color: #fff;
  background: white;
  border-radius: 100px;
  border: 1px solid #D0D7E2;

  svg {
    margin: 0 auto;
  }
}
.imgsPreview .imageHolder .delete:hover {
  cursor: pointer;
}
.imgsPreview .imageHolder .delete .icon {
  width: 66%;
  height: 66%;
  display: block;
  margin: 4px auto;
}
.imgsPreview .imageHolder .plus {
  color: #2d3748;
  background: #f7fafc;
  border-radius: 50%;
  font-size: 21pt;
  height: 30px;
  width: 30px;
  text-align: center;
  border: 1px dashed;
  line-height: 23px;
  position: absolute;
  right: -42px;
  bottom: 43%;
}
.plus:hover {
  cursor: pointer;
}
.clearButton {
  color: #2d3748;
  position: absolute;
  top: 7px;
  right: 7px;
  background: none;
  border: none;
  cursor: pointer;
}
</style>
