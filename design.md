# Monibuca设计原理

## 如何实现可扩展——插件化
许多IDE和编辑器都依靠插件化技术得以拓展其功能，并形成其生态，例如vs、vs code、eclipse、jetbrains系列，当然vue作为一个前端框架也是设计了很不错的插件机制。这些都可以作为借鉴。

要实现流媒体服务器的插件化，就需要把核心功能和拓展功能分离，进行足够的抽象。

### 三大抽象概念
1. 发布者（Publisher）
2. 订阅者（Subscriber）
3. 房间（Room）

#### 发布者（Publisher）
发布者本质上就是输入流，其抽象行为就是将音频和视频数据压入**房间**中，换句话说，就是在恰当的时候调用**房间**的PushVideo和PushAudio函数
::: tip 源码位置
发布者定义位于monica/publisher.go中
:::
在发布者的定义中有一个**InputStream**的结构体，用来和**房间**进行互操作。
所有具体的发布者都应该包含这个**InputStream**，以组合继承的方式成为发布者。
该**InputStream**包含最核心功能就是Publish函数，这个函数的功能就是在**房间**里面设置发布者是自己，这个行为就是发布。形象的理解就是主播走进了房间。
引擎不关心是谁走进了房间，也不关心进来的人会发布什么内容。
::: tip 发布者插件
所有实现了发布者具体功能的插件，就是发布者插件，这样一来，流媒体的媒体源可以是任意的形式，比如RTMP协议提供的推流，可以由FFMPEG、OBS发布。也可以是读取本地磁盘上的媒体文件，也可以来自源服务器的私有协议传输的内容。
:::
#### 订阅者（Subscriber）
订阅者就是输出流，其抽象行为就是被动接收来自**房间**的音频和视频数据。
::: tip 源码位置
订阅者定义位于monica/subscriber.go中
:::
订阅者有两个函数sendVideo和sendAudio用于接收音频和视频数据。这个两个函数会对音视频做一些预处理，主要是实现丢包机制、时间戳和首屏渲染。具体的视频数据会共享读取。
然后调用SendHandler将打包好的音视频数据发送到具体的订阅者那里。
::: tip 订阅者插件
订阅者插件，本质上就是SendHandler函数。具体可以将打包的数据以何种协议输出，还是写入文件，由插件实现。
:::

#### 房间（Room）
房间就是一个连接发布者和订阅者的地方。可以形象的理解为主播的房间，发布者是主播，订阅者就是粉丝观众。房间是引擎的核心，其重要逻辑包括：
1. 房间的创建、查询、关闭
2. 订阅者的加入和移除
3. 发布者的进入和离开。
::: tip 源码位置
订阅者定义位于monica/room.go中
:::

流媒体服务器的核心是**转发**二字。当你去研究一款流媒体服务器的时候，会有海量的代码阻碍你看清其核心逻辑。包括：

1. 多媒体格式定义、解析，如Flv、MP4、MP3、H264、AAC等等
2. 传输协议的解析，如RTMP家族、AMF、HTTP、RTSP、HLS、WebSocket等等
3. 各种工具类，用来读取字节的缓冲、大小端转换、加解密算法、等等

大部分流媒体服务器都是基于rtmp协议之上扩展而来，这是历史原因造成的，所以功能不能很好的分离，耦合度很高。往往牵一发而动全身。其实所谓的流媒体服务器本质上就是把发布者的数据经过服务器转发到订阅者手里播放，起一个中转作用。至于什么协议格式，什么媒体格式都是属于扩展功能。所以最轻量的服务器应该不包含任何协议格式，任何媒体格式，仅仅只是完成中转。再说的直白一点核心代码就是一个for循环。
```go
for _, v := range r.Subscribers {
    v.sendVideo(video)
}
```
其他都是围绕这个for循环展开。所有的流媒体服务器代码里面都有这个for循环，写法稍有不同，但本质相同。
::: tip 源码位置
该核心逻辑位于monica/room.go中的Run函数内
:::

## 如何实现高性能
流媒体服务器对性能要求极为苛刻。因为流媒体服务器属于高速系统，会有并发的长连接请求，协议封包解包和音视频格式的编解码都消耗着CPU以及内存，如何尽可能的减少消耗是必须考虑的问题。

