# 截图插件

可通过 http 请求获取到指定流的 I 帧截图（jpg 格式）。

## 插件地址

https://github.com/Monibuca/plugin-snap

## 插件引入

```go
import _ "m7s.live/plugin/snap/v4"
```

## 默认配置

```yaml
snap:
  ffmpeg: "ffmpeg"
```

如果 ffmpeg 无法全局访问，则可修改 ffmpeg 路径为本地的绝对路径

## 接口 API

### 获取一帧截图

- **URL**: `/snap`
- **请求方式**: GET
- **返回**: 返回最新的 I 帧的 jpg 图片
- **参数**:

| 参数名     | 必填 | 类型   | 描述   |
| ---------- | ---- | ------ | ------ |
| streamPath | 是   | string | 流地址 |

- **示例**:
  - `/snap/[streamPath]`

例如 m7s 中有流 live/test , 可以通过 http://localhost:8080/snap/live/test 获取到该流的最新截图
