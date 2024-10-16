# Room 插件

可以用于视频会议等，多人实时视频场景

## 插件地址

https://github.com/Monibuca/plugin-room

## 插件引入

```go
    import (  _ "m7s.live/plugin/room/v4" )
```

## 配置

默认配置如下：

```yaml
room:
  subscribe: # 房间作为特殊流，只订阅data track用于传输信令
    subaudio: false # 默认不订阅音频
    subvideo: false # 默认不订阅视频
  http: # 默认使用全局http配置
    listenaddr: :8080
    listenaddrtls: ""
    certfile: ""
    keyfile: ""
    cors: true
    username: ""
    password: ""
  appname: room # 房间用于广播数据的流的AppName（StreamPath=AppName/RoomID）
  size: 20 # 房间大小（最大人数）
  private: {} # 私密房间配置，key是房间ID，value是密码
  verify: # 入房验证远程请求
    url: ""
    method: ""
    header: {}
```

## 插件使用方式

通过WebSocket建立与本插件的连接，规则如下：
- `ws://localhost:8080/room/[roomID]/[userID]` 建立连接,如果是私密房间，需要携带密码（?password=xxx)
- 连接建立后，客户端接收到`{"data":{"token":"4f8990a1-e7ae-4926-81b0-a3ab191c8e3b","userList":[]},"event":"joined"}`代表进房成功，token用于发布流时的参数
   - 当有用户进房，客户端会收到`{"data":{"ID":"xxx","StreamPath":"xxx"},"event":"userjoin"}`用户进房通知，data是用户信息
   - 当有用户离房，客户端会收到`{"userId":xxx,"event":"userleave"}`用户离房通知,userId代表离房的用户ID
   - 当有用户发布流的时候，房间内其他人会收到事件：`{"data":"[streamPath]","event":"publish","userId":"dexter"}`,用户可以选择订阅这个流
- 进房后，可以通过WebSocket发送任意文本数据，该数据会被广播到房间内的其他用户(包括自己)，格式：`{"data":"abc","event":"msg","userId":"dexter"}`
- 在房间里面可以发布视频流，发布流的时候需要在StreamPath后面携带参数token。