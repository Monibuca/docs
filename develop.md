# 插件开发
## 插件的定义
所谓的插件，没有什么固定的规则，只需要完成`安装`操作即可。插件可以实现任意的功能扩展，最常见的是实现某种传输协议用来推流或者拉流

## 插件的安装(注册)
下面是内置插件jessica的源码，代表了典型的插件安装
```go
package jessicaplugin

import (
	"io/ioutil"
	"log"
	"mime"
	"net/http"
	"path"
	"runtime"
	"strings"

	. "github.com/Monibuca/engine"
)

var config = new(ListenerConfig)
var publicPath string

func init() {
	_, currentFilePath, _, _ := runtime.Caller(0)
	publicPath = path.Join(path.Dir(currentFilePath), "dashboard", "public")
	InstallPlugin(&PluginConfig{
		Name:    "Jessica",
		Type:    PLUGIN_SUBSCRIBER,
		Config:  config,
		UI:      path.Join(path.Dir(currentFilePath), "dashboard", "ui", "plugin-jessica.min.js"),
		Version: "1.0.0",
		Run:     run,
	})
}
func run() {
	log.Printf("server Jessica start at %s", config.ListenAddr)
	http.HandleFunc("/jessibuca/", jessibuca)
	log.Fatal(http.ListenAndServe(config.ListenAddr, http.HandlerFunc(WsHandler)))
}
func jessibuca(w http.ResponseWriter, r *http.Request) {
	filePath := strings.TrimPrefix(r.URL.Path, "/jessibuca")
	if mime := mime.TypeByExtension(path.Ext(filePath)); mime != "" {
		w.Header().Set("Content-Type", mime)
	}
	if f, err := ioutil.ReadFile(publicPath + filePath); err == nil {
		if _, err = w.Write(f); err != nil {
			w.WriteHeader(500)
		}
	} else {
		w.WriteHeader(404)
	}
}

```

### 源码说明

- init会在go项目启动最开始的时候执行，我们需要在引擎Run之前注册我们的插件。
- 注册插件，是调用引擎提供的InstallPlugin函数，传入插件的关键信息。
- 插件的名称Name必须是唯一的，只需要保证在项目中唯一即可。
- 插件的Config属性是一个自定义的结构体，只需要保证配置文件的解析和这个结构体定义一致即可。
- 插件的UI属性是该插件的界面部分，如何开发界面请参阅后面的文档。这个地方是传入UI的js文件的绝对路径。
- 当主程序读取配置文件完成解析后，会调用各个插件的Run函数，上面代码中执行了一个http的端口监听
- jessica插件的界面需要读取一些静态资源，所以利用了Gateway的http服务，我们注册了一个路由。所有插件都可以共用Gateway插件的http服务，但要注意的是路由不可以有冲突。当然插件也可以自己创建http服务，启用不同的端口号。

## 开发插件的UI界面

插件的UI界面采用了模块化方式加载。即，所有的插件均为一个Web Component，Gateway插件提供后台界面的外壳，然后根据插件提供的组件进行加载显示。

::: tip 参考
https://cli.vuejs.org/zh/guide/build-targets.html#web-components-%E7%BB%84%E4%BB%B6
:::

为了能正确的加载插件的UI组件，必须遵守如下规则：
1. 创建一个vue单文件组件作为UI的入口，可以嵌套其他的vue组件调用
2. 如果需要载入iview的css，需要在style标签内写入`@import url("/iview.css");`
3. 必须导出为Web Component，名称必须为plugin-[组件名小写]
例如：下面的npm命令将index.vue导出名为plugin-jessica 的Web Component，导出的文件在npm项目下的ui目录。
```json
"scripts": {
    "build": "vue-cli-service build --dest ui --target wc --name plugin-jessica index.vue"
}
```

## 开发无UI的插件

在注册插件的时候UI属性留空即可

