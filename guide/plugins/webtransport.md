# WebTransport 插件

通过WebTransport进行推拉流

## 插件地址

https://github.com/Monibuca/plugin-webtransport

## 插件引入
```go
    import (  _ "m7s.live/plugin/webtransport/v4" )
```

## 配置

```yaml
webtransport:
  listenaddr: :4433
  certfile: local.monibuca.com_bundle.pem
  keyfile: local.monibuca.com.key
```

## API接口

- `/play/[streamPath]` 用来播放
- `/push/[streamPath]` 用来推流

建立双向流后传输flv格式的数据