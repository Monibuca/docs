# HDL插件

HDL插件主要功能是提供HTTP-FLV协议的访问

HTTP-FLV协议（HDL：Http Dynamic Live）是一种动态流媒体直播协议，它是在普通的HTTP协议上实现了对FLV格式视频进行直播的功能。其名字含义主要可以拆分为三个部分：

- HTTP（HyperText Transfer Protocol）：超文本传输协议，是一种用于在万维网上进行信息传输的协议。在HTTP-FLV协议中，HTTP作为基本协议，提供数据传输的基础结构。

- FLV（Flash Video）：一种流媒体视频格式，起初由Adobe公司设计，主要用于在线播放短视频或直播。

- HDL：Http Dynamic Live，是HTTP-FLV协议别称的缩写，可以理解为“基于HTTP的动态直播协议”，强调的是它在原有HTTP协议基础上，通过动态技术实现视频直播的功能。

## 插件地址

https://github.com/Monibuca/plugin-hdl

## 插件引入
```go
import (
    _ "m7s.live/plugin/hdl/v4"
)
```

## 默认插件配置

```yaml
hdl:
  http: # 格式参考全局配置
  publish: # 格式参考全局配置
  subscribe: # 格式参考全局配置
  pull: # 格式 https://m7s.live/guide/config.html#%E6%8F%92%E4%BB%B6%E9%85%8D%E7%BD%AE
```
## 插件功能

### 从m7s拉取http-flv协议流
如果m7s中已经存在live/test流的话就可以用http-flv协议进行播放
如果监听端口不配置则公用全局的HTTP端口(默认8080)
```bash
ffplay http://localhost:8080/hdl/live/test.flv
```
### m7s从远程拉取http-flv协议流

可调用接口
`/hdl/api/pull?target=[HTTP-FLV地址]&streamPath=[流标识]&save=[0|1|2]`

- save含义： 0-不保存 1-保存到pullonstart 2-保存到pullonsub
- HTTP-FLV地址需要进行urlencode 防止其中的特殊字符影响解析
### 获取所有HDL流列表
`/hdl/api/list`