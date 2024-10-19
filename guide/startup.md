# 快速起步

根据你的使用场景和个人偏好，使用 Monibuca 时，你可以选择是否自己编译启动工程。

## 安装

- 官方提供已编译好的各个平台的二进制可执行文件（即绿色软件），所以无需安装任何其他软件即可运行。
- 如果需要自己编译启动工程，则需要安装 go1.21 以上版本。

:::tip 配置 go 环境

- go 可以在https://golang.google.cn/dl 中下载到
- 国内需要执行 go env -w GOPROXY=https://goproxy.cn 来下载到被屏蔽的第三方库
  :::

官方提供了最新版本的下载链接：

- [Linux](https://download.m7s.live/bin/m7s_linux_amd64.tar.gz)
- [Linux-arm64](https://download.m7s.live/bin/m7s_linux_arm64.tar.gz)
- [Mac](https://download.m7s.live/bin/m7s_darwin_amd64.tar.gz)
- [Mac-arm64](https://download.m7s.live/bin/m7s_darwin_arm64.tar.gz)
- [Windows](https://download.m7s.live/bin/m7s_windows_amd64.tar.gz)

## 运行

### 可执行文件直接运行

- Linux 例如下载到了/opt/m7s_linux_x86,则 `cd /opt` 然后 `./m7s_linux_x86`
- Mac 和 Linux 类似，需要注意的时候可能需要修改文件的可执行权限，也可以双击运行
- Windows，直接双击 m7s_windows_x86.exe 即可启动

:::tip 运行多实例
由于实例会监听 http 端口，所以如果需要运行多实例，就需要为每个实例指定不同的 http 端口，因此需要启动时指定配置文件，例如./m7s_linux_x86 -c config.yaml
:::

### Docker 启动

```bash
docker run -id -p 1935:1935 -p 8080:8080 -p 8443:8443 -p 554:554 -p 58200:58200 -p 5060:5060/udp -p 8000:8000/udp -p 9000:9000 langhuihui/monibuca:latest
```

### 编译启动工程

1. `git clone https://github.com/langhuihui/monibuca`
2. `cd monibuca`
3. `go run main.go`

### 创建启动工程

可以观看视频教程：

- [从零启动 m7s V4](https://www.bilibili.com/video/BV1iq4y147N4/)

  <iframe src="//player.bilibili.com/player.html?isOutside=true&aid=594485763&bvid=BV1iq4y147N4&cid=541286047&p=1" scrolling="no" border="0" frameborder="no" framespacing="0" allowfullscreen="true"></iframe>

- [m7s v4 视频教程——插件引入](https://www.bilibili.com/video/BV1sP4y1g7BF/)

  <iframe src="//player.bilibili.com/player.html?isOutside=true&aid=894561321&bvid=BV1sP4y1g7BF&cid=542391685&p=1" scrolling="no" border="0" frameborder="no" framespacing="0" allowfullscreen="true"></iframe>

## 使用

m7s 默认已开启所有的插件，故已开始监听 rtmp、rtsp、gb28181 等所有协议的端口，可以直接推流到 m7s。

### 推流

- 通过 OBS，推到 `rtmp://localhost/live/test`
- 通过 ffmpeg 和 rtmp
  ```sh
  ffmpeg -i [视频源] -c:v h264 -c:a aac -f flv rtmp://localhost/live/test
  ```
- 通过 ffmpeg 和 rtsp
  ```sh
  ffmpeg -i [视频源] -c:v h264 -c:a aac -f rtsp rtsp://localhost/live/test
  ```
- 通过 webrtc 测试页面推流，访问 http://localhost:8080/webrtc/test/publish
- 通过对摄像头配置 sip 服务器地址到本机，指定 5060 端口即可将设备流送入 m7s 中

### 播放

> 播放详情请参考 [播放问题汇总](/guide/qa/play.html)

- 通过访问 http://localhost:8080/preview/ 可以预览所有的流（多种协议预览页面）
- 通过 ffplay 可以播放 rtmp 流
  ```sh
  ffplay rtmp://localhost/live/test
  ```
- 通过 ffplay 可以播放 rtsp 流
  ```sh
  ffplay rtsp://localhost/live/test
  ```
- 通过 ffplay 可以播放 hls 流
  ```sh
  ffplay http://localhost:8080/hls/live/test.m3u8
  ```
