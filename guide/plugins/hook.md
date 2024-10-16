# Hook 插件

WebHook For Monibuca

## 插件地址

https://github.com/Monibuca/plugin-hook

## 插件引入

```go
import (
    _ "m7s.live/plugin/hook/v4"
)
```

## 配置

```yaml
hook:
  keepalive: 0 # 定时发送心跳请求，单位秒，默认0不开启
  retrytimes: 3 # 重试次数
  baseurl: "" # url前缀
  header: {} # 自定义HTTP请求头
  requestlist: {} # 请求列表
  extra: {} # 额外自定义传输数据
```

### 简单配置

```yaml
hook:
  requestlist:
    "*": "http://www.example.com" # 任意时间均会发送请求
    startup: "http://www.example.com" # m7s启动时发送请求
    publish: "http://www.example.com/publish" # 发布时发送请求
    subscribe: "http://www.example.com/subscribe" # 订阅时发送请求
    unsubscribe: "http://www.example.com/unsubscribe" # 取消订阅时发送请求
    streamClose: "http://www.example.com/streamClose" # 流关闭时发送请求
    keepalive: "http://www.example.com/keepalive" # 心跳时发送请求
```

### 复杂配置

```yaml
hook:
  requestlist:
    "*":
      method: GET
      header:
        referer: http://www.example.com
      url: "http://www.example.com"
```

## 发送请求数据

默认使用 POST 发送一个 json 数据：

```json
{
  "stream": {
    "StartTime": "0001-01-01T00:00:00Z",
    "WaitTimeout": 10000000000,
    "PublishTimeout": 10000000000,
    "WaitCloseTimeout": 0,
    "Path": "live/test",
    "Publisher": {
      "ID": "",
      "Type": "RTMPReceiver",
      "StartTime": "2022-05-03T13:00:22.5353264+08:00",
      "Args": {},
      "StreamID": 1
    },
    "State": 1,
    "Subscribers": [
      {
        "ID": "",
        "Type": "RTSPSubscriber",
        "StartTime": "2022-05-03T13:00:23.8753554+08:00",
        "Args": {}
      }
    ],
    "Tracks": {
      "aac": {
        "Name": "aac",
        "BPS": 72480,
        "SampleRate": 44100,
        "SampleSize": 16,
        "CodecID": 10,
        "Channels": 2,
        "AVCCHead": "rwE=",
        "Profile": 2
      },
      "h264": {
        "Name": "h264",
        "BPS": 2226142,
        "SampleRate": 90000,
        "SampleSize": 0,
        "CodecID": 7,
        "SPSInfo": {
          "ProfileIdc": 66,
          "LevelIdc": 31,
          "MbWidth": 80,
          "MbHeight": 45,
          "CropLeft": 0,
          "CropRight": 0,
          "CropTop": 0,
          "CropBottom": 0,
          "Width": 1280,
          "Height": 720
        },
        "GOP": 27
      }
    },
    "AppName": "live",
    "StreamName": "test"
  },
  "extra": {},
  "event": "publish",
  "time": 1257894000
}
```

如果指定为 GET 方法，则不会发送 json
而是将 event 和 streamPath 加在 url 后面
