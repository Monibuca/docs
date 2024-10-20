import type { DefaultTheme } from 'vitepress'

export const nav: DefaultTheme.Config['nav'] = [
  {
    text: '指南',
    activeMatch: '/guide/',
    link: '/guide/startup'
  },

  {
    text: 'm7s admin',
    activeMatch: '/admin/',
    link: '/admin/startup'
  },
  {
    text: 'm7s eye',
    activeMatch: '/eye/',
    link: '/eye/startup'
  },
  {
    text: '场景案例',
    activeMatch: '/cook/',
    link: '/cook/all'
  },
  {
    text: '常见问题',
    activeMatch: '/faq/',
    link: '/faq/all'
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
    text: 'v4',
    items: [
      { text: '更新日志', link: 'https://monibuca.com' },
      // { text: 'v5', link: 'https://jessibuca.com' },
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
    text: 'More',
    items: [
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
        text: '关于',
        items: [
          { text: 'FAQ', link: '/about/faq' },
          { text: '开发团队', link: '/about/team' },
          { text: '诞生故事', link: '/about/born' }
        ]
      }
    ]
  },
]
