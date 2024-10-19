# plugin-edge
边缘服务器插件——使得m7s实例可作为边缘服务器


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

origin代表源服务器拉流地址前缀，可以由如下几种格式：
- http://[host]:[port]/hdl/ 使用hdl协议拉流
- rtmp://[host]:[port]/ 使用rtmp协议拉流
- rtsp://[host]:[port]/ 使用rtsp协议拉流

## 使用

当配置了edge后，该实例即可成为边缘服务器，即当收到一个订阅者时将自动向源服务器发送拉流请求，从而实现级联的效果。