# 鉴权

## 内置鉴权机制

在 publish 和 subscribe 中配置 key 引擎会自动进行鉴权,
推流或者拉流时需要在 url 中添加参数 `secret=xxx&expire=xxx`。

- secret 为鉴权签名：MD5(key+StreamPath+expire)
- expire 为鉴权失效时间，格式是十六进制 UNIX 时间戳

### 时间戳计算

```
设置时间：2018.12.01 08:30:00
十进制 UNIX 时间戳：1543624200
十六进制 UNIX 时间戳：5C01D608（云直播鉴权配置使用十六进制 UNIX 时间戳，十六进制不区分字母大小写）
```

### 鉴权签名计算

```
secret = MD5(key+StreamPath+expire)
secret = MD5(ngoeiq03+test/01+5C01D608)
secret = MD5(ngoeiq03test/015C01D608)
secret = ce797dc6238156d548ef945e6ad1ea20
```

## 自定义鉴权

自定义鉴权需要二次开发，可以参考 [开发文档——鉴权](https://monibuca.com/docs/devel/authentication.html)。
