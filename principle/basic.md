---
sidebarDepth: 2
---
# 基本概念

Monibuca 专为二次开发而设计，因此独创的插件机制极具扩展性。插件的功能没有任何限制，但一般会将某一个协议的封包和打包做成一个插件，或者一项独立的功能做成插件，尽量使得插件之间没有任何耦合。插件可以提供端口监听，也可以复用Gateway的端口（Gateway的端口主要用于http的API调用，任何插件都可以复用这个端口，只需要注意路由不要冲突即可）。在开发插件之前请仔细阅读架构设计一章，了解整体架构逻辑。

## 调试内置插件

调试内置插件功能与调试自定义插件或者其他库的方法类似：
1. git clone https://github.com/langhuihui/monibuca
2. 克隆需要调试的插件到本地，假如放到刚才的项目的外层同级目录
3. 修改monibuca 项目中的go.mod 文件，将需要调试的库加入replace，例如`replace github.com/Monibuca/plugin-gb28181/v3 => ../plugin-gb28181`

<<< @/code/go.mod

## 开发自定义插件
### 插件的定义
所谓的插件，没有什么固定的规则，只需要完成安装操作即可。**插件可以实现任意的功能扩展，最常见的是实现某种传输协议用来推流或者拉流。**
### 插件的安装(注册)
下面是内置插件 `jessica` 的源码，代表了典型的插件安装。
```go
package jessica

import (
	"net/http"

	. "github.com/Monibuca/engine/v3"
	"github.com/Monibuca/utils/v3"
	. "github.com/logrusorgru/aurora"
)

var config struct {
	ListenAddr    string
	CertFile      string
	KeyFile       string
	ListenAddrTLS string
}

func init() {
	plugin := &PluginConfig{
		Name:   "Jessica",
		Config: &config,
		Run:    run,
	}
	InstallPlugin(plugin)
}
func run() {
	if config.ListenAddr != "" || config.ListenAddrTLS != "" {
		utils.Print(Green("Jessica start at"), BrightBlue(config.ListenAddr), BrightBlue(config.ListenAddrTLS))
		utils.ListenAddrs(config.ListenAddr, config.ListenAddrTLS, config.CertFile, config.KeyFile, http.HandlerFunc(WsHandler))
	} else {
		utils.Print(Green("Jessica start reuse gateway port"))
		http.HandleFunc("/jessica/", WsHandler)
	}
}
```

### 源码说明

- `init` 会在 `go` 项目启动最开始的时候执行，我们需要在引擎 `Run` 之前注册我们的插件。
- 注册插件，是调用引擎提供的 `InstallPlugin` 函数，传入插件的关键信息。
- 插件的名称 `Name` 必须是唯一的，只需要保证在项目中唯一即可。
- 插件的 `Config` 属性是一个自定义的结构体，只需要保证配置文件的解析和这个结构体定义一致即可。
- 当主程序读取配置文件完成解析后，会调用各个插件的Run函数，上面代码中执行了一个 `http` 的端口监听
- 所有插件都可以共用 `Gateway` 插件的 `http` 服务，但要注意的是路由不可以有冲突。当然插件也可以自己创建 `http` 服务，启用不同的端口号。

### 开发视频发布或者订阅

请参考API一章

## 开发UI界面