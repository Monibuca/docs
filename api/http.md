# 接口文档
## Gateway

- `/api/gateway/sysInfo` 系统信息，包含版本号（Version）和启动时间（StartTime）两个字段
- `/api/gateway/plugins` 所有插件信息，是一个数组里面包含插件的名称（Name）、版本（Version）、README（ReadMe）、配置（Config）、热更新配置（HotConfig）
- `/api/gateway/config` 返回原始配置文件
- `/api/gateway/stop?stream=xxx` 终止某一个流，入参是流标识（stream）
- `/api/gateway/h264?stream=xxx&len=10` 获取一段h264的流用于调试，入参数len代表需要获取的时长单位是秒
- `/api/gateway/getIFrame?stream=xxx` 获取一个I帧数据，包含了SPS和PPS信息
- `/api/gateway/modifyConfig?name=xxx&key=xxx&value=xxx` 修改可以热更新的配置,name是插件名（插件注册时设置）

## RTSP协议
### 从远程拉取rtsp到m7s中

可调用接口
`/api/rtsp/pull?target=[RTSP地址]&streamPath=[流标识]`

### 罗列所有的rtsp协议的流

`/api/rtsp/list`