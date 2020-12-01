# 插件开发
## 插件的定义
所谓的插件，没有什么固定的规则，只需要完成安装操作即可。**插件可以实现任意的功能扩展，最常见的是实现某种传输协议用来推流或者拉流。**

## 插件的安装(注册)
下面是内置插件 `jessica` 的源码，代表了典型的插件安装。
```go
package jessica

import (
	"io/ioutil"
	"log"
	"mime"
	"net/http"
	"path"
	"path/filepath"
	"strings"

	. "github.com/Monibuca/engine/v2"
	. "github.com/logrusorgru/aurora"
)

var config = new(ListenerConfig)
var publicPath string

func init() {
	plugin := &PluginConfig{
		Name:   "Jessica",
		Type:   PLUGIN_SUBSCRIBER,
		Config: config,
		Run:    run,
	}
	InstallPlugin(plugin)
	publicPath = filepath.Join(plugin.Dir, "ui", "public")
}
func run() {
	Print(Green("server Jessica start at"), BrightBlue(config.ListenAddr))
	http.HandleFunc("/jessibuca/", jessibuca)
	log.Fatal(http.ListenAndServe(config.ListenAddr, http.HandlerFunc(WsHandler)))
}
func jessibuca(w http.ResponseWriter, r *http.Request) {
	filePath := strings.TrimPrefix(r.URL.Path, "/jessibuca")
	if mime := mime.TypeByExtension(path.Ext(filePath)); mime != "" {
		w.Header().Set("Content-Type", mime)
	}
	if f, err := ioutil.ReadFile(filepath.Join(publicPath, filePath)); err == nil {
		if _, err = w.Write(f); err != nil {
			w.WriteHeader(500)
		}
	} else {
		w.WriteHeader(404)
	}
}


```

### 源码说明

- `init` 会在 `go` 项目启动最开始的时候执行，我们需要在引擎 `Run` 之前注册我们的插件。
- 注册插件，是调用引擎提供的 `InstallPlugin` 函数，传入插件的关键信息。
- 插件的名称 `Name` 必须是唯一的，只需要保证在项目中唯一即可。
- 插件的 `Config` 属性是一个自定义的结构体，只需要保证配置文件的解析和这个结构体定义一致即可。
- 当主程序读取配置文件完成解析后，会调用各个插件的Run函数，上面代码中执行了一个 `http` 的端口监听
- `jessica` 插件的界面需要读取一些静态资源，所以利用了 `Gateway` 的 `http` 服务，我们注册了一个路由。所有插件都可以共用 `Gateway` 插件的 `http` 服务，但要注意的是路由不可以有冲突。当然插件也可以自己创建 `http` 服务，启用不同的端口号。

## 开发插件的UI界面

步骤：
1. 创建 `ui` 目录用于存放 `ui` 的源码和编译出的文件
2. 创建 `ui/src/App.vue` 作为 `UI` 界面的入口
3. 编译为 `vue lib` 名称必须为 plugin-[组件名小写] 供 `gateway` 调用

例如：下面的 `npm` 命令将 `ui/src/App.vue` 导出名为 `plugin-jessica` 的 `Vue lib` ，导出的文件在项目下的 `ui/dist` 目录。
```json
"scripts": {
    "build": "vue-cli-service build --target lib --name plugin-jessica"
}
```

组件的 `Props` 中可以配置插件配置项用于接收插件的配置信息
例如：
```javascript
props: {
    ListenAddr: String
}
```

`Gateway` 插件中提供的公共组件均可以使用，例如 `stream-table` ，可供展示所有的流信息
```html
<stream-table>
	<template v-slot="scope">
		<m-button @click="preview(scope)">预览</m-button>
	<template>
</stream-table>
```
该组件有一个默认的作用域槽，可以用来扩展对每一个流的操作

`Gateway` 插件中提供的 `Vuex` 对象，所有插件均可访问
```javascript
export default new Vuex.Store({
    state: {
        plugins: [],
        Address: location.hostname,
        NetWork: [],
        Streams: [],
        Memory: {
            Used: 0,
            Usage: 0
        },
        CPUUsage: 0,
        HardDisk: {
            Used: 0,
            Usage: 0
        },
        Children: {},
        engineInfo: {},
    },
    mutations: {
        update(state, payload) {
            Object.assign(state, payload)
        },
    },
    actions: {
        fetchEngineInfo({ commit }) {
            return window.ajax.getJSON(apiHost + "/api/sysInfo").then(engineInfo => commit("update", { engineInfo }))
        },
        fetchPlugins({ commit }) {
            return window.ajax.getJSON(apiHost + "/api/plugins").then(plugins => {
                plugins.sort((a, b) => a.Name > b.Name ? 1 : -1)
                commit("update", { plugins })
                return plugins
            })
        },
        fetchSummary({ commit }) {
            summaryES = new EventSource(apiHost + "/api/summary");
            summaryES.onmessage = evt => {
                if (!evt.data) return;
                let summary = JSON.parse(evt.data);
                summary.Address = location.hostname;
                if (!summary.Streams) summary.Streams = [];
                summary.Streams.sort((a, b) =>
                    a.StreamPath > b.StreamPath ? 1 : -1
                );
                commit("update", summary)
            };
        },
    },
})
```

