# LogRotate插件

可以实时查看日志输出，和日志查询
日志查询暂时只支持linux系统

## 插件地址
https://github.com/Monibuca/plugin-logrotate

# 插件引入
```go
import (
    _ "m7s.live/plugin/logrotate/v4"
)
```
## 默认配置
```yaml
logrotate:
 path: ./logs # 生成日志的目录
 size: 0 # 每个日志文件的大小，单位字节，0表示不限制
 days: 1 # 按时间分割，单位是天，即24小时
 formatter : 2006-01-02T15 # 日志文件名格式化，按照go layout格式化，默认按照小时
```
## API接口

- `logrotate/api/tail` 监听日志输出，该请求是一个SSE（server-sent Event）
- `logrotate/api/find` 查找日志，目前只支持linux系统（使用grep）
- `logrotate/api/list` 列出所有日志文件
- `logrotate/api/open?file=xxx` 查看日志内容，入参是文件名
- `logrotate/api/download?file=xxx` 下载某个日志，入参是文件名