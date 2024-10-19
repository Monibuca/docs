# RECORD 插件

对流进行录制的功能插件，提供 Flv、fmp4、hls、裸流格式的录制功能。

## 插件地址

https://github.com/Monibuca/plugin-record

## 插件引入

```go
import _ "m7s.live/plugin/record/v4"
```

## 配置

- 配置中的 path 表示要保存的文件的根路径，可以使用相对路径或者绝对路径
- filter 代表要过滤的 StreamPath 正则表达式，如果不匹配，则表示不录制。为空代表不进行过滤
- fragment 表示分片大小（秒），0 代表不分片

```yaml
record:
<!--@include: @/block/config/config.subscribe.md-->
  flv:
    ext: .flv
    path: record/flv
    autorecord: false
    filter: ""
    fragment: 0
  fmp4:
    ext: .mp4
    path: record/fmp4
    autorecord: false
    filter: ""
    fragment: 0
  mp4:
    ext: .mp4
    path: record/mp4
    autorecord: false
    filter: ""
    fragment: 0
  hls:
    ext: .m3u8
    path: record/hls
    autorecord: false
    filter: ""
    fragment: 0
  raw:
    ext: .
    path: record/raw
    autorecord: false
    filter: ""
    fragment: 0
```

## 接口 API

- `/record/api/list/recording` 罗列所有正在录制中的流的信息
- `/record/api/list?type=flv` 罗列所有录制的 flv 文件
- `/record/api/start?type=flv&streamPath=live/rtc&fileName=xxx&fragment=xxx` 开始录制某个流,返回一个字符串用于停止录制用的 id(fileName 是可选的，且只用于非切片情况,fragment 也是可选的,如果 fileName 和 fragment 都存在，则忽略 fileName)
- `/record/api/stop?id=xxx` 停止录制某个流

其中将 type 值改为 mp4 则录制成 fmp4 格式。

## 点播功能

访问格式：

```
[http/https]://[host]:[port]/record/[streamPath].[flv|mp4|m3u8|h264|h265]
```

例如：

- `http://localhost:8080/record/live/test.flv` 将会读取对应的 flv 文件
- `http://localhost:8080/record/live/test.mp4` 将会读取对应的 fmp4 文件
