// https://vitepress.dev/guide/custom-theme
import { h, watch } from 'vue'
import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import './styles/index.scss'
import { useData } from 'vitepress'
import MNavLinks from './components/MNavLinks.vue'
import HeroVideo from './components/HeroVideo.vue'

import 'viewerjs/dist/viewer.min.css'
import imageViewer from 'vitepress-plugin-image-viewer'
import vImageViewer from 'vitepress-plugin-image-viewer/lib/vImageViewer.vue'

import { useRoute } from 'vitepress'

let homePageStyle: HTMLStyleElement | undefined

function updateHomePageStyle(value: boolean) {
  if (value) {
    if (homePageStyle) return

    homePageStyle = document.createElement('style')
    homePageStyle.innerHTML = `
    :root {
      animation: rainbow 12s linear infinite;
    }`
    document.body.appendChild(homePageStyle)
  } else {
    if (!homePageStyle) return

    homePageStyle.remove()
    homePageStyle = undefined
  }
}

export default {
  extends: DefaultTheme,
  Layout: () => {
    const props: Record<string, any> = {}
    // 获取 frontmatter
    const { frontmatter } = useData()

    /* 添加自定义 class */
    if (frontmatter.value?.layoutClass) {
      props.class = frontmatter.value.layoutClass
    }

    return h(DefaultTheme.Layout, props, {
      // 'home-hero-image': () => h(HeroVideo)
    })
  },
  enhanceApp({ app, router, siteData }) {
    if (typeof window !== 'undefined') {
      const script = document.createElement('script')
      script.src =
        'https://lf-cdn.coze.cn/obj/unpkg/flow-platform/chat-app-sdk/0.1.0-beta.6/libs/cn/index.js'
      script.onload = () => {
        // 脚本加载完成后执行的代码
        // @ts-ignore
        new CozeWebSDK.WebChatClient({
          config: {
            bot_id: '7427521310093344779',
          },
          componentProps: {
            title: 'Coze',
          },
        })
      }
      document.body.appendChild(script)
    }
    app.component('MNavLinks', MNavLinks)
    app.component('vImageViewer', vImageViewer)

    if (typeof window !== 'undefined') {
      watch(
        () => router.route.data.relativePath,
        () => updateHomePageStyle(location.pathname === '/'),
        { immediate: true }
      )
      watch(
        () => router.route.path,
        (newPath) => {
          // @ts-ignore
          // const idProd = process.env.ENVIRONMENT == 'production'
          // @ts-ignore
          // if (idProd && newPath == '/docs/') window.location.href = 'https://monibuca.com/'
        }
      )
    }
  },
  setup() {
    // Get route
    const route = useRoute()
    // Using
    imageViewer(route)
  },
} satisfies Theme
