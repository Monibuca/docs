# Q&A

## Q：流媒体服务器项目有很多，为什么要重复发明轮子？
A: **Monibuca** 不同于其他流媒体服务器的地方是，针对二次开发为目的。多数流媒体服务器，对于二次开发并不友好。 **Monibuca** 开创了插件机制，可以自由组合不同的协议或者功能，定制化特定需求的流媒体服务器。

## Q：Monibuca为何采用Golang为开发语言？
A：因为 `Golang` 语言相比其他语言可读性更强，代码简单易懂，更利于二次开发；另外 `Golang` 的 `goroutine` 特别适合开发高速系统。

## Q：Monibuca是否使用Cgo或者其他语言依赖库？
A：没有。 **Monibuca** 是纯 `Go` 语言开发，不依赖任何其他第三方库比如 `FFmpeg` ，方便二次开发。对部署更友好，仅仅需要 `Golang` 运行环境即可。

## Q：如果我要使用Monibuca，正确的流程是什么？
A: 首先安装 **Monibuca** ，具体可以查看文档。然后打开实例管理器界面，选择插件，创建实例。这个本质上就是建立了一个 `Go` 工程目录，这个工程引用了 **Monibuca** 核心库，以及插件库，插件库可以来自任何地方，如果没有满足当前需求的插件，那么可以自行开发一个插件作为业务逻辑插件。如何开发请查询文档。

## Q：Monibuca对环境有什么要求？直播流可以在微信里播放吗？
**A：Monibuca** 是基于 `Golang` 开发，支持跨平台部署。 **Monibuca** 可以用 `Jessibuca` 播放器在微信、手机浏览器里面播放视频。也可以通过其他 `SDK` 播放 `RTMP` 流、其他协议的流。只需要相应的插件支持即可。

## Q: Jessibuca是什么？
A: `Jessibuca` 是一款使用 `Emscripten` 编译的纯 `H5` 播放器，支持 `H264` 、 `H265` 格式的直播流，[已开源]（http://jessibuca.monibuca.com）

## Q: Monibuca的名称有什么特殊含义吗？
A: 这个单词来源于 `Monica` （莫妮卡）是个人名，在项目里面也存在这个文件夹。没有特别含义，为了解决起名的难题，使用了三个名称分别是 `Monica` 、 `Jessica` 、`Rebecca` 用来代表服务器、播放器、推流器。由于莫妮卡、杰西卡、瑞贝卡，都带卡字，对直播来说寓意不好，所以改为莫妮不卡（`Monibuca`）、杰西不卡[Jessibuca](http://jessibuca.monibuca.com)、瑞贝不卡（`Rebebuca`）。其中推流器 `Rebebuca` 目前尚为公布，是改造了的 `OBS` ，可用于推流 `H265` 。

## 使用过程中遇到的问题解答汇总

### 旧版本创建的实例，删除后，新版本报错了

实例没有删除干净，进入 ~/.monibuca 删除对应的配置文件

### 使用 @langhuihui/monica 时，对node版本要求是什么？

10.x 以上，推荐使用长期稳定版本

### npm i -g @langhuihui/monica 出现 fetchMetadata: sill fetchPackageMetaData error for ..

解决方法：换安装源，执行 npm config set registry https://registry.npm.taobao.org 更换成淘宝的源 然后再执行安装命令 `npm i -g @langhuihui/monica`

### cnpm i -g @langhuihui/monica，安装成功之后 启动 monica 出现 env: node\r: No such file or directory 报错

windows 使用 clrf(\n\r)，导致 mac 等 linux 识别错了。

解决方案：
```sh
你进入 /usr/local/lib/node_modules/@langhuihui/monica/server 这个目录

然后 su root 开启管理员权限。

然后 vim index.js

然后

:set ff=unix
:wq!

然后再执行 monica
```

### 设置了正确可访问的 GOPROXY 创建实例，出现 dial tcp 172.217.27.145:443: i/o timeout

删除实例，多操作几次创建实例，应该是网络的问题

### root权限执行 npm i @langhuihui/monica -g 提示 安装esbuild无权限

解决方案在这个 `issue` 里：[https://github.com/evanw/esbuild/issues/369](https://github.com/evanw/esbuild/issues/369)

在 `npm i @langhuihui/monica -g` 后加 `--unsafe-perm=true` 即可


```sh
# 开启 root 后执行
npm i @langhuihui/monica -g --unsafe-perm=true
```

### mac 上 用 flv.js 打不开推流播放

已知问题，后续修复

