# debug插件

该插件可以使得pprof通过公共端口访问，并且调用profile可以将CPU分析文件保存为cpu.profile文件，然后自动打开分析UI界面。

## 插件地址

https://github.com/Monibuca/plugin-debug

## 插件引入
```go
import (
    _ "m7s.live/plugin/debug/v4"
)
```

## API

### `/debug/pprof`
打开pprof界面

### `/debug/profile`
默认30s采样，可以通过传入seconds=xxx来指定采样时间长度

将CPU分析文件保存为cpu.profile文件，然后自动打开分析UI界面。