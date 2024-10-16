import type { DefaultTheme } from 'vitepress'

export const nav: DefaultTheme.Config['nav'] = [
  {
    text: '指南',
    activeMatch: '/guide/',
    link: '/guide/startup'
  },
  { text: '不卡矩阵', link: '/nav', activeMatch: '^/nav' },
  {
    text: '关于',
    activeMatch: `^/about`,
    items: [
      { text: 'FAQ', link: '/about/faq' },
      { text: '开发团队', link: '/about/team' },
      { text: '诞生故事', link: '/about/born' }
    ]
  }
]
