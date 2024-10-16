# 鉴权

## 内置鉴权机制

参考 [内置鉴权](https://m7s.live/guide/authentication.html)

## 针对单协议自定义鉴权

引擎中定义如下两个接口，插件中的发布者或者订阅者可以实现这两个接口，引擎会在发布或者订阅时调用这两个接口进行鉴权
```go
type AuthSub interface {
	OnAuth(*util.Promise[ISubscriber]) error
}

type AuthPub interface {
	OnAuth(*util.Promise[IPublisher]) error
}
```
- OnAuth返回错误即鉴权失败
- Promise方便异步鉴权，可以后续调用其Resolve或Reject方法进行鉴权结果的返回

例如：
### 同步鉴权
```go
import . "m7s.live/engine/v4"
type MyAuthPublisher struct {
  Publisher
}

func (p *MyAuthPublisher) OnAuth(promise *util.Promise[IPublisher]) error {
  var auth bool
  var puber = promise.Value
  // do auth
  if !auth {
    return errors.New("auth failed")
  }
  promise.Resolve()
  return nil
}

```
### 异步鉴权
如果鉴权发生在其他协程中，为了方便返回结果可以利用promise传递信息。
```go
import . "m7s.live/engine/v4"
type MyAuthPublisher struct {
  Publisher
}

func (p *MyAuthPublisher) OnAuth(promise *util.Promise[IPublisher]) error {
  go func(){
    var auth bool
    var puber = promise.Value
    // do auth
    if !auth {
      promise.Reject(errors.New("auth failed"))
    } else {
      promise.Resolve()
    }
  }()
  return nil
}

```

## 自定义全局鉴权
引擎中定义如下两个全局函数的变量，插件中可以对这两个变量进行赋值，引擎会在发布或者订阅时调用这两个接口进行鉴权
```go
var OnAuthSub func(p *util.Promise[ISubscriber]) error
var OnAuthPub func(p *util.Promise[IPublisher]) error
```
** 注意：如果单独鉴权和全局鉴权同时存在，优先使用单独鉴权 **
** 全局鉴权函数可以被多次覆盖，所以需要自己实现鉴权逻辑的合并 **

例如：
```go
import . "m7s.live/engine/v4"

func init() {
  OnAuthSub = func(p *util.Promise[ISubscriber]) error {
    var auth bool
    var suber = p.Value
    switch suber.(type) {
      case *MyAuthSubscriber:
        // do auth
        if !auth {
          return errors.New("auth failed")
        }
        return nil
    }
    return nil
  }
}

```
同步和异步的区别看单协议鉴权
