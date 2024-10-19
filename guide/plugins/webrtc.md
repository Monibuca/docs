_[English](https://github.com/Monibuca/plugin-webrtc/blob/v4/README.en.md) | 简体中文_

# WebRTC 插件

提供通过网页发布视频到 monibuca，以及从 monibuca 拉流通过 webrtc 进行播放的功能，遵循 WHIP 规范

## 插件地址

https://github.com/Monibuca/plugin-webrtc

## 插件引入

```go
import _ "m7s.live/plugin/webrtc/v4"
```

## 默认配置

```yaml
webrtc:
  iceservers: []
  publicip: [] # 可以是数组也可以是字符串（内部自动转成数组）
  port: tcp:9000 # 可以是udp:8000-9000 范围端口，也可以udp:9000 单个端口
  pli: 2s # 2s
```

**本地测试无需修改默认配置，如果远程访问，则需要配置 publicip**

### ICE 服务器配置格式

```yaml
webrtc:
  iceservers:
    - urls:
        - stun:stun.l.google.com:19302
        - turn:turn.example.org
      username: user
      credential: pass
```

## 基本原理

通过浏览器和 monibuca 交换 sdp 信息，然后读取 rtp 包或者发送 rtp 的方式进行

## 接口 API

### 播放地址

`/webrtc/play/[streamPath]`

Body: `SDP`

Content-Type: `application/sdp`

Response Body: `SDP`

### 推流地址

`/webrtc/push/[streamPath]`

Body: `SDP`

Content-Type: `application/sdp`

Response Body: `SDP`

### 推流测试页面

`/webrtc/test/publish`

- 可增加参数`?streamPath=xxx`指定推流地址，默认为`live/webrtc`
- 可以增加其他推流参数

### 屏幕分享测试

`/webrtc/test/screenshare`

- 可增加参数`?streamPath=xxx`指定推流地址，默认为`live/webrtc`
- 可以增加其他推流参数

### 播放测试页面

`/webrtc/test/subscribe`

- 可增加参数`?streamPath=xxx`指定播放地址，默认为`live/webrtc`
- 可以增加其他播放参数

## WHIP

WebRTC-HTTP ingestion protocol
用于 WebRTC 交换 SDP 信息的规范

[WHIP ietf](https://datatracker.ietf.org/doc/html/draft-ietf-wish-whip-02)
