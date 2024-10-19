# plugin-edge

边缘服务器插件——使得 m7s 实例可作为边缘服务器

## 插件地址

https://github.com/Monibuca/plugin-edge

## 插件引入

```go
import _ "m7s.live/plugin/edge/v4"
```

## 配置

```yaml
edge:
  origin: "http://localhost:8080/hdl/"
```

origin 代表源服务器拉流地址前缀，可以由如下几种格式：

- http://[host]:[port]/hdl/ 使用 hdl 协议拉流
- rtmp://[host]:[port]/ 使用 rtmp 协议拉流
- rtsp://[host]:[port]/ 使用 rtsp 协议拉流

## 使用

当配置了 edge 后，该实例即可成为边缘服务器，即当收到一个订阅者时将自动向源服务器发送拉流请求，从而实现级联的效果。
