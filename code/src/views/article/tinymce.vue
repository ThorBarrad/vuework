<template>
  <div class="tinymce-editor">
    <editor
      v-model="myValue"
      :init="init"
      :disabled="disabled"
      @onClick="onClick"
    />
  </div>
</template>
<script>
import tinymce from 'tinymce/tinymce'
import Editor from '@tinymce/tinymce-vue'
import 'tinymce/themes/silver'
import 'tinymce/icons/default'
import 'tinymce/plugins/advlist'
import 'tinymce/plugins/anchor'
import 'tinymce/plugins/autolink'
import 'tinymce/plugins/autoresize'
import 'tinymce/plugins/autosave'
import 'tinymce/plugins/bbcode'
import 'tinymce/plugins/charmap'
import 'tinymce/plugins/code'
import 'tinymce/plugins/codesample'
import 'tinymce/plugins/colorpicker'
import 'tinymce/plugins/contextmenu'
import 'tinymce/plugins/directionality'
import 'tinymce/plugins/fullpage'
import 'tinymce/plugins/fullscreen'
import 'tinymce/plugins/help'
import 'tinymce/plugins/hr'
import 'tinymce/plugins/image'
import 'tinymce/plugins/imagetools'
import 'tinymce/plugins/insertdatetime'
import 'tinymce/plugins/legacyoutput'
import 'tinymce/plugins/link'
import 'tinymce/plugins/lists'
import 'tinymce/plugins/media'
import 'tinymce/plugins/nonbreaking'
import 'tinymce/plugins/noneditable'
import 'tinymce/plugins/pagebreak'
import 'tinymce/plugins/paste'
import 'tinymce/plugins/preview'
import 'tinymce/plugins/print'
import 'tinymce/plugins/quickbars'
import 'tinymce/plugins/save'
import 'tinymce/plugins/searchreplace'
import 'tinymce/plugins/spellchecker'
import 'tinymce/plugins/tabfocus'
import 'tinymce/plugins/table'
import 'tinymce/plugins/template'
import 'tinymce/plugins/textpattern'
import 'tinymce/plugins/toc'
import 'tinymce/plugins/visualblocks'
import 'tinymce/plugins/visualchars'
import 'tinymce/plugins/wordcount'
import 'tinymce/skins/ui/oxide/skin.min.css'
import 'tinymce/skins/ui/oxide/content.min.css'
import '@/assets/zh_CN'

import { upload_img, upload_video } from '@/api/api'

export default {
  components: {
    Editor
  },
  props: {
    value: {
      type: String,
      default: ''
    },
    prefix: {
      type: Object
    },
    disabled: {
      type: Boolean,
      default: false
    },
    plugins: {
      type: [String, Array],
      default: 'print preview searchreplace autolink directionality visualblocks visualchars fullscreen image link media template code codesample table charmap hr pagebreak nonbreaking anchor insertdatetime advlist lists wordcount imagetools textpattern help autosave'
    },
    toolbar: {
      type: [String, Array],
      // eslint-disable-next-line no-multi-str
      default: 'code undo redo restoredraft | cut copy paste pastetext | forecolor backcolor bold italic underline strikethrough link anchor | alignleft aligncenter alignright alignjustify outdent indent | \
    styleselect formatselect fontselect fontsizeselect | bullist numlist | blockquote subscript superscript removeformat | \
    table image link media charmap hr pagebreak insertdatetime print preview | fullscreen | lineheight'
    }
  },
  data() {
    return {
      init: {
        selector: '.tinymce-editor',
        language: 'zh_CN',
        height: 550,
        content_css: false,
        plugins: this.plugins,
        toolbar: this.toolbar,
        branding: false,
        menubar: false,
        images_upload_handler: (blobInfo, success, failure) => {
          const formdata = new FormData()
          formdata.append(
            'pic',
            blobInfo.blob(),
            blobInfo.filename()
          )
          upload_img(formdata).then((res) => {
            if (res.error_code === 0) {
              success(this.prefix.image + res.url)
            } else {
              failure('图片上传失败')
            }
          })
        },
        file_picker_types: 'media',
        file_picker_callback: (callback, value, meta) => {
          if (meta.filetype === 'media') {
            let input = document.createElement('input')
            input.setAttribute('type', 'file')
            input.onchange = (ev) => {
              const file = ev.path[0].files[0]
              const formdata = new FormData()
              formdata.append(
                'video',
                file,
                file.filename
              )
              tinymce.activeEditor.setProgressState(true)
              upload_video(formdata).then((res) => {
                if (res.error_code === 0) {
                  callback(this.prefix.video + res.url)
                } else {
                  this.$notify.error(new Error('视频上传失败'))
                }
              }).finally(() => tinymce.activeEditor.setProgressState(false))
            }
            input.click()
          }
        }
      },
      myValue: this.value
    }
  },
  watch: {
    value(newValue) {
      this.myValue = newValue
    },
    myValue(newValue) {
      this.$emit('input', newValue)
    }
  },
  mounted() {
    tinymce.init({})
  },
  methods: {
    onClick(e) {
      this.$emit('onClick', e, tinymce)
    },
    clear() {
      this.myValue = ''
    }
  }
}
</script>
