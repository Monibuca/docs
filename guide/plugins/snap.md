# 截图插件

可通过http请求获取到指定流的I帧截图（jpg格式）。

## 插件地址

https://github.com/Monibuca/plugin-snap

## 插件引入
```go
import (
    _ "m7s.live/plugin/snap/v4"
)
```
## 默认配置

```yaml
snap:
    ffmpeg: "ffmpeg"
```
如果ffmpeg无法全局访问，则可修改ffmpeg路径为本地的绝对路径
## API

### `/snap/[streamPath]`

获取一帧截图，返回最新的I帧的jpg图片。
例如m7s（localhost)中有流live/test,
可以通过http://localhost:8080/snap/live/test 获取到该流的最新截图

