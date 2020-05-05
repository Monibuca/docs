# 引擎API

引擎中暴露了一些结构体和方法，供开发插件调用。

## 插件相关

### PluginConfig

 ```go
//PluginConfig 插件配置定义
//PluginConfig 插件配置定义
type PluginConfig struct {
	Name      string                       //插件名称
	Type      byte                         //类型
	Config    interface{}                  //插件配置
	UIDir     string                       //界面目录
	Version   string                       //插件版本
	Dir       string                       //插件代码路径
	Run       func()                       //插件启动函数
	HotConfig map[string]func(interface{}) //热修改配置
}
 ```
该结构体用于作为插件启动时传入引擎的参数，见InstallPlugin函数。
- Name 是插件在安装时的唯一标识，建议使用首字母大写的英文单词或者缩写表示。
- Type 插件类型，见插件类型条目
- Config 这个是插件使用的配置信息，是一个自定义结构体对象，插件配置读取后，将会通过反序列化构造出自定义的结构体对象。
- UIDir 指示插件的界面资源的绝对路径，默认值是插件目录下的ui/dist，如果该插件没有UI界面，则不需要设置该值。
- Dir 是指插件安装后的绝对路径，由引擎自动获取，无需配置
- Run 是一个函数，在插件配置解析完成后，会调用该函数，也可以不设置。如果在配置文件中找不到对应的插件配置，则不会调用该函数。
- HotConfig 是一个map，键为需要热更新的配置属性，值为一个函数，用于接收新的配置值。

### InstallPlugin

```go
// InstallPlugin 安装插件
func InstallPlugin(opt *PluginConfig) {
	log.Printf("install plugin %s version: %s", opt.Name, opt.Version)
	Plugins[opt.Name] = opt
}
```
该函数用于安装插件，如果你写的插件不需要被罗列在插件列表中，也没有配置文件，那么就不需要调用该函数。

示例；
```go
func init() {
	InstallPlugin(&PluginConfig{
		Name:    "LogRotate",
		Type:    PLUGIN_HOOK,
		Config:  config,
		Run:     run,
	})
}
```
一般我们会在插件的init函数中调用该函数，以在第一时间启动插件。在调用过引擎的Run函数后，再安装插件就会错过插件启动的时机。

### 插件类型

```go
const (
	PLUGIN_NONE       = 0      //独立插件
	PLUGIN_SUBSCRIBER = 1      //订阅者插件
	PLUGIN_PUBLISHER  = 1 << 1 //发布者插件
	PLUGIN_HOOK       = 1 << 2 //钩子插件
)
```
插件可以同时具备多项功能，因此可以使用或（|）运算符连接多个类型例如
`PLUGIN_PUBLISHER|PLUGIN_SUBSCRIBER`

### Plugins

全局插件集合
```go
// Plugins 所有的插件配置
var Plugins = make(map[string]*PluginConfig)
```
如果需要界面上显示插件配置的信息，可以直接将该集合序列化后传输到浏览器中。

## AddWriter 

```go
// AddWriter 添加日志输出端
func AddWriter(wn io.Writer) {
	log.SetOutput(&LogWriter{
		Writer: wn,
		origin: log.Writer(),
	})
}
```
该函数可以给日志输出增加输出渠道，有时候我们需要跟踪日志，就可以用该方法。
如果想要删除添加的输出渠道，只需要让你的输出渠道调用Write返回错误即可。

## 核心定义

### Publisher

```go
type Publisher struct {
	*Stream
}

func (p *Publisher) Close() {
	if p.Running() {
		p.Cancel()
	}
}

// Running 发布者是否正在发布
func (p *Publisher) Running() bool {
	return p.Stream != nil && p.Err() == nil
}

// Publish 发布者进行发布操作
func (p *Publisher) Publish(streamPath string) bool
```

发布者定义必须包含Publisher，并且以组合继承的方式引入：
```go
type MyPublisher struct{
	Publisher
}
```
由于Publisher也组合继承了Stream结构，所以也将可以直接调用Stream的所有方法。
- Close函数，显式关闭房间，实际上是调用了Stream的Cancel函数
- Running函数，用来检查发布者是否正在发布。
- Publish函数，用来启动发布操作，传入流路径，和发布者本身

```go
// HLS 发布者
type HLS struct {
	TS
	HLSInfo
	TsHead      http.Header     //用于提供cookie等特殊身份的http头
	SaveContext context.Context //用来保存ts文件到服务器
}
```
在HLS的定义中，组合继承了TS，在发布HLS的时候，也需要调用TS的Publish函数，以启动相应的逻辑。
```go
func (p *HLS) Publish(streamName string) (result bool) {
	if result = p.TS.Publish(streamName); result {
		p.Type = "HLS"
		p.HLSInfo.TSInfo = &p.TS.TSInfo
		collection.Store(streamName, p)
		go func(){
			p.run(&p.HLSInfo.Video)
			collection.Delete(streamName)
		}()
		if p.HLSInfo.Audio.Req != nil {
			go p.run(&p.HLSInfo.Audio)
		}
	}
	return
}

```

### Stream

