# RTMP 插件

rtmp 插件提供 rtmp 协议的推拉流能力，以及向远程服务器推拉 rtmp 协议的能力。

## 插件地址

https://github.com/Monibuca/plugin-rtmp

## 插件引入

```go
import _ "m7s.live/plugin/rtmp/v4"
```

## 配置

```yaml
rtmp:
<!--@include: @/block/config/config.publish.md-->
<!--@include: @/block/config/config.subscribe.md-->
  tcp:
    listenaddr: :1935
    listenaddrtls: "" # 用于RTMPS协议
    certfile: ""
    keyfile: ""
    listennum: 0
    nodelay: false
  pull:
    push:
    chunksize: 65536 # rtmp chunk size
    keepalive: false #保持rtmp连接，默认随着stream的close而主动断开
```

:::tip 配置覆盖
publish
subscribe
两项中未配置部分将使用全局配置
:::

## 接口 API

<!--@include: @/block/api/api.rtmp.md-->

## 推拉地址形式

```sh
rtmp://localhost/live/test
```

- `localhost`是 m7s 的服务器域名或者 IP 地址，默认端口`1935`可以不写，否则需要写
- `live`代表`appName`
- `test`代表`streamName`
- m7s 中`live/test`将作为`streamPath`为流的唯一标识

### 推流

通过 ffmpeg 命令 向 m7s 进行推流

```sh
ffmpeg -i [视频源] -c:v h264 -c:a aac -f flv rtmp://localhost/live/test
```

上述命令执行后，会在 m7s 内部形成一个名为 live/test 的流，这时可以用 rtmp 协议进行播放

```sh
ffplay -i rtmp://localhost/live/test
```
