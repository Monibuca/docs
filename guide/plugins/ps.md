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

### 接收 PS 流

`/ps/api/receive?streamPath=xxx&ssrc=xxx&port=xxx&reuse=1&dump=xxx`
其中：

- reuse 代表是否端口复用，如果使用端口复用，请务必确定设备发送的 ssrc 和 ssrc 参数一致，否则会出现混流的情况
- dump 代表是否 dump 到文件，如果 dump 到文件，会在当前目录下生成一个以 dump 为名的文件夹，文件夹下面是以 streamPath 参数值为名的文件，文件内容从端口收到的数据[4byte 内容长度][2byte 相对时间][内容]

### 回放 PS 的 dump 文件

`/ps/api/replay?streamPath=xxx&dump=xxx`

- dump 代表需要回放的文件，默认是 dump/ps
- streamPath 代表回放时生成的视频流的 streamPath, 默认是 replay/dump/ps (如果 dump 传了 abc, 那么 streamPath 默认是 replay/abc)

### 以 ws 协议读取 PS 流

`ws://[host]/ps/[streamPath]`

例如： ws://localhost:8080/ps/live/test

数据包含的是裸的 PS 数据，不包含 rtp 头