```go
// Stream 流定义
type Stream struct {
	context.Context
	*Publisher
	StreamInfo   //可序列化，供后台查看的数据
	Control      chan interface{}
	Cancel       context.CancelFunc
	Subscribers  map[string]*Subscriber // 订阅者
	VideoTag     *avformat.AVPacket     // 每个视频包都是这样的结构,区别在于Payload的大小.FMS在发送AVC sequence header,需要加上 VideoTags,这个tag 1个字节(8bits)的数据
	AudioTag     *avformat.AVPacket     // 每个音频包都是这样的结构,区别在于Payload的大小.FMS在发送AAC sequence header,需要加上 AudioTags,这个tag 1个字节(8bits)的数据
	FirstScreen  *Ring                  //最近的关键帧位置，首屏渲染
	AVRing       *Ring                  //数据环
	WaitingMutex *sync.RWMutex          //用于订阅和等待发布者
	UseTimestamp bool                   //是否采用数据包中的时间戳
}
func (r *Stream) PushAudio(timestamp uint32, payload []byte)
func (r *Stream) PushVideo(timestamp uint32, payload []byte)
```
- Stream结构体可以用来调用的函数包括：PushAudio、PushVideo，用来把发布者的数据转发到订阅者。
- 调用Stream的Cancel函数可以强制关闭房间。
- Stream的Publisher属性如果nil，表示房间没有发布者，处于等待状态
- 不能直接遍历Subscribers，可能会引起并发冲突。操作Subscribers必须给Stream发送指令。

目前有三种指令，可以传递给Control 通道
```go
// UnSubscribeCmd 取消订阅命令
type UnSubscribeCmd struct {
	*Subscriber
}

// SubscribeCmd 订阅房间命令
type SubscribeCmd struct {
	*Subscriber
}

// ChangeRoomCmd 切换房间命令
type ChangeRoomCmd struct {
	*Subscriber
	NewStream *Stream
}
```

### Subscriber
```go
// Subscriber 订阅者实体定义
type Subscriber struct {
	context.Context
	*Stream
	SubscriberInfo
	OnData     func(*avformat.SendPacket) error
	Cancel     context.CancelFunc
	Sign       string
	OffsetTime uint32
}


func (s *Subscriber) IsClosed() bool {
	return s.Context != nil && s.Err() != nil
}

// Close 关闭订阅者
func (s *Subscriber) Close() {
	if s.Cancel != nil {
		s.Cancel()
	}
}

//Subscribe 开始订阅
func (s *Subscriber) Subscribe(streamPath string) (err error)
```
订阅者结构体，订阅者不同于发布者，不需要额外定义订阅者结构体去组合继承Subscriber。只需要直接使用Subscriber对象即可。
如何实现自定义输出？就是给Subscriber设置OnData函数。
- IsClosed 用来判断订阅者是否已关闭
- Close 用来关闭订阅者
- Subscribe 用来启动订阅行为，这个函数会阻塞当前协程。

## 钩子

```go
//当发布者发布时
type OnPublishHook []func(r *Room)
//当订阅者订阅时
type OnSubscribeHook []func(s *OutputStream)
//当订阅者掉帧时
type OnDropHook []func(s *OutputStream)
//当采集者进行采集或者停止时
type OnSummaryHook []func(bool)
//当房间关闭时（主动退出或者发布者退出）
type OnRoomClosedHook []func(*Room)
```

钩子都有一个方法AddHook用来添加钩子函数

## 编码格式

引用路径
```go
import "github.com/Monibuca/engine/avformat"
```

### AVPacket

```go
type AVPacket struct {
	Timestamp      uint32
	Type           byte //8 audio,9 video
	IsSequence     bool //序列帧
	IsKeyFrame bool//是否为关键帧
	Payload        []byte
	Number         int //编号，audio和video独立编号
}
func (av *AVPacket) VideoFrameType() bool
func NewAVPacket(avType byte) (p *AVPacket)
func (av *AVPacket) Recycle() 
func (av *AVPacket) ADTS2ASC() (tagPacket *AVPacket) 
```
这个是音视频数据的通用结构体
- Timestamp 是发布者提供的时间戳
- Type 代表音频还是视频
- IsSequence 代表是否是AAC或者AVC的Sequence头
- IsADTS 代表AAC头是否使用ADTS格式
- VideoFrameType 代表视频帧类型1为关键帧，2为普通帧
- Payload 音频或者视频的裸数据
- IsKeyFrame 用来判断是否是关键帧
- ADTS2ASC 将AAC的ADTS头转换成AudioSpecificConfig格式

### SendPacket
```go
type SendPacket struct {
	Timestamp uint32
	*AVPacket
}

func (packet *SendPacket) Recycle() {
	packet.Packet.Recycle()
	SendPacketPool.Put(packet)
}
func NewSendPacket(p *AVPacket, timestamp uint32) (result *SendPacket) {
	result = SendPacketPool.Get().(*SendPacket)
	result.AVPacket = p
	result.Timestamp = timestamp
	return
}
```
该结构体用于在不同的协议中传输使用，本质上就是复用了AVPacket，只是不同的订阅者的时间戳不同。所以需要增加一层时间戳。


## 工具类

### SSE

```go
type SSE struct {
	http.ResponseWriter
	context.Context
}
func NewSSE(w http.ResponseWriter, ctx context.Context) *SSE
func (sse *SSE) WriteEvent(event string, data []byte) (err error)
func (sse *SSE) WriteJSON(data interface{}) (err error)
func (sse *SSE) WriteExec(cmd *exec.Cmd) error
```
用于方便的进行提供SSE服务。
- NewSSE 从http的handler函数提供的参数创建SSE辅助对象。
- WriteEvent 发送时间
- WriteJSON 发送json对象
- WriteExec 执行一个cmd，然后将输出结果推送的浏览器

示例：
```go
func summary(w http.ResponseWriter, r *http.Request) {
	sse := NewSSE(w, r.Context())
	Summary.Add()
	defer Summary.Done()
	sse.WriteJSON(&Summary)
	ticker := time.NewTicker(time.Second)
	defer ticker.Stop()
	for {
		select {
		case <-ticker.C:
			if sse.WriteJSON(&Summary) != nil {
				return
			}
		case <-r.Context().Done():
			return
		}
	}
}
```