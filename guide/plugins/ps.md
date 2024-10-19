_[English](https://github.com/Monibuca/plugin-ps/blob/v4/README.en.md) | 简体中文_

# PS 插件

支持接收 MpegPS 流

## 插件地址

https://github.com/Monibuca/plugin-ps

## 插件引入

```go
import _ "m7s.live/plugin/ps/v4"
```

## 默认配置

```yaml
ps:
<!--@include: @/block/config/config.http.md-->
<!--@include: @/block/config/config.publish.md-->
<!--@include: @/block/config/config.subscribe.md-->
  relaymode: 1 # 0:纯转发 1:转协议，不转发 2:转发并且转协议
```

## 接口 API

<!--@include: @/block/api/api.ps.md-->
