# LogRotate插件

日志分割插件，带UI界面，可以实时查看日志输出，和日志查询
日志查询暂时只支持linux系统

## 默认配置
```toml
[LogRotate]
Path = "log"
Size = 0
Days = 1
Formatter = "2006-01-02T15"
```
其中Path代表生成日志的目录
Size代表按大小分割，单位是字节，如果为0，则按时间分割
Days代表按时间分割，单位是天，即24小时
Formatter日志文件名格式化，按照go layout格式化，默认按照小时

## API接口

- `/api/logrotate/tail` 监听日志输出，该请求是一个SSE（server-sent Event）
- `/api/logrotate/find` 查找日志，目前只支持linux系统（使用grep）
- `/api/logrotate/list` 列出所有日志文件
- `/api/logrotate/open?file=xxx` 查看日志内容，入参是文件名
- `/api/logrotate/download?file=xxx` 下载某个日志，入参是文件名