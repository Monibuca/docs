# RTSP插件

## 插件地址

github.com/Monibuca/plugin-rtsp

## 插件引入
```go
import (
    _ "github.com/Monibuca/plugin-rtsp"
)
```

## 默认插件配置

```toml
[RTSP]
# 端口接收推流
ListenAddr = ":554"
Reconnect = true
[[RTSP.AutoPullList]]
URL = "rtsp://admin:admin@192.168.1.212:554/cam/realmonitor?channel=1&subtype=1"
StreamPath = "live/rtsp1"
[[RTSP.AutoPullList]]
URL = "rtsp://admin:admin@192.168.1.212:554/cam/realmonitor?channel=2&subtype=1"
StreamPath = "live/rtsp2"
```

- ListenAddr是监听的地址
- Reconnect 是否自动重连
- RTSP.AutoPullList 可以配置多项，用于自动拉流，其中StreamPath必须是唯一的

## 插件功能

### 接收RTSP协议的推流

例如通过ffmpeg向m7s进行推流

```bash
ffmpeg -i **** rtsp://localhost/live/test
```

会在m7s内部形成一个名为live/test的流

### 从远程拉取rtsp到m7s中

可调用接口
/api/rtsp/pull?target=[RTSP地址]&streamPath=[流标识]

### 罗列所有的rtsp协议的流

/api/rtsp/list