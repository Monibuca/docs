# 诞生过程

Monibuca的诞生可以追溯到2006年……

## 编写Flash视频会议系统

本人最早的工作是开发Flash视频会议系统，当时使用的是**FCS**(全称Flash Communication Server)作为流媒体服务器，后来改名为**FMS**(全称Flash Media Server)。当时很多业务逻辑是可以直接编写成脚本来运行的。FMS是性能十分优越的服务器，具有集群功能，唯一的不足是比较昂贵。所以当时诞生了开源的java编写的**Red5**。Red5最大的缺点就是性能较差。在阅读Red5源码的过程中，便一窥RTMP协议的全部。

## 移植crtmpserver

当时公司不允许使用FMS作为服务器（无经费），然后就发现了这款开源的rtmp服务器，当时使用的时候发现性能很不错。就尝试在上面进行扩展，实现了一些FMS的功能，比如sharedobject等。

## H5播放器诞生

其实一切的起因都来自这款播放器，虽然我至今尚为开源，但一直是我研究和开发流媒体服务器的原动力。最早是发现了一个开源项目https://github.com/mbebenita/Broadway，这个项目是将H264的解码程序通过emscripten编译成了js，在浏览器端解码播放H264视频。然后我就在这个基础上实现了rtmp协议的js编译（https://github.com/langhuihui/H5RtmpClient），然后通过websocket传输。后来想到，没有必要去实现rtmp，可以在websocket中传输裸数据即可，这样可以节省带宽，也可以减轻浏览器端的解码压力。随后开始陆续将音频解码程序集成进播放器中，最后将h265的解码程序也集成进去了。有两款h265的解码程序，分别是lib265和libhevc。

## 照猫画虎的csharprtmp

当时为了更好的进行扩展，也是基于对C#的狂热，我移植了crtmpserver的大部分功能到了C#（https://github.com/langhuihui/csharprtmp）。在这个过程中，对多线程、RTMP协议、AMF协议有了深刻的认识。当然由于功力尚浅，该server不是很稳定。

## 扩展MonaServer

当时为了能节省带宽，就开始研究RTMFP协议。于是发现了OpenRTMFP，又名Cumulus Server。很快这个项目变成了MonaServer ，用了更为现代的C++编程，比crtmpserver更容易二次开发。于是我选择这款服务器进行了二次开发，又再次实现了一些FMS的功能，然后通过WebSocket传输音视频裸数据到H5播放器上面。但是一直有内存泄漏困扰着我，一直没有解决，所以也无法商用。

## 遇见srs

偶然机会发现了这款功能很强的服务器，可以通过一个go程序将srs的http-flv转换成websocket中传输flv的方式对接我的h5播放器，于是这个组合运用到了商用场景中。但是经过一次转发总觉得不是很满意，想改造srs，但是srs代码读起来很费劲，这不是黑srs，应该是本人C++功力还太浅吧。

## Node-Media-Server vs Gortmp

随着flash的陨落，本人转型Node.js,就发现了用Node写成的流媒体服务器Node-Media-Server，当时这个还在早期开发阶段，我和作者聊了不少，也fork了项目，想要在上面进行二次开发，不过当时go语言兴起，有许多go写的流媒体服务器诞生，我作了对比后发现还是golang的运行性能高，于是放弃了使用Node.js开发的念头。在对比了多款golang的项目后，最终选定gortmp作为二次开发的基础。

## 受到vue渐进式思想的影响

gortmp基础上快速的二次开发成为良好的体验，给了我一个启示，在经历了那么多次的二次开发，流媒体服务器的二次开发是一件非常艰难的事情，而golang打开了一扇新的大门，但不能满足修修补补，需要一款任何人都能快速进行定制化的开发框架。vue渐进式开发思想非常棒，受此启发，将流媒体服务器的核心和外围功能分离，实现了插件化的框架设计。