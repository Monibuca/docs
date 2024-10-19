// https://vitepress.dev/guide/custom-theme
import { h, watch } from 'vue'
import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import './styles/index.scss'
import { useData } from 'vitepress'
import MNavLinks from './components/MNavLinks.vue'
import HeroVideo from './components/HeroVideo.vue'

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
    app.component('MNavLinks', MNavLinks)

    if (typeof window !== 'undefined') {
      watch(
        () => router.route.data.relativePath,
        () => updateHomePageStyle(location.pathname === '/'),
        { immediate: true }
      )
      watch(() => router.route.path, (newPath) => {
        // @ts-ignore
        const idProd = process.env.ENVIRONMENT == 'production'
        // @ts-ignore
        if (idProd && newPath == '/docs/') window.location.href = 'https://monibuca.com/'
      });
    }
  }
} satisfies Theme
