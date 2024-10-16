# 定义插件

- 插件是实现扩展m7s的标准做法。
- 插件可以包含音视频协议的解析或者其他业务逻辑。

## 标准写法

以下是插件的定义和安装插件的最简代码，这个插件没有任何作用。(该插件名称为"MyPlugin")
插件定义必须包含一个`OnEvent`方法来接收所有的插件事件包括事件总线的事件。
```go
import . "m7s.live/engine/v4"
type MyPluginConfig struct {
  // 定义插件的配置
  ABC int
}
func (p *MyPluginConfig) OnEvent(event any) {
  switch event.(type) {
    case FirstConfig: //插件初始化逻辑
    case Config://插件热更新逻辑
    case InvitePublish://按需拉流逻辑
    case SEwaitPublish://由于发布者掉线等待发布者
    case SEpublish://首次进入发布状态
    case SErepublish://再次进入发布状态
    case SEsubscribe://订阅者逻辑
    case SEwaitClose://由于最后一个订阅者离开等待关闭流
    case SEclose://关闭流
    case UnsubscribeEvent://订阅者离开
    case ISubscribe://订阅者进入
  }
}
var plugin = InstallPlugin(new(MyPluginConfig))
```

## 插件配置

```yaml
myplugin:
  abc: 123
```
用户配置了插件配置后，引擎会自动解析并给插件的配置进行赋值。

## 预设配置插件

```go
import 	"m7s.live/engine/v4/config"
type MyPluginConfig struct {
  config.HTTP
  config.Publish
  config.Pull
  config.Subscribe
  config.Push
}
```
可以选择其中一个或者多个预设结构体来定义插件的配置，使得插件具备特定的能力。
这些配置项可以覆盖全局配置。

:::warning 强制性
如果插件需要实现发布者能力，则必须加入`config.Publish`配置结构体，因为在注册发布流的时候会自动读取发布者配置信息。
:::
