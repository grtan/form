// 生成插件
require.context(
  '!!file-loader?name=tinymce/[path][name].[ext]&context=node_modules/tinymce!tinymce/plugins',
  true,
  /.*/
)

// 生成皮肤
require.context(
  '!!file-loader?name=tinymce/[path][name].[ext]&context=node_modules/tinymce!tinymce/skins',
  true,
  /.*/
)

// 生成语言
require.context(
  '!!file-loader?name=tinymce/[path][name].[ext]&context=node_modules/vcform/src/component/richtext!vcform/src/component/richtext/langs',
  true,
  /.*/
)