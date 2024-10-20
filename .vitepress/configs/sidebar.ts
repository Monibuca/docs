export const sidebar = {
  '/admin/': [
    {
      text: '开始',
      items: [{ text: '快速起步', link: '/admin/startup' }],
    },
  ],
  '/eye/': [
    {
      text: '开始',
      items: [{ text: '快速起步', link: '/eye/startup' }],
    },
  ],
  '/cook/': [
    {
      text: '场景案列',
      items: [{ text: '汇总', link: '/cook/all' }],
    },
  ],
  '/faq/': [
    {
      text: '常见问题',
      items: [
        { text: '汇总', link: '/faq/all' },
        { text: 'ffmpeg推流失败', link: '/faq/ffmpeg推流失败' },
        { text: '浏览器播放rtmp和rtsp失败', link: '/faq/浏览器播放rtmp和rtsp失败' },
        { text: 'gb插件能收到设备注册但是没有流', link: '/faq/gb插件能收到设备注册但是没有流' },
        { text: 'obs推送rtsp失败', link: '/faq/obs推送rtsp失败' },
        { text: 'StreamPath格式错误', link: '/faq/StreamPath格式错误' },
        { text: 'webrtc播放h265失败', link: '/faq/webrtc播放h265失败' },
        { text: 'webrtc不支持aac格式音频', link: '/faq/webrtc不支持aac格式音频' },
        { text: '播放地址不正确', link: '/faq/播放地址不正确' },
        { text: 'm7s服务直接退出或崩溃', link: '/faq/m7s服务直接退出或崩溃' },
      ],
    },
  ],
  // '/faq/': [
  //   {
  //     text: '常见问题',
  //     items: [
  //       { text: '汇总', link: '/faq/all' },
  //       {
  //         text: '崩溃问题',
  //         items: [{ text: 'm7s服务直接退出或崩溃', link: '/faq/error' }],
  //       },
  //       {
  //         text: '推流拉流问题',
  //         items: [
  //           { text: 'ffmpeg推流失败', link: '/faq/push1' },
  //         ],
  //       },
  //       {
  //         text: '播放问题',
  //         items: [
  //           { text: 'ffmpeg推流失败', link: '/faq/play' },
  //         ],
  //       },
  //     ],
  //   },
  // ],
  '/guide/': [
    {
      text: '开始',
      items: [
        { text: '介绍', link: '/guide/introduction' },
        { text: '快速起步', link: '/guide/startup' },
        { text: '配置', link: '/guide/config' },
        { text: 'API', link: '/guide/api' },
        { text: '鉴权', link: '/guide/authentication' },
      ],
    },
    {
      text: '官方插件',
      items: [
        { text: 'rtmp', link: '/guide/plugins/rtmp' },
        { text: 'rtsp', link: '/guide/plugins/rtsp' },
        { text: 'hdl', link: '/guide/plugins/hdl' },
        { text: 'hls', link: '/guide/plugins/hls' },
        { text: 'gb28181', link: '/guide/plugins/gb28181' },
        { text: 'ps', link: '/guide/plugins/ps' },
        { text: 'jessica', link: '/guide/plugins/jessica' },
        { text: 'webrtc', link: '/guide/plugins/webrtc' },
        { text: 'webtransport', link: '/guide/plugins/webtransport' },
        { text: 'fmp4', link: '/guide/plugins/fmp4' },
        { text: 'record', link: '/guide/plugins/record' },
        { text: 'debug', link: '/guide/plugins/debug' },
        { text: 'logrotate', link: '/guide/plugins/logrotate' },
        { text: 'hook', link: '/guide/plugins/hook' },
        { text: 'room', link: '/guide/plugins/room' },
        { text: 'preview', link: '/guide/plugins/preview' },
        { text: 'snap', link: '/guide/plugins/snap' },
        { text: 'edge', link: '/guide/plugins/edge' },
        { text: 'exporter', link: '/guide/plugins/exporter' },
        { text: 'monitor', link: '/guide/plugins/monitor' },
      ],
    },
    // {
    //   text: '升级日志',
    //   items: [{ text: 'v4', link: '/guide/v4' }]
    // },
    // {
    //   text: '常见问题',
    //   items: [
    //     { text: '崩溃问题', link: '/guide/qa/error' },
    //     { text: '推流问题', link: '/guide/qa/push' },
    //     { text: '播放问题', link: '/guide/qa/play' }
    //   ]
    // }
  ],
  '/devel/': [
    {
      text: '开发',
      items: [
        { text: '准备', link: '/devel/startup' },
        { text: '定义插件', link: '/devel/plugin' },
        { text: '插件接口', link: '/devel/api' },
        { text: '发布者', link: '/devel/publisher' },
        { text: '拉流者', link: '/devel/puller' },
        { text: '订阅者', link: '/devel/subscriber' },
        { text: '推流者', link: '/devel/pusher' },
        { text: '鉴权', link: '/devel/authentication' },
        { text: '中间件', link: '/devel/middleware' },
      ],
    },
  ],
  '/about/': [
    {
      text: '关于',
      items: [
        { text: 'FAQ', link: '/about/faq' },
        { text: '开发团队', link: '/about/team' },
        { text: '诞生故事', link: '/about/born' },
      ],
    },
  ],
}
