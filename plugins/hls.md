# HLS插件

> 该插件依赖github.com/Monibuca/plugin-ts

1. 该插件可用来拉取网络上的m3u8文件并解析后转换成其他协议
2. 该插件可以在服务器写HLS文件，配合nginx等可以提供HLS的服务
3. 配合gateway插件可以直接访问http://localhost:8080/hls/live/user1.m3u8 进行播放，其中8080端口是gateway插件配置的，live/user1是streamPath，需要根据实际情况修改

## API
> 参数是可变的，下面的参数live/hls是作为例子，不是固定的
- /api/hls/list
列出所有HLS流，是一个SSE，可以持续接受到列表数据
- /api/hls/save?streamPath=live/hls
保存指定的流（例如live/hls）为HLS文件（m3u8和ts）当这个请求关闭时就结束保存
- /api/hls/pull?streamPath=live/hls&target=http://localhost/abc.m3u8
将目标HLS流拉过来作为媒体源在monibuca内以live/hls流的形式存在

## 默认配置

```toml
[HLS]
EnableWrite = false
EnableMemory = false
Fragment = 5
Window = 2
Path = "hls"
```
- EnableWrite 用来控制是否启用HLS文件写入功能
- EnableMemory 用来启用内存播放模式，开启后ts数据会保存在内存中
- Fragment 分片大小，单位秒
- Window 窗口，即每个m3u8中包含几个ts
- 如果同时开启写入和内存模式的话，从gateway读取的ts会优先使用内存。

## 使用方法

1. 创建HLS结构体实例
2. 设置该对象的Video.Req和Audio.Req属性（用于请求m3u8文件）没有audio单独的m3u8可不设置Audio.Req属性
3. 调用对象的Publish方法，传入流名称和上级publisher，如果没有就传本对象
4. 使用UI界面，点击拉流转发，可以将一个远程的hls流拉入服务器中，配置StreamPath用于从服务器中播放这个流。

> 如果拉取远程ts文件需要cookie或者http的验证，可以将验证头设置到HLS对象的TsHead属性中。

```go
func demo(){
    p:=new(HLS)
    p.Video.Req = http.NewRequest("GET","http://xxxx.com/demo.m3u8", nil)
    p.Publish("live/hls")
}
```