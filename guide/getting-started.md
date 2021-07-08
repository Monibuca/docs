# 起步

## 快速体验

直接下载可执行文件到本地，运行即可，默认后台界面`http://localhost:8080`

### 下载地址

- [Linux](https://monibuca.com/linux.tgz)
- [Windows](https://monibuca.com/windows.tgz)
- [Mac](https://monibuca.com/mac.tgz)

## 自己编译Demo工程

:::tip 提前安装好Go环境
可以到https://studygolang.com/dl 下载
安装好后，需要配置GOPROXY环境变量。执行go env -w GORPOXY=https://goproxy.io。或者直接修改系统环境变量。
:::

1. git clone https://github.com/langhuihui/monibuca
2. go mod tidy
3. go run main.go

说明：demo工程是一个包含UI界面的示例工程，由一个main.go一个config.toml文件和一个ui文件夹构成。其中main.go负责调用monibuca的引擎和插件，以及提供UI界面的http访问。