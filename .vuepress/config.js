module.exports = {
    dest: 'dist',
    serviceWorker: true,
    themeConfig: {
        nav: [
            { text: 'Home', link: 'https://monibuca.com' },
            { text: 'Github', link: 'https://github.com/Monibuca/docs' },
        ],
        sidebarDepth: 2,
        sidebar: [
            ['/', '起步'],
            ['/develop', '插件开发'],
            ['/concept', '重要概念'],
            ['/design', '设计原理'],
            ['/qanda', 'Q & A'],
            ['/born', '诞生过程'],
            ['/history', '更新日志'],
            ['/api', 'API'],
            ['/reference', '参考文献'],
        ],
        lastUpdated: 'Last Updated'
    },
    title: 'Monibuca',
    base: '/',
    head: [
        ['link', { rel: 'icon', href: '/favicon.ico' }]
    ],
    plugins: [
        '@vuepress/back-to-top',
        '@vuepress/active-header-links',
        'vuepress-plugin-code-copy'
    ]
}