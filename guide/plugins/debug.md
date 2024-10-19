# debug 插件

该插件可以使得 pprof 通过公共端口访问，并且调用 profile 可以将 CPU 分析文件保存为 cpu.profile 文件，然后自动打开分析 UI 界面。

## 插件地址

https://github.com/Monibuca/plugin-debug

## 插件引入

```go
import _ "m7s.live/plugin/debug/v4"
```

## 接口 API

### `/debug/pprof`

打开 pprof 界面

### `/debug/profile`

默认 30s 采样，可以通过传入 seconds=xxx 来指定采样时间长度

将 CPU 分析文件保存为 cpu.profile 文件，然后自动打开分析 UI 界面。
