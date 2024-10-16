import type { NavData } from "../.vitepress/theme/types";

export const NAV_DATA: NavData[] = [
  {
    title: "Monibuca",
    items: [
      {
        icon: "https://monibuca.com/img/mb.png",
        title: "Monibuca",
        desc: "开源Go语言流媒体服务器开发框架",
        link: "https://monibuca.com",
      },
      {
        title: "Monibuca Pro",
        desc: "为 m7s pro版（包含付费插件） 提供可视化 UI 界面",
        link: "https://github.com/Monibuca/pro",
      },
      {
        title: "Monibuca Console",
        desc: "提供了对m7s实例的可视化管理后台的能力，支持多实例管理",
        link: "https://console.monibuca.com",
      },
    ],
  },
  {
    title: "Jessibuca",
    items: [
      {
        icon: "https://monibuca.com/img/jb.png",
        title: "Jessibuca",
        desc: "纯H5低延迟直播流播放器",
        link: "https://jessibuca.com",
      },
      {
        title: "Pro 播放器",
        desc: "jessibuca pro 是在开源版本的基础上额外支持的深入业务解决方案。解决了一些痛点，比如H265的硬解码，SIMD软解码加速。",
        link: "https://jessibuca.com/player-pro.html",
      },
      {
        title: "点播播放器（ProVod）",
        desc: "基于开源 jessibuca 的点播播放器",
        link: "https://jessibuca.com/player-pro-vod.html",
      },
    ],
  },
  {
    title: "Monibuca",
    items: [
      {
        icon: "https://monibuca.com/img/rb.png",
        title: "Monibuca",
        desc: "30秒完成创建、运行、管理你的 ffmpeg 命令",
        link: "https://Monibuca.com",
      }
    ],
  },
];
