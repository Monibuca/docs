# 插件API定义

通常插件需要对外提供HTTP API调用能力。引擎做了一些封装方便定义这些API

## 规则
当插件配置定义中包含`func XXX(w http.ResponseWriter, r *http.Request)`的方法时，则根据方法名自动注册为HTTP API。例如：

```go
import (
  . "m7s.live/engine/v4"
  "m7s.live/engine/v4/config"
)
type MyPluginConfig struct {
    config.HTTP
}
func (p *MyPluginConfig) API_abc(w http.ResponseWriter, r *http.Request) {
  
}
```
则自动产生 `/myplugin/api/abc` 路径的HTTP API。即下划线`_`会转换成`/`

## ServeHTTP
如果方法名为`ServeHTTP`，例如：
```go
import (
  . "m7s.live/engine/v4"
  "m7s.live/engine/v4/config"
)
type MyPluginConfig struct {
    config.HTTP
}
func (p *MyPluginConfig) ServeHTTP(w http.ResponseWriter, r *http.Request) {
  
}
```
则会产生 `/myplugin/*` 路径的HTTP API。用于不特定路由的请求。

## CORS

默认会开启CORS头注入

如需关闭，需要在配置项中配置
```yaml
myplugin:
  http:
    cors: false
```

## 自定义HTTP端口

默认采用全局端口（默认8080）

每个插件可以自定义端口号
```yaml
myplugin:
  http:
    listenaddr: :8081
```

## 自定义HTTPS

默认采用全局HTTPS配置（默认没有开启HTTPS）

```yaml
myplugin:
  http:
    listenaddrtls: :8443
    certfile: monibuca.com.pem
    keyfile: monibuca.com.key
```