## 开发订阅者插件
所谓订阅者就是用来从流媒体服务器接收音视频流的程序，例如RTMP协议执行play命令后、http-flv请求响应程序、websocket响应程序。内置插件中录制flv程序也是一个特殊的订阅者。
下面是http-flv插件的源码，供参考
```go
package HDL

import (
	. "github.com/Monibuca/engine"
	"github.com/Monibuca/engine/avformat"
	"github.com/Monibuca/engine/pool"
	"log"
	"net/http"
	"strings"
)

var config = new(ListenerConfig)

func init() {
	InstallPlugin(&PluginConfig{
		Name:   "HDL",
		Type:   PLUGIN_SUBSCRIBER,
		Config: config,
		Version:"1.0.0",
		Run:    run,
	})
}

func run() {
	log.Printf("HDL start at %s", config.ListenAddr)
	log.Fatal(http.ListenAndServe(config.ListenAddr, http.HandlerFunc(HDLHandler)))
}

func HDLHandler(w http.ResponseWriter, r *http.Request) {
	sign := r.URL.Query().Get("sign")
	if err := AuthHooks.Trigger(sign); err != nil {
		w.WriteHeader(403)
		return
	}
	stringPath := strings.TrimLeft(r.RequestURI, "/")
	if strings.HasSuffix(stringPath, ".flv") {
		stringPath = strings.TrimRight(stringPath, ".flv")
	}
	if _, ok := AllRoom.Load(stringPath); ok {
		//atomic.AddInt32(&hdlId, 1)
		w.Header().Set("Transfer-Encoding", "chunked")
		w.Header().Set("Content-Type", "video/x-flv")
		w.Write(avformat.FLVHeader)
		p := OutputStream{
			Sign: sign,
			SendHandler: func(packet *pool.SendPacket) error {
				return avformat.WriteFLVTag(w, packet)
			},
			SubscriberInfo: SubscriberInfo{
				ID: r.RemoteAddr, Type: "FLV",
			},
		}
		p.Play(stringPath)
	} else {
		w.WriteHeader(404)
	}
}
```
其中，核心逻辑就是创建OutputStream对象，每一个订阅者需要提供SendHandler函数，用来接收来自发布者广播出来的音视频数据。
最后调用该对象的Play函数进行播放。请注意：Play函数会阻塞当前goroutine。

## 开发发布者插件

所谓发布者，就是提供音视频数据的程序，例如接收来自OBS、ffmpeg的推流的程序。内置插件中，集群功能里面有一个特殊的发布者，它接收来自源服务器的音视频数据，然后在本服务器中广播音视频。
以此为例，我们需要提供一个结构体定义来表示特定的发布者：
```go
type Receiver struct {
	InputStream
	io.Reader
	*bufio.Writer
}
```
其中InputStream 是固定的，必须包含，且必须以组合继承的方式定义。其余的成员则是任意的。
发布者的发布动作需要特定条件的触发，例如在集群插件中，当本服务器有订阅者订阅了某个流，而该流并没有发布者的时候就会触发向源服务器拉流的函数：
```go
func PullUpStream(streamPath string) {
	addr, err := net.ResolveTCPAddr("tcp", config.Master)
	if MayBeError(err) {
		return
	}
	conn, err := net.DialTCP("tcp", nil, addr)
	if MayBeError(err) {
		return
	}
	brw := bufio.NewReadWriter(bufio.NewReader(conn), bufio.NewWriter(conn))
	p := &Receiver{
		Reader: conn,
		Writer: brw.Writer,
	}
	if p.Publish(streamPath, p) {
		p.WriteByte(MSG_SUBSCRIBE)
		p.WriteString(streamPath)
		p.WriteByte(0)
		p.Flush()
		for _, v := range p.Subscribers {
			p.Auth(v)
		}
	} else {
		return
	}
	defer p.Cancel()
	for {
		cmd, err := brw.ReadByte()
		if MayBeError(err) {
			return
		}
		switch cmd {
		case MSG_AUDIO:
			if audio, err := p.readAVPacket(avformat.FLV_TAG_TYPE_AUDIO); err == nil {
				p.PushAudio(audio)
			}
		case MSG_VIDEO:
			if video, err := p.readAVPacket(avformat.FLV_TAG_TYPE_VIDEO); err == nil && len(video.Payload) > 2 {
				tmp := video.Payload[0]         // 第一个字节保存着视频的相关信息.
				video.VideoFrameType = tmp >> 4 // 帧类型 4Bit, H264一般为1或者2
				p.PushVideo(video)
			}
		case MSG_AUTH:
			cmd, err = brw.ReadByte()
			if MayBeError(err) {
				return
			}
			bytes, err := brw.ReadBytes(0)
			if MayBeError(err) {
				return
			}
			subId := strings.Split(string(bytes[0:len(bytes)-1]), ",")[0]
			if v, ok := p.Subscribers[subId]; ok {
				if cmd != 1 {
					v.Cancel()
				}
			}
		}
	}
}

```
正在该函数中会向源服务器建立tcp连接，然后发送特定命令表示需要拉流，当我们接收到源服务器的数据的时候，就调用PushVideo和PushAudio函数来广播音视频。

核心逻辑是调用InputStream的Publish以及PushVideo、PushAudio函数

## 开发钩子插件

钩子插件就是在服务器的关键逻辑处插入的函数调用，方便扩展服务器的功能，比如对连接进行验证，或者触发一些特殊的发布者。
目前提供的钩子包括
- 当发布者开始发布时 `OnPublishHooks.AddHook(onPublish)`
例如：
```go
func onPublish(r *Room) {
	for _, v := range r.Subscribers {
		if err := CheckSign(v.Sign); err != nil {
			v.Cancel()
		}
	}
}
```
此时可以访问房间里面的订阅者，对其进行验证。
- 当有订阅者订阅了某个流时，`OnSubscribeHooks.AddHook(onSubscribe)`
例如：
```go
func onSubscribe(s *OutputStream) {
	if s.Publisher == nil {
		go PullUpStream(s.StreamPath)
	}
}

```
拉取源服务器的流

