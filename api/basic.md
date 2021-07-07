# 引擎API

引擎中暴露了一些结构体和方法，供开发插件调用。

## 插件相关

### PluginConfig

 ```go
//PluginConfig 插件配置定义
//PluginConfig 插件配置定义
type PluginConfig struct {
	Name      string                       //插件名称
	Config    interface{}                  //插件配置
	Version   string                       //插件版本
	Run       func()                       //插件启动函数
	HotConfig map[string]func(interface{}) //热修改配置
}
 ```
该结构体用于作为插件启动时传入引擎的参数，见 `InstallPlugin` 函数。
- **Name** 是插件在安装时的唯一标识，建议使用首字母大写的英文单词或者缩写表示。
- **Config** 这个是插件使用的配置信息，是一个自定义结构体对象，插件配置读取后，将会通过反序列化构造出自定义的结构体对象。
- **Run** 是一个函数，在插件配置解析完成后，会调用该函数，也可以不设置。如果在配置文件中找不到对应的插件配置，则不会调用该函数。
- **HotConfig** 是一个 `map` ，键为需要热更新的配置属性，值为一个函数，用于接收新的配置值。

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
		Config:  config,
		Run:     run,
	})
}
```
一般我们会在插件的 `init` 函数中调用该函数，以在第一时间启动插件。在调用过引擎的 `Run` 函数后，再安装插件就会错过插件启动的时机。

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
	logWriter.Store(wn, wn)
}
```
该函数可以给日志输出增加输出渠道，有时候我们需要跟踪日志，就可以用该方法。
如果想要删除添加的输出渠道，只需要让你的输出渠道调用 `Write` 返回错误即可。

## 核心定义

### Stream
V3版本中Publisher和Stream已经合并，不再有Publisher
```go
// Stream 流定义
type Stream struct {
	context.Context `json:"-"`
	StreamPath      string
	Type            string        //流类型，来自发布者
	StartTime       time.Time     //流的创建时间
	Subscribers     []*Subscriber // 订阅者
	VideoTracks     Tracks
	AudioTracks     Tracks
	AutoUnPublish   bool              //	当无人订阅时自动停止发布
	Transcoding     map[string]string //转码配置，key：目标编码，value：发布者提供的编码
	subscribeMutex  sync.Mutex
	timeout         *time.Timer //更新时间用来做超时处理
	Close           func()      `json:"-"`
}
func (r *Stream) Update()
func (r *Stream) Publish() bool
func (r *Stream) WaitVideoTrack(codecs ...string) *VideoTrack
func (r *Stream) WaitAudioTrack(codecs ...string) *AudioTrack
func (r *Stream) Subscribe(s *Subscriber)
func (r *Stream) UnSubscribe(s *Subscriber)
```
- Update函数用来更新这个流的最新更新时间，主要用于超时自动关闭流，这个函数是内部使用的
- Publish函数用来发布流，需要提前设置好流的StreamPath,这个操作本质上只是在集合里面注册了这个流
- WaitVideoTrack和WaitAudioTrack是给订阅者使用的，用来获取到音视频轨道，从而进行播放
- Subscribe函数由订阅者内部调用
- UnSubscribe函数由订阅者内部调用，当订阅者被关闭时调用，用来移除订阅者

