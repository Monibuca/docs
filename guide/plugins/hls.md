# HLS 插件

该插件可用来拉取网络上的 m3u8 文件并解析后转换成其他协议

- 可以直接访问`http://localhost:8080/hls/live/user1.m3u8` 进行播放，其中 8080 端口是全局 HTTP 配置，live/user1 是 streamPath，需要根据实际情况修改
- llhls 地址形式`http://localhost:8080/llhls/live/user1/index.m3u8` 进行播放，其中 8080 端口是全局 HTTP 配置，live/user1 是 streamPath，需要根据实际情况修改

## 插件地址

https://github.com/Monibuca/plugin-hls

## 插件引入

```go
import _ "m7s.live/plugin/hls/v4"
```

## 接口 API

<!--@include: @/block/api/api.hls.md-->

## 配置

- 配置信息按照需要添加到配置文件中，无需复制全部默认配置信息
- publish 和 subscribe 配置会覆盖全局配置

```yaml
llhls:
<!--@include: @/block/config/config.http.md-->
hls:
<!--@include: @/block/config/config.http.md-->
<!--@include: @/block/config/config.publish.md-->
<!--@include: @/block/config/config.subscribe.md-->
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

转发模式仅仅对从远端拉流的 hls 起作用。relaymode 可以配置不同的转发模式，其中，转协议意味着 hls 可以拉流可以转换成其他协议格式，即需要对 hls 的数据进行解析。

转发意味着 hls 中的 ts 文件缓存在服务器，可以在从服务器拉流时直接读取 ts 文件。

例如，如果希望只做 hls 的纯转发，减少 cpu 消耗，可以配置

```yaml
hls:
  relaymode: 1
```

## HLS.js 测试页面

访问 http://localhost:8080/hls/index.html

域名和端口根据实际情况修改
