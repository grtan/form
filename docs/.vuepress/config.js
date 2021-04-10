module.exports = {
  base: '/docs/form/_docs/',
  title: 'VCForm',
  description: '可配置的vue通用表单组件，配置兼容JSON Schema，且额外支持许多功能，如字段联动、自定义校验方法、自定义UI组件等',
  // head: [
  //   [
  //     'link',
  //     {
  //       rel: 'shortcut icon',
  //       href: '/favicon.ico'
  //     }
  //   ]
  // ],
  themeConfig: {
    // logo: '/logo.png',
    nav: [
      {
        text: '首页',
        link: '/'
      },{
        text:'在线演示',
        link:'http://vui.vivo.xyz:9002/'
      }
    ],
    sidebar: [
      '/start',
      '/schema',
      '/component',
      '/component/list/'
    ],
    repoLabel: 'GitLab',
    repo: 'https://gitlab.vmic.xyz/game-common/form',
    lastUpdated: '最后更新',
    smoothScroll: true,
    sidebarDepth: 2
  },
  markdown: {
    lineNumbers: true
  },
  plugins: [
    '@vuepress/back-to-top',
    [
      'vuepress-plugin-container',
      {
        type: 'center',
        before: info => `<div align=center>`,
        after: '</div>'
      }
    ]
  ]
}
