# plugin-monitor
生成监控数据

## 插件地址

https://github.com/Monibuca/plugin-monitor

## 插件引入

```go
import (
    _ "m7s.live/plugin/monitor/v4"
)
```

## 配置

```yaml
monitor:
  path: monitor # 监控数据存储路径
```

## API

### 获取监控的流历史数据

```
GET /monitor/api/list/stream?time=xxxx-xxxx&streamPath=xxxx
```
streamPath 是可选的，用于筛选指定的流
time 是可选的，用于筛选指定时间段的数据，不传则返回当天的数据

### 获取历史流的轨道列表
  
```
GET /monitor/api/list/track?streamPath=xxxx
```
该 streamPath 的值来自上一个 API 中的 path 拼接时间而成（时间格式为 2006-01-02T15:04:05）

### 获取历史数据

```
GET /monitor/[streamPath]/track/h264.yaml
```
就是从 monitor 目录里面读取文件，路径就是文件路径，自行替换。