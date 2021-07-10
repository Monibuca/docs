# HDL插件

HDL插件主要功能是提供HTTP-FLV协议的访问

## 插件地址

github.com/Monibuca/plugin-hdl

## 插件引入
```go
import (
    _ "github.com/Monibuca/plugin-hdl"
)
```

## 默认插件配置

```toml
[HDL]
ListenAddr = ":2020"
ListenAddrTLS = ":2021"
CertFile = "file.cert"
KeyFile = "file.key"
```
- `ListenAddr`是监听的地址，如果配置为空字符串，则是复用Gateway插件监听的公共端口
- `ListenAddrTLS` 公共https监听端口，默认为空，则不监听
- `CertFile` https用的证书，默认为空
- `KeyFile` https用的证书的key，默认为空

## 插件功能


### 从m7s拉取http-flv协议流
如果m7s中已经存在live/test流的话就可以用http-flv协议进行播放
```bash
ffplay -i http://localhost/live/test.flv
```
