# RTSP 插件

rtsp 插件提供 rtsp 协议的推拉流能力，以及向远程服务器推拉 rtsp 协议的能力。

## 插件地址

https://github.com/Monibuca/plugin-rtsp

## 插件引入

```go
import _ "m7s.live/plugin/rtsp/v4"
```

## 推拉地址形式

```sh
rtsp://localhost/live/test
```

- `localhost`是 m7s 的服务器域名或者 IP 地址，默认端口`554`可以不写，否则需要写
- `live`代表`appName`
- `test`代表`streamName`
- m7s 中`live/test`将作为`streamPath`为流的唯一标识

例如通过 ffmpeg 向 m7s 进行推流

```bash
ffmpeg -i [视频源] -c:v h264 -c:a aac -f rtsp rtsp://localhost/live/test
```

会在 m7s 内部形成一个名为 live/test 的流

如果 m7s 中已经存在 live/test 流的话就可以用 rtsp 协议进行播放

```bash
ffplay rtsp://localhost/live/test
```

## 配置

```yaml
rtsp:
<!--@include: @/block/config/config.publish.md-->
<!--@include: @/block/config/config.subscribe.md-->
  pull: # 格式参考文档 https://m7s.live/guide/config.html#%E6%8F%92%E4%BB%B6%E9%85%8D%E7%BD%AE
  push: # 格式参考文档 https://m7s.live/guide/config.html#%E6%8F%92%E4%BB%B6%E9%85%8D%E7%BD%AE
  listenaddr: :554
  udpaddr: :8000
  rtcpaddr: :8001
  readbuffercount: 2048 # 读取缓存队列大小
  writebuffercount: 2048 # 写出缓存队列大小
  pullprotocol: tcp # auto, tcp, udp
```

:::tip 配置覆盖
publish
subscribe
两项中未配置部分将使用全局配置
:::

## API

<!--@include: @/block/api/api.rtsp.md-->