## 开发无UI的插件

默认就是无 `UI` 的插件

## 开发订阅者插件
所谓订阅者就是用来从流媒体服务器接收音视频流的程序，例如 `RTMP` 协议执行 `play` 命令后、 `http-flv` 请求响应程序、 `websocket` 响应程序。内置插件中录制 `flv` 程序也是一个特殊的订阅者。
下面是 `http-flv` 插件的源码，供参考
```go
package hdl

import (
	"log"
	"net/http"
	"strings"

	. "github.com/Monibuca/engine/v2"
	"github.com/Monibuca/engine/v2/avformat"
	. "github.com/logrusorgru/aurora"
)

var config = new(ListenerConfig)

func init() {
	InstallPlugin(&PluginConfig{
		Name:   "HDL",
		Type:   PLUGIN_SUBSCRIBER,
		Config: config,
		Run:    run,
	})
}

func run() {
	Print(Green("HDL start at "), BrightBlue(config.ListenAddr))
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
	if s := FindStream(stringPath); s != nil {
		//atomic.AddInt32(&hdlId, 1)
		w.Header().Set("Transfer-Encoding", "chunked")
		w.Header().Set("Content-Type", "video/x-flv")
		w.Write(avformat.FLVHeader)
		p := Subscriber{
			Sign: sign,
			OnData: func(packet *avformat.SendPacket) error {
				return avformat.WriteFLVTag(w, packet)
			},
			SubscriberInfo: SubscriberInfo{
				ID: r.RemoteAddr, Type: "FLV",
			},
		}
		p.Subscribe(stringPath)
	} else {
		w.WriteHeader(404)
	}
}

```
其中，核心逻辑就是创建 `Subscriber` 对象，每一个订阅者需要提供 `OnData` 函数，用来接收来自发布者广播出来的音视频数据。
最后调用该对象的 `Subscribe` 函数进行播放。请注意： `Subscribe` 函数会阻塞当前 `goroutine` 。

## 开发发布者插件

所谓发布者，就是提供音视频数据的程序，例如接收来自 `OBS` 、 `ffmpeg` 的推流的程序。内置插件中，集群功能里面有一个特殊的发布者，它接收来自源服务器的音视频数据，然后在本服务器中广播音视频。
以此为例，我们需要提供一个结构体定义来表示特定的发布者：
```go
type Receiver struct {
	Publisher
	io.Reader
	*bufio.Writer
}
```
其中 `Publisher` 是固定的，必须包含，且必须以组合继承的方式定义。其余的成员则是任意的。
发布者的发布动作需要特定条件的触发，例如在集群插件中，当本服务器有订阅者订阅了某个流，而该流并没有发布者的时候就会触发向源服务器拉流的函数：
```go
func PullUpStream(streamPath string) {
	addr, err := net.ResolveTCPAddr("tcp", config.OriginServer)
	if MayBeError(err) {
		return
	}
	conn, err := net.DialTCP("tcp", nil, addr)
	if MayBeError(err) {
		return
	}
	brw := bufio.NewReadWriter(bufio.NewReader(conn), bufio.NewWriter(conn))
	p := &Receiver{
		Reader: brw.Reader,
		Writer: brw.Writer,
	}
	if p.Publish(streamPath) {
		p.Type = "Cluster"
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
	for cmd, err := brw.ReadByte(); !MayBeError(err); cmd, err = brw.ReadByte() {
		switch cmd {
		case MSG_AUDIO:
			if t, payload, err := p.readAVPacket(avformat.FLV_TAG_TYPE_AUDIO); err == nil {
				p.PushAudio(t, payload)
			}
		case MSG_VIDEO:
			if t, payload, err := p.readAVPacket(avformat.FLV_TAG_TYPE_VIDEO); err == nil && len(payload) > 2 {
				p.PushVideo(t, payload)
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
		default:
			log.Printf("unknown cmd:%v", cmd)
		}
	}
}


```
正在该函数中会向源服务器建立 `tcp` 连接，然后发送特定命令表示需要拉流，当我们接收到源服务器的数据的时候，就调用 `PushVideo` 和 `PushAudio` 函数来广播音视频。

核心逻辑是调用 `Publisher` 的 `Publish` 以及 `PushVideo` 、 `PushAudio` 函数

## 开发钩子插件

钩子插件就是在服务器的关键逻辑处插入的函数调用，方便扩展服务器的功能，比如对连接进行验证，或者触发一些特殊的发布者。
目前提供的钩子包括
- 当发布者开始发布时 `OnPublishHooks.AddHook(onPublish)`
例如：
```go
func onPublish(r *Stream) {
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
func onSubscribe(s *Subscriber) {
	if s.Publisher == nil {
		go PullUpStream(s.StreamPath)
	}
}

```
拉取源服务器的流