# HDL 插件

HDL 插件主要功能是提供 HTTP-FLV 协议的访问

HTTP-FLV 协议（HDL：Http Dynamic Live）是一种动态流媒体直播协议，它是在普通的 HTTP 协议上实现了对 FLV 格式视频进行直播的功能。其名字含义主要可以拆分为三个部分：

- HTTP（HyperText Transfer Protocol）：超文本传输协议，是一种用于在万维网上进行信息传输的协议。在 HTTP-FLV 协议中，HTTP 作为基本协议，提供数据传输的基础结构。
- FLV（Flash Video）：一种流媒体视频格式，起初由 Adobe 公司设计，主要用于在线播放短视频或直播。
- HDL：Http Dynamic Live，是 HTTP-FLV 协议别称的缩写，可以理解为“基于 HTTP 的动态直播协议”，强调的是它在原有 HTTP 协议基础上，通过动态技术实现视频直播的功能。

## 插件地址

https://github.com/Monibuca/plugin-hdl

## 插件引入

```go
import _ "m7s.live/plugin/hdl/v4"
```

## 插件配置

```yaml
hdl:
<!--@include: @/block/config/config.http.md-->
<!--@include: @/block/config/config.publish.md-->
<!--@include: @/block/config/config.subscribe.md-->
<!--@include: @/block/config/config.pull.md-->
```

## 接口 API

<!--@include: @/block/api/api.hdl.md-->
