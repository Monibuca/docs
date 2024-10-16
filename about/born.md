# 诞生过程

**Monibuca** 的诞生可以追溯到 `2006` 年……

## 编写Flash视频会议系统

本人最早的工作是开发 `Flash` 视频会议系统，当时使用的是 **FCS** (全称 `Flash Communication Server` )作为流媒体服务器，后来改名为 **FMS** (全称 `Flash Media Server` )。当时很多业务逻辑是可以直接编写成脚本来运行的。**FMS** 是性能十分优越的服务器，具有集群功能，唯一的不足是比较昂贵。所以当时诞生了开源的 `java` 编写的 **Red5** 。 **Red5** 最大的缺点就是性能较差。在阅读 **Red5** 源码的过程中，便一窥 `RTMP` 协议的全部。

## 移植crtmpserver

当时公司不允许使用 **FMS** 作为服务器（无经费），然后就发现了这款开源的 `rtmp` 服务器，当时使用的时候发现性能很不错。就尝试在上面进行扩展，实现了一些 **FMS** 的功能，比如 `sharedobject` 等。

## H5播放器诞生

其实一切的起因都来自这款播放器，虽然我至今尚为开源，但一直是我研究和开发流媒体服务器的原动力。最早是发现了一个开源项目 [https://github.com/mbebenita/Broadway](https://github.com/mbebenita/Broadway)，这个项目是将 `H264` 的解码程序通过 `emscripten` 编译成了 `js` ，在浏览器端解码播放 `H264` 视频。然后我就在这个基础上实现了 `rtmp` 协议的 `js` 编译，然后通过 `websocket` 传输。后来想到，没有必要去实现 `rtmp` ，可以在 `websocket` 中传输裸数据即可，这样可以节省带宽，也可以减轻浏览器端的解码压力。随后开始陆续将音频解码程序集成进播放器中，最后将 `h265` 的解码程序也集成进去了。有两款 `h265` 的解码程序，分别是 `lib265` 和 `libhevc` 。现已开源[https://github.com/langhuihui/jessibuca](https://github.com/langhuihui/jessibuca)

## 照猫画虎的csharprtmp

当时为了更好的进行扩展，也是基于对 `C#` 的狂热，我移植了 `crtmpserver` 的大部分功能到了 `C#` [https://github.com/langhuihui/csharprtmp](https://github.com/langhuihui/csharprtmp)。在这个过程中，对多线程、 `RTMP` 协议、 `AMF` 协议有了深刻的认识。当然由于功力尚浅，该 `server` 不是很稳定。

## 扩展MonaServer

当时为了能节省带宽，就开始研究 `RTMFP` 协议。于是发现了 `OpenRTMFP` ，又名 `Cumulus Server` 。很快这个项目变成了 `MonaServer` ，用了更为现代的 `C++` 编程，比 `crtmpserver` 更容易二次开发。于是我选择这款服务器进行了二次开发，又再次实现了一些 `FMS` 的功能，然后通过 `WebSocket` 传输音视频裸数据到 `H5` 播放器上面。但是一直有内存泄漏困扰着我，一直没有解决，所以也无法商用。

## 遇见srs

偶然机会发现了这款功能很强的服务器，可以通过一个 `go` 程序将 `srs` 的 `http-flv` 转换成 `websocket` 中传输 `flv` 的方式对接我的 `h5` 播放器，于是这个组合运用到了商用场景中。但是经过一次转发总觉得不是很满意，想改造 `srs` ，但是 `srs` 代码读起来很费劲，这不是黑 `srs` ，应该是本人 `C++` 功力还太浅吧。

## Node-Media-Server vs Gortmp

随着 `flash` 的陨落，本人转型 `Node.js` ,就发现了用 `Node` 写成的流媒体服务器 `Node-Media-Server` ，当时这个还在早期开发阶段，我和作者聊了不少，也 `fork` 了项目，想要在上面进行二次开发，不过当时 `go` 语言兴起，有许多 `go` 写的流媒体服务器诞生，我作了对比后发现还是 `golang` 的运行性能高，于是放弃了使用 `Node.js` 开发的念头。在对比了多款 `golang` 的项目后，最终选定 `gortmp` 作为二次开发的基础。

## 受到vue渐进式思想的影响

`gortmp` 基础上快速的二次开发成为良好的体验，给了我一个启示，在经历了那么多次的二次开发，流媒体服务器的二次开发是一件非常艰难的事情，而 `golang` 打开了一扇新的大门，但不能满足修修补补，需要一款任何人都能快速进行定制化的开发框架。`vue` 渐进式开发思想非常棒，受此启发，将流媒体服务器的核心和外围功能分离，实现了插件化的框架设计。