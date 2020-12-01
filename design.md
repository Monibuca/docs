# Monibuca设计原理

## 如何实现可扩展——插件化
许多 `IDE` 和编辑器都依靠插件化技术得以拓展其功能，并形成其生态，例如 `vs` 、 `vs code` 、 `eclipse` 、 `jetbrains` 系列，当然 `vue` 作为一个前端框架也是设计了很不错的插件机制。这些都可以作为借鉴。

要实现流媒体服务器的插件化，就需要把核心功能和拓展功能分离，进行足够的抽象。

### 三大抽象概念
1. 发布者（Publisher）
2. 订阅者（Subscriber）
3. 流（Stream）

#### 发布者（Publisher）
发布者本质上就是输入流，其抽象行为就是将音频和视频数据压入 **Stream** 中，换句话说，就是在恰当的时候调用 **Stream** 的 `PushVideo` 和 `PushAudio` 函数
::: tip 源码位置
发布者定义位于 `publisher.go` 中
:::
在发布者的定义中有一个 **Publisher** 的结构体，用来和 **Stream** 进行互操作。
所有具体的发布者都应该包含这个 **Publisher** ，以组合继承的方式成为发布者。
该 **Publisher** 包含最核心功能就是 `Publish` 函数，这个函数的功能就是在 **Stream** 里面设置发布者是自己，这个行为就是发布。形象的理解就是主播走进了 **Stream** 。
引擎不关心是谁走进了 **Stream** ，也不关心进来的人会发布什么内容。
::: tip 发布者插件
所有实现了发布者具体功能的插件，就是发布者插件，这样一来，流媒体的媒体源可以是任意的形式，比如 `RTMP` 协议提供的推流，可以由 `FFMPEG` 、 `OBS` 发布。也可以是读取本地磁盘上的媒体文件，也可以来自源服务器的私有协议传输的内容。
:::
#### 订阅者（Subscriber）
~~订阅者就是输出流，其抽象行为就是被动接收来自 **Stream** 的音频和视频数据。~~

::: tip 源码位置
订阅者定义位于 `subscriber.go` 中
:::
订阅者的核心逻辑是读取 **Stream** 中的音视频数据，
然后调用 `OnData` 将打包好的音视频数据发送到具体的订阅者那里。
::: tip 订阅者插件
订阅者插件，本质上就是 `OnData` 函数。具体可以将打包的数据以何种协议输出，还是写入文件，由插件实现。
:::

#### Stream
**Stream** 就是一个连接发布者和订阅者的地方。可以形象的理解为主播的房间，发布者是主播，订阅者就是粉丝观众。 **Stream** 是引擎的核心，其重要逻辑包括：
1. **Stream** 的创建、查询、关闭
2. 订阅者的加入和移除
3. 发布者的进入和离开。
::: tip 源码位置
订阅者定义位于 `stream.go` 中
:::

流媒体服务器的核心是 **转发** 二字。当你去研究一款流媒体服务器的时候，会有海量的代码阻碍你看清其核心逻辑。包括：

1. 多媒体格式定义、解析，如 `Flv` 、 `MP4` 、 `MP3` 、 `H264` 、 `AAC` 等等
2. 传输协议的解析，如 `RTMP` 家族、 `AMF` 、 `HTTP` 、 `RTSP` 、 `HLS` 、 `WebSocket` 等等
3. 各种工具类，用来读取字节的缓冲、大小端转换、加解密算法、等等

大部分流媒体服务器都是基于 `rtmp` 协议之上扩展而来，这是历史原因造成的，所以功能不能很好的分离，耦合度很高。往往牵一发而动全身。其实所谓的流媒体服务器本质上就是把发布者的数据经过服务器转发到订阅者手里播放，起一个中转作用。至于什么协议格式，什么媒体格式都是属于扩展功能。所以最轻量的服务器应该不包含任何协议格式，任何媒体格式，仅仅只是完成中转。**再说的直白一点核心代码就是一个 for 循环。**
其他都是围绕这个 `for` 循环展开。所有的流媒体服务器代码里面都有这个 `for` 循环，写法稍有不同，但本质相同。

`2.0` 起转发逻辑已经修改为订阅者自取模式，采用读写锁和 `RingBuffer` 来实现边写边读。

## 核心逻辑1.0（不再维护）
<graphviz :value='`digraph G {
    "publisher"->"PushVideo()"
    subgraph cluster_room{
        label = "room"
        "PushVideo()" -> VideoChan
    }
    subgraph cluster_sub1{
        label = "subscriber1"
        packageQueue1[label="packageQueue"]
        sendVideo1[label="sendVideo()"]
        SendHandler1[label="SendHandler()"]
        sendVideo1->packageQueue1->SendHandler1
    }
    subgraph cluster_sub2{
        label = "subscriber2"
        packageQueue2[label="packageQueue"]
        sendVideo2[label="sendVideo()"]
        SendHandler2[label="SendHandler()"]
        sendVideo2->packageQueue2->SendHandler2
    }
    subgraph cluster_sub3{
        label = "subscriber3"
        packageQueue3[label="packageQueue"]
        sendVideo3[label="sendVideo()"]
        SendHandler3[label="SendHandler()"]
        sendVideo3->packageQueue3->SendHandler3
    }
    VideoChan -> sendVideo1
    VideoChan -> sendVideo2
    VideoChan -> sendVideo3
}
`'/>

## 核心逻辑2.0
![图片](pic.png)

使用读写锁以后，不再需要 `for` 循环 `push` ，当发布者写完一帧后，释放锁后，订阅者就会自己读取该帧的数据。

## 如何实现高性能
流媒体服务器对性能要求极为苛刻。因为流媒体服务器属于高速系统，会有并发的长连接请求，协议封包解包和音视频格式的编解码都消耗着 `CPU` 以及内存，如何尽可能的减少消耗是必须考虑的问题。

### 内存使用
池化是一个不错的选择，所以尽量池化，在 **Monibuca** 中对 `[]byte` 类型，采用了[github.com/funny/slab](https://github.com/funny/slab)包来管理。其他结构体就用系统自带的 `pool` 包来池化对象。
核心转发逻辑采用 `RingBuffer` 的模式，可以重复循环利用音视频包对象，比对象池更减少资源消耗。

### 协程的使用
`golang` 自带的 `goroutine` 可以有效的减少线程的使用，并可以支持各种异步并发的情况。合理的创建 `goroutine` 很重要，这样才能尽可能高效利用 `CPU` 时间。
在 **Monibuca** 中，创建 `goroutine` 在如下场景中：
1. 通讯协议建立的长连接对于一个 `goroutine`
2. 每个 **Stream** 拥有一个 `goroutine` 用于接收指令和关闭退出
3. 每一个插件会使用一个 `goroutine` 来执行插件的 `Run` 函数

由于引擎本身比较轻量化，更多的性能的优化需要插件提供者自由发挥了。

## 界面的模块化

为了方便访问每一个插件的界面，我们需要将所有插件的自定义的界面集中在一起显示。
我们需要实现一下功能：
1. 在主界面中可以动态加载插件的界面，并实现切换
2. 可以将参数传入插件界面中。
3. 显示插件界面要快速流畅。

目前采用每个插件自己编译 `vue` 组件为 `lib` 的方式实现。主界面首先读取插件的信息，然后向 `html` 中动态注入 `script` 标签载入插件的 `vue` 组件库，最后通过 `vue` 的动态组件 `component` 标签渲染出各个插件的界面。