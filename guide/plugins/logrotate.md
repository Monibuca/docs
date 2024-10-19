# LogRotate 插件

可以实时查看日志输出，和日志查询。日志查询暂时只支持 linux 系统

## 插件地址

https://github.com/Monibuca/plugin-logrotate

## 插件引入

```go
import _ "m7s.live/plugin/logrotate/v4"
```

## 默认配置

```yaml
logrotate:
  path: ./logs # 生成日志的目录
  size: 0 # 每个日志文件的大小，单位字节，0表示不限制
  days: 1 # 按时间分割，单位是天，即24小时
  formatter: 2006-01-02T15 # 日志文件名格式化，按照go layout格式化，默认按照小时
```

## 接口 API

### 监听日志输出

- **URL**: `/logrotate/api/tail`
- **请求方式**: SSE（server-sent Event）

### 查找日志

- **URL**: `/logrotate/api/find`
- **描述**: 目前只支持 linux 系统（使用 grep）
- **请求方式**: GET

### 列出所有日志文件

- **URL**: `/logrotate/api/list`
- **请求方式**: GET

### 查看日志内容

- **URL**: `/logrotate/api/open`
- **请求方式**: GET
- **参数**:

| 参数名 | 必填 | 类型   | 描述   |
| ------ | ---- | ------ | ------ |
| file   | 是   | string | 文件名 |

- **示例**:
  - `/logrotate/api/open?file=xxxx`

### 下载某个日志

- **URL**: `/logrotate/api/download`
- **请求方式**: GET
- **参数**:

| 参数名 | 必填 | 类型   | 描述   |
| ------ | ---- | ------ | ------ |
| file   | 是   | string | 文件名 |

- **示例**:
  - `/logrotate/api/download?file=xxxx`
