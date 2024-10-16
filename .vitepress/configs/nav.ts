import type { DefaultTheme } from 'vitepress'

export const nav: DefaultTheme.Config['nav'] = [
  {
    text: '指南',
    activeMatch: '/guide/',
    link: '/guide/startup'
  },
  {
    text: '视频教程',
    items: [
      {
        text: 'B站视频',
        link: 'https://space.bilibili.com/328443019/channel/collectiondetail?sid=514619'
      },
      { text: 'RTS分享', link: 'https://www.bilibili.com/video/BV1jg411H7qE/' }
    ]
  },
  {
    text: '不卡系列',
    items: [
      { text: 'Monibuca', link: 'https://monibuca.com' },
      { text: 'Jessibuca', link: 'https://jessibuca.com' },
      { text: 'Rebebuca', link: 'https://rebebuca.com' }
    ]
  },
  {
    text: '下载',
    items: [
      {
        text: 'Windows',
        link: 'https://download.m7s.live/bin/m7s_windows_amd64.tar.gz'
      },
      {
        text: 'Mac',
        link: 'https://download.m7s.live/bin/m7s_darwin_amd64.tar.gz'
      },
      {
        text: 'Mac(arm64)',
        link: 'https://download.m7s.live/bin/m7s_darwin_arm64.tar.gz'
      },
      {
        text: 'Linux',
        link: 'https://download.m7s.live/bin/m7s_linux_amd64.tar.gz'
      },
      {
        text: 'Linux(arm64)',
        link: 'https://download.m7s.live/bin/m7s_linux_arm64.tar.gz'
      }
    ]
  },
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