### 内存使用
池化是一个不错的选择，所以尽量池化，在Monibuca中对`[]byte`类型，采用了[github.com/funny/slab](https://github.com/funny/slab)包来管理。其他结构体就用系统自带的pool包来池化对象。

### 协程的使用
golang自带的goroutine可以有效的减少线程的使用，并可以支持各种异步并发的情况。合理的创建goroutine很重要，这样才能尽可能高效利用CPU时间。
在monibuca中，创建goroutine在如下场景中：
1. 通讯协议建立的长连接对于一个goroutine
2. 每个房间拥有一个goroutine用于接收指令和转发音视频数据
3. 每一个插件会使用一个goroutine来执行插件的Run函数

由于引擎本身比较轻量化，更多的性能的优化需要插件提供者自由发挥了。

## 界面的模块化

为了方便访问每一个插件的界面，我们需要将所有插件的自定义的界面集中在一起显示。
我们需要实现一下功能：
1. 在主界面中可以动态加载插件的界面，并实现切换
2. 可以将参数传入插件界面中。
3. 显示插件界面要快速流畅。

可供选择的方案有：
1. 使用iframe加载各个插件的界面
2. 使用vue动态编译
3. 使用vuecli的编译成WebComponent方式

其中方案1是最差选择，iframe有各种弊端，现在的趋势是尽量不使用iframe方式。
方案2是一个可以实现的方案，缺陷是无法利用vue的编译特性，需要手动管理前端资源，不利于工程化。
方案3是最佳方案，可以完美的避开上述两个方案的所有缺点。

> 方案三用到的技术：https://cli.vuejs.org/guide/build-targets.html#web-component

当然在采用方案3的过程中也并非一帆风顺。其中最大的问题是CSS样式加载的问题。由于WebComponent的特殊性，WebComponent内部的CSS和外部是完全隔离的。所以需要单独加载CSS。在我们的项目中，采用的是iview的UI框架，所以需要载入iview的css文件才能正常显示。

### 第一次尝试：动态添加link标签

最初想到的自然是用js动态添加link标签，由于vue文件中，如果要取得dom元素，必须要等到mounted函数中才能操作，所以有一段时间的界面显示错乱。
```js
let linkTag = document.createElement('link');
linkTag.href = "iview.css";
linkTag.setAttribute('rel','stylesheet');
linkTag.setAttribute('type','text/css');
el.appendChild(linkTag);
```

### 第二次尝试：使用import方式

比第一种方式更优雅的是在vue文件中的style标签里写入import
```html
<style>
@import url("/iview.css")
</style>
```
这样就能动态加载css文件了。但是弊端很快也出现了，就是每次加载WebComponent，都会再次加载这个css文件，页面上还是会有一段时间的错位。那么如何才能避免每次渲染组件时加载css文件呢？

### 第三次尝试：使用动态注入css对象方式

为了深入理解WebComponent的样式机制，打开
https://github.com/w3c/webcomponents 查看官方说法。
仔细翻找有关CSS的内容，找到这个例子：
```js
import styles from "styles.css";
document.adoptedStyleSheets = [...document.adoptedStyleSheets, styles];
```

经过尝试，在vue文件内部import写法无法构造出CSSStyleSheet对象,于时放在父页面的html里面
```html
 <script type="module">
 import styles from "iview.css";
 window.iviewCSS = styles
 </script>
 ```
 试图通过window这个全局变量来操作。结果也是失败而告终。报错信息的意思是加载的文件MIME头必须是javascript，而我返回的是stylesheet。

 此时我想到一个办法，既然无法直接导入，那我手动构建一个CSSStyleSheet对象不就行了？
 最先尝试直接拿父页面的document.stylesheets传入WebComponent中，结果报错：必须使用带构造函数的CSSStyleSheet对象，WTF。
https://wicg.github.io/construct-stylesheets/#dom-cssstylesheet-cssstylesheet
查文档，要使用构造的CSSStyleSheet必须用js new出来即：
```js
var style = new CSSStyleSheet()
```
才能传入shadowRoot.adoptedStyleSheets
那外部的CSS文件怎么传入到CSSStyleSheet对象中呢。从文档上看，加载CSS文件的方式已经全部堵死。
```
CSSStyleSheet(options)
When called, execute these steps:
Construct a new CSSStyleSheet object sheet with the following properties:

location set to the base URL of the associated Document for the current global object

No parent CSS style sheet.

No owner node.

No owner CSS rule.

title set to the title attribute of options.

Set alternate flag if the alternate attribute of options is true, otherwise unset the alternate flag.

Set origin-clean flag.

Set constructed flag.

Constructor document set to the associated Document for the current global object.

If the media attribute of options is a string, create a MediaList object from the string and assign it as sheet’s media. Otherwise, serialize a media query list from the attribute and then create a MediaList object from the resulting string and set it as sheet’s media.

If the disabled attribute of options is true, set sheet’s disabled flag.

Return sheet.

```
最后，用一个比较粗暴的方式解决了这个难题。
```js
const appStyle = new CSSStyleSheet();
const appCSSs = document.styleSheets;
for (var i = 0; i < appCSSs.length; i++) {
    for (var j = 0; j < appCSSs[i].cssRules.length; j++) {
        appStyle.insertRule(appCSSs[i].cssRules[j].cssText);
    }
}
```
我们遍历了父页面所有的样式规则，通过调用insertRule来手工填充CSSStyleSheet对象。
其中就包含了link标签里面载入的CSS文件的CSS规则。然后我们再赋给shadowRoot。最终结果是WebComponent不再需要import CSS，去下载CSS，页面瞬间渲染完成。