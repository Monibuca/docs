# TS插件
处理TS数据的插件

# 功能

1. 通过Publish发布一个TS流，然后通过Feed方法填入TS数据即可
2. 通过PublishDir可以读取服务器上文件夹内的所有ts文件进行发布

# 默认配置

```toml
[TS]
BufferLength = 2048
Path         = "ts"
```
- BufferLength指的是解析TS流的时候的缓存大小，单位是PES包的个数
- Path 指存放ts的目录

## API

- `/api/ts/list` 罗列所有ts文件
- `/api/ts/publish?streamPath=live/rtc` 开始将文件夹内的ts文件逐个读取，发布成一个直播流
