# 中间件
中间件指对http请求进行预处理的函数。中间件可以用来处理请求，添加日志，验证用户身份等等。

## 中间件的定义

中间件的定义如下：

```go
type Middleware func(string, http.Handler) http.Handler
```
其中第一个参数是path，第二个参数是下一个中间件，返回值是当前中间件。

例如：源码中对每一个请求都打印一条日志就是典型的中间件
```go
func (opt *Plugin) logHandler(pattern string, handler http.Handler) http.Handler {
	return http.HandlerFunc(func(rw http.ResponseWriter, r *http.Request) {
		opt.Debug("visit", zap.String("path", r.URL.String()), zap.String("remote", r.RemoteAddr))
		handler.ServeHTTP(rw, r)
	})
}
```

## 添加中间件

中间件可以通过`AddMiddleware`方法添加到`HTTPConfig`中，添加的顺序与中间件执行的顺序相反，最后添加的最先执行。

```go
func (config *HTTP) AddMiddleware(middleware Middleware) {
	config.middlewares = append(config.middlewares, middleware)
}
```
### 添加全局中间件

```go
func init(){
  Global.HTTP.AddMiddleware(func(pattern string, handler http.Handler) http.Handler {
    return http.HandlerFunc(func(rw http.ResponseWriter, r *http.Request) {
      // do something
      handler.ServeHTTP(rw, r)
    })
  })
}

```
### 添加插件中间件
对于具备http请求响应的插件，则可以单独添加中间件
```go
import 	"m7s.live/engine/v4/config"

type MyPluginConfig struct {
  config.HTTP
}

var myPluginConfig = MyPluginConfig{}
func init(){
  myPluginConfig.HTTP.AddMiddleware(func(pattern string, handler http.Handler) http.Handler {
    return http.HandlerFunc(func(rw http.ResponseWriter, r *http.Request) {
      // do something
      handler.ServeHTTP(rw, r)
    })
  })
}
``` 
:::warning 注意
当插件的http没有单独配置端口时，将复用全局的http配置，此时设置的插件中间件无效。
:::
