# 配置

v4 默认支持零配置启动，即无需配置文件即可运行。如果有配置文件则配置文件中配置将会覆盖默认配置。
:::tip 配置缓存文件
调用部分API会导致产生缓存配置文件，存放于.m7s目录下。例如调用了拉流转发后，会保存配置到该目录下，启动实例时会合并缓存中的配置信息和配置文件的配置信息。 
:::

## 全局配置

以下是全局配置的全部配置项，以及对应的默认值：
:::tip 注意
下面是默认配置项，所以不需要复制到配置文件中去，只需要把需要修改的部分填写到配置文件中即可覆盖默认配置。 
:::
```yaml
global:
  disableall: false # 是否禁用所有插件
  loglang: zh # 日志语言，可选值：zh,en
  loglevel: info # 日志级别，可选值：debug,info,warn,error,panic,fatal
  http:
    listenaddr: :8080 # 网关地址，用于访问API
    listenaddrtls: :8443  # 用于HTTPS方式访问API的端口配置
    certfile: ""
    keyfile: ""
    cors: true  # 是否自动添加cors头
    username: ""  # 用户名和密码，用于API访问时的基本身份认证
    password: ""
    readtimeout: 0 # 读超时时间
    writetimeout: 0 # 写超时时间
    idletimeout: 0 # 空闲超时时间
  publish:
      pubaudio: true # 是否发布音频流
      pubvideo: true # 是否发布视频流
      kickexist: false # 剔出已经存在的发布者，用于顶替原有发布者
      insertsei: false # 是否启用插入SEI功能
      publishtimeout: 10s # 发布流默认过期时间，超过该时间发布者没有恢复流将被删除
      idletimeout: 0 # 发布者空闲超时时间，超过该时间发布者没有任何操作将被删除，0为关闭该功能
      delayclosetimeout: 0 # 自动关闭触发后延迟的时间(期间内如果有新的订阅则取消触发关闭)，0为关闭该功能，保持连接。
      waitclosetimeout: 0 # 发布者断开后等待时间，超过该时间发布者没有恢复流将被删除，0为关闭该功能，由订阅者决定是否删除
      buffertime: 0 # 缓存时间，用于时光回溯，0为关闭缓存
      key: "" # 订阅者鉴权秘钥
      secretargname: secret # 订阅者鉴权参数名
      expireargname: expire # 订阅者鉴权过期时间参数名
      speedlimit: 500ms # 限速超时时间0为不限速，对于读取文件这类流需要限速，否则读取过快
  subscribe:
      subaudio: true # 是否订阅音频流
      subvideo: true # 是否订阅视频流
      subaudioargname: ats # 订阅音频轨道参数名
      subvideoargname: vts # 订阅视频轨道参数名
      subdataargname: dts # 订阅数据轨道参数名
      subaudiotracks: [] # 订阅音频轨道名称列表
      subvideotracks: [] # 订阅视频轨道名称列表
      submode: 0 # 订阅模式，0为跳帧追赶模式，1为不追赶（多用于录制），2为时光回溯模式
      syncmode: 0 # 音视频同步模式，0 为按照时间戳同步，1 为按照写入时间同步
      iframeonly: false # 只订阅关键帧
      waittimeout: 10s # 等待发布者的超时时间，用于订阅尚未发布的流
      writebuffersize: 0 # 订阅者写缓存大小，用于减少io次数，但可能影响实时性
      key: "" # 订阅者鉴权秘钥
      secretargname: secret # 订阅者鉴权参数名
      expireargname: expire # 订阅者鉴权过期时间参数名
      internal: false # 是否内部订阅，内部订阅不会触发发布者自动断开功能
  enableavcc : true  # 启用AVCC格式缓存，用于rtmp协议
  enablertp : true # 启用rtp格式缓存，用于rtsp、websocket、gb28181协议
  enableauth: true # 启用鉴权,详细查看鉴权机制
  enablesubevent: true # 启用订阅事件，用于订阅者上下线事件,关闭可以提高性能
  rtpreorderbufferlen: 50 # rtp乱序重排缓存长度
  eventbussize: 10 # 事件总线缓存大小，事件较多时容易堵阻塞线程，需要增大缓存
  poolsize: 0 # 内存池大小，高并发需要提高性能可以加大内存池，减少 GC
  pulseinterval: 5s # 心跳事件间隔时间
  console: 
    server : console.monibuca.com:44944 # 连接远程控制台的地址
    secret: "" # 远程控制台的秘钥
    publicaddr: "" # 实例公网地址，提供远程控制台访问的地址，不配置的话使用自动识别的地址
    publicaddrtls: "" # 实例公网地址，提供远程控制台访问的地址，不配置的话使用自动识别的地址（https）
```

## 插件配置

:::tip 插件配置由插件定义
每个插件的具体配置信息请查看插件文档
:::

### 拉流配置

某些插件包含从远端拉流的能力，故具有拉流配置，这些配置的格式都是一致的，如下：

```yaml
某插件:
  pull:
    repull: 10
    proxy: [Proxy URL]
    pullonstart:
      live/test: [URL1]
      live/test2: [URL2]
    pullonsub:
      live/test3: [URL3]
      live/test4: [URL4]
```
- 其中`repull`代表重试的次数，如果设置为`-1`则为无限重试，`0`则是不重试
- `proxy`代表代理地址，如果需要代理拉流，可以配置该项
- `pullonstart`代表随着`m7s`启动，则立即进行拉流
- `pullonstart`是一个键值对映射（map）`key`代表拉流进入`m7s`后的`streamPath`，`value`就是远程流地址。
- `pullonsub`代表的是按需拉流，即`m7s`收到指定流的订阅时才开始拉流。
- `pullonsub`也是一个键值对映射（map）格式同`pullonstart`

### 推流配置
某些插件包含向远端服务器推流的能力，故具有推流配置，这些配置的格式都是一致的，如下：
```yaml
某插件:
  push:
    repush: 10
    pushlist:
      live/test: [URL1]
      live/test2: [URL2]
```
- 其中`repush`代表重试的次数，如果设置为`-1`则为无限重试，`0`则是不重试
- `pushlist`是一个键值对映射（map）`key`代表`streamPath`，`value`就是远程流地址。
- 当`m7s`中一旦出现map中包含的流时，就会推流到远端服务器

## 环境变量覆盖配置

示例：
设置global下的loglevel为debug
```bash
$ export GLOBAL_LOGLEVEL=debug
```
设置record下的flv的fragment为10s
```bash
$ export RECORD_FLV_FRAGMENT=10s
```