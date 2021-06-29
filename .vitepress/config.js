module.exports = {
    title: "Monibuca V3文档",
    description: 'Monibuca V3文档',
    themeConfig: {
        nav: [
            { text: '引导', link: '/', activeMatch: '^/$|^/guide/' },
            {
                text: '配置',
                link: '/config',
                activeMatch: '^/config'
            },
            {
                text: '插件',
                link: '/plugins',
                activeMatch: '^/plugins/'
            },
            {
                text: 'API',
                link: '/api',
                activeMatch: '^/api/'
            },
            {
                text: '二次开发',
                link: '/principle/basic',
                activeMatch: '^/principle/'
            }
        ],

        sidebar: {
            '/guide/': getGuideSidebar(),
            '/config': [{
                text: '配置', link: '/config'
            }],
            "/principle/": [
                {
                    text: "二次开发", children: [{
                        text: "基本概念",
                        link: "/principle/basic"
                    }, {
                        text: "架构设计",
                        link: "/principle/architecture"
                    }]
                },
                {
                    text: "引擎", children: [{
                        text: "插件机制", link: "/"
                    }, {
                        text: "流管理", link: "/"
                    }, {
                        text: "环形缓冲", link: "/"
                    }, {
                        text: "媒体轨道", link: "/"
                    }]
                },
                // { text: "架构", children: [] },
                // {
                //     text: "引擎", children: [

                //     ]
                // },
                // { text: "工具包", children: [] }
            ], '/': getGuideSidebar()
        }
    }
}
function getGuideSidebar() {
    return [
        {
            text: '介绍',
            children: [
                { text: '什么是Monibuca?', link: '/' },
                { text: '起步', link: '/guide/getting-started' },
                { text: '配置', link: '/config' },
                { text: '部署', link: '/guide/deploy' }
            ]
        },
        {
            text: '诞生过程',
            link: '/guide/born'
        }
    ]
}