import DefaultTheme from 'vitepress/theme';
import startup from 'quick-plugin-md';
//import { Mermaid } from '../../../packages';
import 'quick-plugin-md/styles/index.css'
export default {
  ...DefaultTheme,
  
  // NotFound: () => 'custom 404', // <- this is a Vue 3 functional component
  enhanceApp({ app, router, siteData }) {
    // app is the Vue 3 app instance from `createApp()`. router is VitePress'
    // custom router. `siteData`` is a `ref`` of current site-level metadata.
    // 注册全局组件
    // app.component('Mermaid', Mermaid);
    app.use(startup, {
      plus: true,
      log: true,
    });
  },
};
