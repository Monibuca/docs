module.exports = {
    title: "m7s 文档",
    description: 'm7s(Monibuca V3)文档',
    themeConfig: {
        repo: 'langhuihui/monibuca',
        algolia: {
            apiKey: 'ef7719844e5225deb8417c34f2445be3',
            indexName: 'monibuca'
          },
        nav: [
            { text: '引导', link: '/', activeMatch: '^/$|^/guide/' },
            {
                text: '配置',
                link: '/config',
                activeMatch: '^/config'
            },
            {
                text: '插件',
                link: '/plugins/basic',
                activeMatch: '^/plugins/'
            },
            {
                text: 'API',
                link: '/api/basic',
                activeMatch: '^/api/'
            },
            {
                text: '二次开发',
                link: '/principle/basic',
                activeMatch: '^/principle/'
            }
        ],

        sidebar: {
            // '/guide/': getGuideSidebar(),
            // '/config': [{
            //     text: '配置', link: '/config'
            // }],
            // '/plugins/': [{
            //     text: '官方插件', link: '/plugins/basic'
            // }],
            // '/api/': [{
            //     text: 'API', link: '/api/basic'
            // }],
            // "/principle/": [
            //     {
            //         text: "二次开发", children: [{
            //             text: "基本概念",
            //             link: "/principle/basic"
            //         }, {
            //             text: "架构设计",
            //             link: "/principle/architecture"
            //         }]
            //     },
            // ],
            '/': getGuideSidebar()
        }
    },
    markdown: {
        config: md => {
            // use more markdown-it plugins! quick-plugin-md/dist/plugin/mermaid.js
             md.use(require('quick-plugin-md/language/'),{
          // 无需标签根据第一行代码自动转为图形组件
          // tags: ['gitGraph', 'classDiagram', 'sequenceDiagram', 'gantt'],
          // /** 默认标签*/
          // default: 'mermaid',
          // // 输出日志
          // log: true,
          // // 自定义markdown标签对应转换的模板组件名
          // template: {
          //   // mermaid 标签转为 组件定义
          //   // mermaid: '<mermaid code="{code}"></mermaid>',
          //   mermaid: '<mermaid>{code}</mermaid>',
          //   pie: '<PieCode>{code}</PieCode>',
          // },
             });
          },
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
        },{
            text: '官方插件', children: [{
                text:"简介",link: '/plugins/basic'
            }, {
                text:"rtmp",link:'/plugins/rtmp'
            }]
        },{
            text: 'API', children: [{
                text:"核心定义",link: '/api/basic'
            }, {
                text:"接口定义",link:'/api/http'
            }]
        },{
            text: "二次开发", children: [{
                text: "基本概念",
                link: "/principle/basic"
            }, {
                text: "架构设计",
                link: "/principle/architecture"
            }]
        },
        {
            text: '诞生过程',
            link: '/guide/born'
        }
    ]
}