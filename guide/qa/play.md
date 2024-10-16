# 播放问题
## 播放地址

- m7s中的流都有一个唯一标识就是StreamPath，StreamPath的规则是`[AppName]/[StreamName]`，其中AppName是应用名，StreamName是流名。例如`live/test`，其中`live`是AppName，`test`是StreamName。
- 只有知道了streamPath就可以以任意一种协议来拉流播放。

:::tip 地址拼接规则
在官网首页最下方有地址拼接的交互UI，可以选择具体的协议生成对应的播放地址
:::
通常，播放地址的规则是` [协议]://[Host][:Port]/[插件名]/[StreamPath]`

:::danger [插件名]
其中插件名仅仅针对公用http端口的情况下需要拼接。包括websocket协议即ws-flv和ws-raw
:::

假如host是localhost，streamPath为live/test

则HTTP-FLV协议的地址为
`http://localhost:8080/hdl/live/test.flv`

fmp4协议的地址为
`http://localhost:8080/fmp4/live/test.mp4`

hls协议的地址为
`http://localhost:8080/hls/live/test.m3u8`

ws-flv协议的地址为
`ws://localhost:8080/jessica/live/test.flv`

ws-raw协议的地址为
`ws://localhost:8080/jessica/live/test`

:::danger ws-raw协议
ws-raw协议 为私有协议，只能通过jessibuca播放器播放。
:::

:::warning http端口号
http协议的默认端口号是8080，可以通过全局配置修改，对于包含http配置的插件，可以单独配置端口号。使用单独的端口号则地址中不再需要拼接插件名。例如上面的例子，如果hdl插件单独配置http端口号是8081，则地址为：`http://localhost:8081/live/test.flv`
:::

rtmp播放地址则为
`rtmp://localhost/live/test`

rtsp播放地址则为
`rtsp://localhost/live/test`

:::tip 默认端口号
rtmp的默认端口号是1935，rtsp的默认端口号是554，不配置的情况下就是采用了默认端口号，所以地址可以省略端口号
:::

### webrtc播放地址
:::tip webrtc播放地址
webrtc其实没有所谓的播放地址，而是通过js api来播放的。具体的api可以参考[webrtc播放](/guide/plugins/webrtc.md)
如果自己播放webrtc可以参考MDN：https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API
:::
首先需要完成sdp交换，然后通过建立的webrtc连接来播放。
jessibuca把上述过程简化成一个地址：`webrtc://localhost/live/test` . 实际上是先和服务器建立sdp交换的连接，然后通过这个连接来建立webrtc连接。

## 注意事项
- h265如果通过flv、rtmp格式来播放，则必须使用定制的播放器（如jessibuca）来播放。因为flv和rtmp本身没有定义h265的格式，所以是通过扩展的方式实现的。
