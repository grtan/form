<template>
  <tinymce-editor :value="value" :init="config" @input="$listeners.input"></tinymce-editor>
</template>

<script>
import 'tinymce/tinymce'
import 'tinymce/themes/silver'
import TinymceEditor from '@tinymce/tinymce-vue'

// 加载插件
require.context(
  '!!file-loader?name=[path][name].[ext]&context=node_modules/tinymce!tinymce/plugins',
  true,
  /.*/
)
// 加载皮肤
require.context(
  '!!file-loader?name=[path][name].[ext]&context=node_modules/tinymce!tinymce/skins',
  true,
  /.*/
)
// 加载语言
require.context(
  '!!file-loader?name=[path][name].[ext]&context=node_modules/vcform/src/component/richtext!./langs',
  true,
  /.*/
)

export default {
  components: {
    TinymceEditor
  },
  props: {
    schema: {
      required: true,
      type: Object
    },
    value: {
      required: true
    }
  },
  data() {
    return {
      config: {
        height: 300,
        // skin: 'oxide',
        // skin_url: '/tinymce'
        language: 'zh_CN',
        plugins: [
          'advlist autolink link image lists charmap print preview hr anchor pagebreak spellchecker',
          'searchreplace wordcount visualblocks visualchars code fullscreen insertdatetime media nonbreaking',
          'save table contextmenu directionality emoticons template paste textcolor'
        ],
        paste_data_images: true,
        images_upload_handler: this.schema.uploader
      }
    }
  }
}
</script>
