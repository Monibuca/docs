# 网关插件

该插件主要提供http协议访问，供其他插件公用http接口端口，并且提供一些基础的API

## 插件地址

github.com/Monibuca/plugin-gateway

## 插件引入
```go
import (
    _ "github.com/Monibuca/plugin-gateway"
)
```

## 默认插件配置
```toml
[GateWay]
ListenAddr = ":8080"
#ListenAddrTLS = ":8082"
#CertFile = "xxx.cert"
#KeyFile = "xxx.key"
#StaticPath = ""
```
- `ListenAddr` 公共http监听端口
- `ListenAddrTLS` 公共https监听端口
- `CertFile` https用的证书
- `KeyFile` https用的证书的key
- `StaticPath` 静态资源目录，设置后可以通过访问公共http监听端口来访问这些静态资源

## 自带的API接口

- `/api/gateway/sysInfo` 系统信息，包含版本号（Version）和启动时间（StartTime）两个字段
- `/api/gateway/plugins` 所有插件信息，是一个数组里面包含插件的名称（Name）、版本（Version）、README（ReadMe）、配置（Config）、热更新配置（HotConfig）
- `/api/gateway/config` 返回原始配置文件
- `/api/gateway/stop?stream=xxx` 终止某一个流，入参是流标识（stream）
- `/api/gateway/h264?stream=xxx&len=10` 获取一段h264的流用于调试，入参数len代表需要获取的时长单位是秒
- `/api/gateway/getIFrame?stream=xxx` 获取一个I帧数据，包含了SPS和PPS信息
- `/api/gateway/modifyConfig?name=xxx&key=xxx&value=xxx` 修改可以热更新的配置,name是插件名（插件注册时设置）