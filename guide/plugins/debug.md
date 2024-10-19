# debug 插件

该插件可以使得 pprof 通过公共端口访问，并且调用 profile 可以将 CPU 分析文件保存为 cpu.profile 文件，然后自动打开分析 UI 界面。

## 插件地址

https://github.com/Monibuca/plugin-debug

## 插件引入

```go
import _ "m7s.live/plugin/debug/v4"
```

## 接口 API

### 打开 pprof 界面

- **URL**: `/debug/pprof`
- **请求方式**: GET

### pprof 采样

- **URL**: `/debug/profile`
- **描述**: 将 CPU 分析文件保存为 cpu.profile 文件，然后自动打开分析 UI 界面
- **请求方式**: GET
- **参数**:

| 参数名  | 必填 | 类型 | 描述                                  |
| ------- | ---- | ---- | ------------------------------------- |
| seconds | 否   | int  | 指定采样时间长度，单位是秒，默认值 30 |

- **示例**:
  - `/debug/profile?seconds=30`
