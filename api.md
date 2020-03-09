# 引擎API

引擎中暴露了一些结构体和方法，供开发插件调用。

## 插件相关

### PluginConfig

 ```go
//PluginConfig 插件配置定义
type PluginConfig struct {
	Name    string      //插件名称
	Type    byte        //类型
	Config  interface{} //插件配置
	UI      string      //界面路径
	Version string      //插件版本
	Run     func()      //插件启动函数
}
 ```
该结构体用于作为插件启动时传入引擎的参数，见InstallPlugin函数。
- Name 是插件在安装时的唯一标识，建议使用首字母大写的英文单词或者缩写表示。
- Type 插件类型，见插件类型条目
- Config 这个是插件使用的配置信息，是一个自定义结构体对象，插件配置读取后，将会通过反序列化构造出自定义的结构体对象。
- UI 指示插件的界面代码的绝对路径，可以使用engine提供的CurrentDir函数构造出插件包所在目录拼接的绝对路径。如果该插件没有UI界面，则不需要设置该值。
- Verison 是插件版本信息。
- Run 是一个函数，在插件配置解析完成后，会调用该函数，也可以不设置。如果在配置文件中找不到对应的插件配置，则不会调用该函数。

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
		Version: "1.0.0",
		UI:      CurrentDir("dashboard", "ui", "plugin-logrotate.min.js"),
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
type Publisher interface {
	OnClosed()
}
```
发布者的接口定义，只需要实现OnClosed函数，这个函数的目的是在房间被关闭的时候通知发布者做一些清理工作，比如关闭连接等。由于发布者都是组合继承自InputStream，因此即使没有显示定义OnClosed也会间接实现Publisher接口。

### InputStream

```go
type InputStream struct {
	*Room
}

func (p *InputStream) Close() {
	if p.Running() {
		p.Cancel()
	}
}

// Running 发布者是否正在发布
func (p *InputStream) Running() bool {
	return p.Room != nil && p.Err() == nil
}

// OnClosed 发布者关闭事件，用于回收资源
func (p *InputStream) OnClosed() {
}

// Publish 发布者进行发布操作
func (p *InputStream) Publish(streamPath string, publisher Publisher) bool
```

发布者定义必须包含InputStream，并且以组合继承的方式引入：
```go
type MyPublisher struct{
	InputStream
}
```
由于InputStream也组合继承了Room结构，所以也将可以直接调用Room的所有方法。
- Close函数，显式关闭房间，实际上是调用了Room的Cancel函数
- Running函数，用来检查发布者是否正在发布。
- Publish函数，用来启动发布操作，传入流路径，和发布者本身

问：为什么要传入发布者本身？
答：目的是为了调用发布者的OnClosed函数,由于发布者可能有多个层级关系，为了能通知到最顶层的发布者，所以需要将起传入，这个方式也是因为Go语言没有继承和泛型，所以只能通过这种方式实现。
典型的使用场景：HLS发布者和TS发布者，是一个嵌套关系。
```go
// HLS 发布者
type HLS struct {
	TS
	HLSInfo
	TsHead      http.Header     //用于提供cookie等特殊身份的http头
	SaveContext context.Context //用来保存ts文件到服务器
}
```
在HLS的定义中，组合继承了TS，在发布HLS的时候，也需要调用TS的Publish函数，以启动相应的逻辑。那么为了能通知到HLS的OnClosed，就必须将最上层的Publisher引用传入Publish函数中。
HLS可能也不是最顶层的发布者，所以也需要做一个传递。如果没有上一层发布者，可以传入自己的指针。
```go
func (p *HLS) Publish(streamName string, publisher Publisher) (result bool) {
	if result = p.TS.Publish(streamName, publisher); result {
		p.HLSInfo.TSInfo = &p.TS.TSInfo
		collection.Store(streamName, p)
		go p.run(&p.HLSInfo.Video)
		if p.HLSInfo.Audio.Req != nil {
			go p.run(&p.HLSInfo.Audio)
		}
	}
	return
}
```

相应的在HLS的OnClosed函数中就需要调用下一层的OnClosed函数，逐级释放资源
```go
func (p *HLS) OnClosed() {
	p.TS.OnClosed()
	collection.Delete(p.StreamPath)
}
```

:::tip
如果您想到了更好的实现方法，欢迎提供思路，谢谢。 
:::

### Room

```go
type Room struct {
	context.Context
	Publisher
	RoomInfo
	Control      chan interface{}
	Cancel       context.CancelFunc
	Subscribers  map[string]*OutputStream // 订阅者
	VideoTag     *avformat.AVPacket       // 每个视频包都是这样的结构,区别在于Payload的大小.FMS在发送AVC sequence header,需要加上 VideoTags,这个tag 1个字节(8bits)的数据
	AudioTag     *avformat.AVPacket       // 每个音频包都是这样的结构,区别在于Payload的大小.FMS在发送AAC sequence header,需要加上 AudioTags,这个tag 1个字节(8bits)的数据
	FirstScreen  []*avformat.AVPacket
	AudioChan    chan *avformat.AVPacket
	VideoChan    chan *avformat.AVPacket
	UseTimestamp bool //是否采用数据包中的时间戳
}
func (r *Room) PushAudio(audio *avformat.AVPacket)
func (r *Room) PushVideo(audio *avformat.AVPacket)
```
- Room结构体可以用来调用的函数包括：PushAudio、PushVideo，用来把发布者的数据转发到订阅者。
- 调用Room的Cancel函数可以强制关闭房间。
- Room的Publisher属性如果nil，表示房间没有发布者，处于等待状态
- 不能直接遍历Subscribers，可能会引起并发冲突。操作Subscribers必须给Room发送指令。

目前有三种指令，可以传递给Control 通道
```go
// UnSubscribeCmd 取消订阅命令
type UnSubscribeCmd struct {
	*OutputStream
}

// SubscribeCmd 订阅房间命令
type SubscribeCmd struct {
	*OutputStream
}

// ChangeRoomCmd 切换房间命令
type ChangeRoomCmd struct {
	*OutputStream
	NewRoom *Room
}
```
### AllRoom
```go
var AllRoom   = Collection{}
// Collection 对sync.Map的包装
type Collection struct {
	sync.Map
}
```
所有房间的集合，可以直接访问的同步map，方便获取所有房间的信息，用来做监控之用。

### OutputStream
```go
type OutputStream struct {
	context.Context
	*Room
	SubscriberInfo
	SendHandler      func(*avformat.SendPacket) error
	Cancel           context.CancelFunc
	Sign             string
	VTSent           bool
	ATSent           bool
	VSentTime        uint32
	ASentTime        uint32
	packetQueue      chan *avformat.SendPacket
	dropCount        int
	OffsetTime       uint32
	firstScreenIndex int
}

func (s *OutputStream) IsClosed() bool {
	return s.Context != nil && s.Err() != nil
}

// Close 关闭订阅者
func (s *OutputStream) Close() {
	if s.Cancel != nil {
		s.Cancel()
	}
}

//Play 开始订阅
func (s *OutputStream) Play(streamPath string) (err error)
```
订阅者结构体，订阅者不同于发布者，不需要额外定义订阅者结构体去组合继承OutputStream。只需要直接使用OutputStream对象即可。
如何实现自定义输出？就是给OutputStream设置SendHandler函数。
- IsClosed 用来判断订阅者是否已关闭
- Close 用来关闭订阅者
- Play 用来启动订阅行为，这个函数会阻塞当前协程。

## 编码格式



## 工具类

### SSE

### CurrentDir