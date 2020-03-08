# 引擎API

引擎中暴露了一些结构体和方法，供开发插件调用。

## 插件相关

### PluginConfig

 ```go
//PluginConfig 插件配置定义
type PluginConfig struct {
	Name    string      //插件名称
	Type    byte        //类型
	Config  interface{} //插件配置
	UI      string      //界面路径
	Version string      //插件版本
	Run     func()      //插件启动函数
}
 ```
该结构体用于作为插件启动时传入引擎的参数，见InstallPlugin函数。
- Name 是插件在安装时的唯一标识，建议使用首字母大写的英文单词或者缩写表示。
- Type 插件类型，见插件类型条目
- Config 这个是插件使用的配置信息，是一个自定义结构体对象，插件配置读取后，将会通过反序列化构造出自定义的结构体对象。
- UI 指示插件的界面代码的绝对路径，可以使用engine提供的CurrentDir函数构造出插件包所在目录拼接的绝对路径。如果该插件没有UI界面，则不需要设置该值。
- Verison 是插件版本信息。
- Run 是一个函数，在插件配置解析完成后，会调用该函数，也可以不设置。如果在配置文件中找不到对应的插件配置，则不会调用该函数。

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
		Type:    PLUGIN_HOOK,
		Config:  config,
		Version: "1.0.0",
		UI:      CurrentDir("dashboard", "ui", "plugin-logrotate.min.js"),
		Run:     run,
	})
}
```
一般我们会在插件的init函数中调用该函数，以在第一时间启动插件。在调用过引擎的Run函数后，再安装插件就会错过插件启动的时机。

### 插件类型

```go
const (
	PLUGIN_NONE       = 0      //独立插件
	PLUGIN_SUBSCRIBER = 1      //订阅者插件
	PLUGIN_PUBLISHER  = 1 << 1 //发布者插件
	PLUGIN_HOOK       = 1 << 2 //钩子插件
)
```
插件可以同时具备多项功能，因此可以使用或（|）运算符连接多个类型例如
`PLUGIN_PUBLISHER|PLUGIN_SUBSCRIBER`

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
	log.SetOutput(&LogWriter{
		Writer: wn,
		origin: log.Writer(),
	})
}
```
该函数可以给日志输出增加输出渠道，有时候我们需要跟踪日志，就可以用该方法。
如果想要删除添加的输出渠道，只需要让你的输出渠道调用Write返回错误即可。

## 核心定义

### Publisher

### InputStream

### AllRoom

### Subscriber

### OutputStream

## 编码格式



## 工具类

### SSE

### CurrentDir