示例：
```go{3}
streamPath := nc.appName + "/" + strings.Split(pm.PublishingName, "?")[0]
stream = &engine.Stream{Type: "RTMP", StreamPath: streamPath}
if stream.Publish() {
    absTs := make(map[uint32]uint32)
    vt := stream.NewVideoTrack(0)
    at := stream.NewAudioTrack(0)
    rec_audio = func(msg *Chunk) {
        if msg.ChunkType == 0 {
            absTs[msg.ChunkStreamID] = 0
        }
        if msg.Timestamp == 0xffffff {
            absTs[msg.ChunkStreamID] += msg.ExtendTimestamp
        } else {
            absTs[msg.ChunkStreamID] += msg.Timestamp
        }
        at.PushByteStream(engine.AudioPack{Timestamp: absTs[msg.ChunkStreamID], Payload: msg.Body})
    }
    rec_video = func(msg *Chunk) {
        if msg.ChunkType == 0 {
            absTs[msg.ChunkStreamID] = 0
        }
        if msg.Timestamp == 0xffffff {
            absTs[msg.ChunkStreamID] += msg.ExtendTimestamp
        } else {
            absTs[msg.ChunkStreamID] += msg.Timestamp
        }
        vt.PushByteStream(engine.VideoPack{Timestamp: absTs[msg.ChunkStreamID], Payload: msg.Body})
    }
    err = nc.SendMessage(SEND_STREAM_BEGIN_MESSAGE, nil)
    err = nc.SendMessage(SEND_PUBLISH_START_MESSAGE, newPublishResponseMessageData(nc.streamID, NetStream_Publish_Start, Level_Status))
} else {
    err = nc.SendMessage(SEND_PUBLISH_RESPONSE_MESSAGE, newPublishResponseMessageData(nc.streamID, NetStream_Publish_BadName, Level_Error))
}
```
### Subscriber
```go
// Subscriber 订阅者实体定义
type Subscriber struct {
	context.Context  `json:"-"`
	cancel           context.CancelFunc
	Ctx2             context.Context `json:"-"`
	*Stream          `json:"-"`
	ID               string
	TotalDrop        int //总丢帧
	TotalPacket      int
	Type             string
	BufferLength     int
	Delay            uint32
	SubscribeTime    time.Time
	SubscribeArgs    url.Values
	OnAudio          func(pack AudioPack) `json:"-"`
	OnVideo          func(pack VideoPack) `json:"-"`
	closeOnce        sync.Once
}

// Close 关闭订阅者
func (s *Subscriber) Close()

//Subscribe 开始订阅
func (s *Subscriber) Subscribe(streamPath string) (err error)
func (s *Subscriber) Play(at *AudioTrack, vt *VideoTrack)
func (s *Subscriber) PlayAudio(at *AudioTrack)
func (s *Subscriber) PlayVideo(vt *VideoTrack)
```
- Subscribe函数表示订阅一个流，内部调用Stream的Subscribe函数，功能是向订阅者集合注册自己
- Play函数将组合一对音频和视频轨道进行订阅，含有音视频同步功能
- PlayAudio单独订阅音频轨道
- PlayVideo单独订阅视频轨道
- OnAudio和OnVideo函数是用来接收数据的回调函数，可以实时替换
示例：
```go{5}
subscriber := engine.Subscriber{
    Type:             "RTMP",
    ID:               fmt.Sprintf("%s|%d", conn.RemoteAddr().String(), nc.streamID),
}
if err = subscriber.Subscribe(streamPath); err == nil {
    streams[nc.streamID] = &subscriber
    err = nc.SendMessage(SEND_CHUNK_SIZE_MESSAGE, uint32(nc.writeChunkSize))
    err = nc.SendMessage(SEND_STREAM_IS_RECORDED_MESSAGE, nil)
    err = nc.SendMessage(SEND_STREAM_BEGIN_MESSAGE, nil)
    err = nc.SendMessage(SEND_PLAY_RESPONSE_MESSAGE, newPlayResponseMessageData(nc.streamID, NetStream_Play_Reset, Level_Status))
    err = nc.SendMessage(SEND_PLAY_RESPONSE_MESSAGE, newPlayResponseMessageData(nc.streamID, NetStream_Play_Start, Level_Status))
    vt, at := subscriber.WaitVideoTrack(), subscriber.WaitAudioTrack()
    if vt != nil {
        var lastTimeStamp uint32
        var getDeltaTime func(uint32) uint32
        getDeltaTime = func(ts uint32) (t uint32) {
            lastTimeStamp = ts
            getDeltaTime = func(ts uint32) (t uint32) {
                t = ts - lastTimeStamp
                lastTimeStamp = ts
                return
            }
            return
        }
        err = nc.SendMessage(SEND_FULL_VDIEO_MESSAGE, &AVPack{Payload: vt.ExtraData.Payload})
        subscriber.OnVideo = func(pack engine.VideoPack) {
            err = nc.SendMessage(SEND_FULL_VDIEO_MESSAGE, &AVPack{Timestamp: 0, Payload: pack.Payload})
            subscriber.OnVideo = func(pack engine.VideoPack) {
                err = nc.SendMessage(SEND_VIDEO_MESSAGE, &AVPack{Timestamp: getDeltaTime(pack.Timestamp), Payload: pack.Payload})
            }
        }
    }
    if at != nil {
        var lastTimeStamp uint32
        var getDeltaTime func(uint32) uint32
        getDeltaTime = func(ts uint32) (t uint32) {
            lastTimeStamp = ts
            getDeltaTime = func(ts uint32) (t uint32) {
                t = ts - lastTimeStamp
                lastTimeStamp = ts
                return
            }
            return
        }
        subscriber.OnAudio = func(pack engine.AudioPack) {
            if at.CodecID == 10 {
                err = nc.SendMessage(SEND_FULL_AUDIO_MESSAGE, &AVPack{Payload: at.ExtraData})
            }
            subscriber.OnAudio = func(pack engine.AudioPack) {
                err = nc.SendMessage(SEND_AUDIO_MESSAGE, &AVPack{Timestamp: getDeltaTime(pack.Timestamp), Payload: pack.Payload})
            }
            subscriber.OnAudio(pack)
        }
    }
    go subscriber.Play(at, vt)
}
```
## 钩子

```go
func AddHook(name string, callback func(interface{}))
func AddHookWithContext(ctx context.Context, name string, callback func(interface{}))
func TriggerHook(name string ,payload interface{})
```

- AddHook函数用来注册钩子函数，这个函数会阻塞当前goroutine所以，一般情况需要用go关键字调用
- AddHookWithContext是可以增加一个取消注册的行为
- TriggerHook函数用来触发钩子

## 编码格式

引用路径
```go
import "github.com/Monibuca/engine/avformat"
```

### AVPacket

```go
type BasePack struct {
	Timestamp uint32
	Sequence  int
	*bytes.Buffer
	Payload []byte
}
type AudioPack struct {
	BasePack
	Raw []byte
}
type VideoPack struct {
	BasePack
	CompositionTime uint32
	NALUs           [][]byte
	IDR             bool // 是否关键帧
}
音视频轨道的缓冲环中存储的就是上面的结构体
```
- Timestamp 是发布者提供的时间戳
- Sequence 代表序号
- *bytes.Buffer 用来构建字节流格式的数据
- Payload 存储的是字节流格式的数据，如果有这个数据*bytes.Buffer就为空
- Raw 是去掉了头的数据（AAC为前两个字节，其他格式为一个字节）
- CompositionTime 是PTS-DTS的值
- NALUs 是NALU数组
- IDR 代表是否关键帧

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