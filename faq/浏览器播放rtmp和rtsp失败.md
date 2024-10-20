# 浏览器播放 rtmp 和 rtsp 失败

浏览器不能直接播放 rtmp、rtsp 等基于 tcp 的协议，因为在 js 的环境中，无法直接使用 tcp 或者 udp 传数据（js 没提供接口），而 rtsp 或 rtmp 的流是基于 tcp 或者 udp， 所以纯 web 的方式目前是没办法直接播放 rtsp 或 rtmp 流的
