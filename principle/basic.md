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

## 开发UI界面