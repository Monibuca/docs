# 官方插件介绍

官方插件满足基本的流媒体服务器功能，如果希望定制化开发，可以在此基础上开发自定义插件，官方插件也是自定义插件开发的有力参考。

plugin| Protocol | Pusher（push）-->Monibuca  |Source-->Monibuca（pull）|Monibuca-->Player（pull）|Monibuca（push）-->Other Server
|---------| -------------|-------------| -------------|-------------|--
plugin-rtmp|rtmp|✔||✔|
plugin-rtsp|rtsp|✔|✔||
plugin-hdl|http-flv|||✔|
plugin-hls|hls||✔|✔|
plugin-jessica|ws-flv|||✔|
plugin-webrtc|webrtc|✔||✔
plugin-gb28181|gb28181||✔（invite）|