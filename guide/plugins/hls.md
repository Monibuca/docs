# HLS插件

- 该插件可用来拉取网络上的m3u8文件并解析后转换成其他协议
- 可以直接访问`http://localhost:8080/hls/live/user1.m3u8` 进行播放，其中8080端口是全局HTTP配置，live/user1是streamPath，需要根据实际情况修改
- llhls地址形式`http://localhost:8080/llhls/live/user1/index.m3u8` 进行播放，其中8080端口是全局HTTP配置，live/user1是streamPath，需要根据实际情况修改

## 插件地址

https://github.com/Monibuca/plugin-hls

## 插件引入
```go
import (
    _ "m7s.live/plugin/hls/v4"
)
```

## API
> 参数是可变的，下面的参数live/hls是作为例子，不是固定的
- `/hls/api/list`
列出所有HLS流，是一个SSE，可以持续接受到列表数据，加上?json=1 可以返回json数据。
- `/hls/api/save?streamPath=live/hls`
保存指定的流（例如live/hls）为HLS文件（m3u8和ts）当这个请求关闭时就结束保存（该API仅作用于远程拉流）
- `/hls/api/pull?streamPath=live/hls&target=http://localhost/abc.m3u8`
将目标HLS流拉过来作为媒体源在monibuca内以`live/hls`流的形式存在
## 配置
- 配置信息按照需要添加到配置文件中，无需复制全部默认配置信息
- publish 和 subscribe 配置会覆盖全局配置
```yaml
llhls:
    http: # 参考全局配置格式
hls:
    http: # 参考全局配置格式
    publish: # 格式参考全局配置
    subscribe: # 格式参考全局配置
    pull: # 格式 https://m7s.live/guide/config.html#%E6%8F%92%E4%BB%B6%E9%85%8D%E7%BD%AE
    fragment: 10s # TS分片长度
    window: 2 # 实时流m3u8文件包含的TS文件数
    filter: "" # 正则表达式，用来过滤发布的流，只有匹配到的流才会写入
    path: "" # 远端拉流如果需要保存的话，存放的目录
    defaultts: "" # 默认切片用于无流时片头播放,如果留空则使用系统内置
    defaulttsduration: 3.88s # 默认切片的长度
    relaymode: 0 # 转发模式,0:转协议+不转发,1:不转协议+转发，2:转协议+转发
    preload: false # 是否预加载,预加载后会所有的 HLS 订阅都会共享一个内部订阅者，可以加快播放速度，但是无法使用按需关流
```

## 转发模式
转发模式仅仅对从远端拉流的hls起作用。

relaymode 可以配置不同的转发模式

其中，转协议意味着hls可以拉流可以转换成其他协议格式，即需要对hls的数据进行解析，
转发意味着hls中的ts文件缓存在服务器，可以在从服务器拉流时直接读取ts文件。

例如，如果希望只做hls的纯转发，减少cpu消耗，可以配置
  
```yaml
hls:
  relaymode: 1
```
## HLS.js测试页面

访问 `http://localhost:8080/hls/index.html`

域名和端口根据实际情况修改