<template>
  <tinymce-editor :value="value" :init="config" @input="$listeners.input"></tinymce-editor>
</template>

<script>
import 'tinymce/tinymce'
import 'tinymce/themes/silver'
import TinymceEditor from '@tinymce/tinymce-vue'
import './generate-resource' // 生成tinymce的资源

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
        language: 'zh_CN',
        plugins: [
          'advlist autolink link image lists charmap print preview hr anchor pagebreak spellchecker',
          'searchreplace wordcount visualblocks visualchars code fullscreen insertdatetime media nonbreaking',
          'save table contextmenu directionality emoticons template paste textcolor'
        ],
        paste_data_images: true,
        images_upload_handler: this.schema.uploader
        // file_picker_types: 'file image media',
        // file_picker_callback: function (callback, value, meta) {
        //   var input = document.createElement('input');
        //   input.setAttribute('type', 'file');
        //   input.setAttribute('accept', '*/*');

        //   /*
        //     Note: In modern browsers input[type="file"] is functional without
        //     even adding it to the DOM, but that might not be the case in some older
        //     or quirky browsers like IE, so you might want to add it to the DOM
        //     just in case, and visually hide it. And do not forget do remove it
        //     once you do not need it anymore.
        //   */

        //   input.onchange = function () {
        //     var file = this.files[0];

        //     var reader = new FileReader();
        //     reader.onload = function () {
        //       /*
        //         Note: Now we need to register the blob in TinyMCEs image blob
        //         registry. In the next release this part hopefully won't be
        //         necessary, as we are looking to handle it internally.
        //       */
        //       var id = 'blobid' + (new Date()).getTime();
        //       var blobCache = tinymce.activeEditor.editorUpload.blobCache;
        //       var base64 = reader.result.split(',')[1];
        //       var blobInfo = blobCache.create(id, file, base64);
        //       blobCache.add(blobInfo);

        //       /* call the callback and populate the Title field with the file name */
        //       callback(blobInfo.blobUri(), { title: file.name });
        //     };
        //     reader.readAsDataURL(file);
        //   };

        //   input.click();
        // }
      }
    }
  }
}
</script>
