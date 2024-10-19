# plugin-monitor

生成监控数据

## 插件地址

https://github.com/Monibuca/plugin-monitor

## 插件引入

```go
import _ "m7s.live/plugin/monitor/v4"
```

## 配置

```yaml
monitor:
  path: monitor # 监控数据存储路径
```

## 接口 API

### 获取监控的流历史数据

- **URL**: `/monitor/api/list/stream`
- **请求方式**: GET
- **参数**:

| 参数名     | 必填 | 类型   | 描述                                                              |
| ---------- | ---- | ------ | ----------------------------------------------------------------- |
| streamPath | 否   | string | 流地址，用于筛选指定的流                                          |
| time       | 否   | string | 时间戳 xxxx-xxxx ，用于筛选指定时间段的数据，不传则返回当天的数据 |

- **示例**:
  - `/monitor/api/list/stream?time=xxxx-xxxx&streamPath=xxxx`

### 获取历史流的轨道列表

- **URL**: `/monitor/api/list/track`
- **请求方式**: GET
- **参数**:

| 参数名     | 必填 | 类型   | 描述                                                                                              |
| ---------- | ---- | ------ | ------------------------------------------------------------------------------------------------- |
| streamPath | 否   | string | 流地址，该 streamPath 的值来自上一个 API 中的 path 拼接时间而成（时间格式为 2006-01-02T15:04:05） |

- **示例**:
  - `/monitor/api/list/track?streamPath=xxxx`

### 获取历史数据

- **URL 格式**: `/monitor/[streamPath]/track/h264.yaml`
- **请求方式**: GET
- **描述**: 就是从 monitor 目录里面读取文件，路径就是文件路径，自行替换。
