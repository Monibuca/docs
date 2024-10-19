# WebTransport 插件

通过 WebTransport 进行推拉流

## 插件地址

https://github.com/Monibuca/plugin-webtransport

## 插件引入

```go
import _ "m7s.live/plugin/webtransport/v4"
```

## 配置

```yaml
webtransport:
  listenaddr: :4433
  certfile: local.monibuca.com_bundle.pem
  keyfile: local.monibuca.com.key
```

## 接口 API

- `/play/[streamPath]` 用来播放
- `/push/[streamPath]` 用来推流

建立双向流后传输 flv 格式的数据
