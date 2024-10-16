_[English](https://github.com/Monibuca/plugin-ps/blob/v4/README.en.md) | 简体中文_
# PS 插件

支持接收MpegPS流

## 插件地址

https://github.com/Monibuca/plugin-ps

## 插件引入
```go
    import (  _ "m7s.live/plugin/ps/v4" )
```

## 默认配置

```yaml
ps:
  http: # 格式参考全局配置
  publish: # 格式参考全局配置
  subscribe: # 格式参考全局配置
  relaymode: 1 # 0:纯转发 1:转协议，不转发 2:转发并且转协议
```

## API

### 接收PS流
`/ps/api/receive?streamPath=xxx&ssrc=xxx&port=xxx&reuse=1&dump=xxx`
其中：
- reuse代表是否端口复用，如果使用端口复用，请务必确定设备发送的ssrc和ssrc参数一致，否则会出现混流的情况
- dump代表是否dump到文件，如果dump到文件，会在当前目录下生成一个以dump为名的文件夹，文件夹下面是以streamPath参数值为名的文件，文件内容从端口收到的数据[4byte 内容长度][2byte 相对时间][内容]
### 回放PS的dump文件

`/ps/api/replay?streamPath=xxx&dump=xxx`
- dump 代表需要回放的文件，默认是dump/ps
- streamPath 代表回放时生成的视频流的streamPath, 默认是replay/dump/ps (如果dump传了abc, 那么streamPath默认是replay/abc)

### 以ws协议读取PS流

`ws://[host]/ps/[streamPath]`

例如： ws://localhost:8080/ps/live/test

数据包含的是裸的PS数据，不包含rtp头