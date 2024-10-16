# Prometheus exporter 插件
该插件提供 Prometheus 信息采集功能，方便集成到 Prometheus，可采集下列信息：

- Monibuca 基础信息，采集器名 **base**
- CPU，包括：CPU 负载百分比，用户时间，系统时间等， 采集器名 **cpu**
- 内存，包括：总内存，使用内存等，采集器名 **memory**
- 磁盘，包括：Monibuca所在磁盘总空间，使用空间等，采集器名 **disk**
- 网络，包括：网络接收字节数，发送字节数等，采集器名 **net**
- 媒体，包括：媒体流总数，客户端总数等，采集器名 **media**

# 插件地址
github.com/Monibuca/plugin-exporter

# 插件引入
```go
import (
_ "m7s.live/plugin/exporter/v4"
)
```

# 默认插件配置


```yaml
exporter:
  printcollectors: true # 是否打印开启的采集器，默认 true
  nodeaddr: zh_cn #节点位置
  enabled: "[defaults]" #默认开启的采集器，如果是 defaults，在 yaml 里要用双引号，可以设置开启的采集器，名称见上
  collector: #每个采集器的配置，仅 cpu net 两个采集器有配置
    cpu:
      percpu: false #是否分别统计每个处理器
    net:
      nicwhitelist: ".*" #网卡黑白名单，支持正则表达式，默认所有
      nicblacklist: ""
```

# 接口API
`/exporter/api/metrics` 

# Prometheus 配置
在 scrape_configs 下添加一个 job ，比如：
```yaml
scrape_configs:
  - job_name: "monibuca_exporter"
    metrics_path: "/exporter/api/metrics"
    static_configs:
      - targets: ["ip:port"] # monibuca 的ip和端口
```

# 二次开发
亦可基于本插件，开发自定义的采集器，只需要实现Collector接口，即 **prometheus.Collector** 和 **engine.OnEvent** 的接口，并提供一个构建函数，可以参考 collector/cpu.go。

在构建函数里，会提供 exporter.collector 下的配置。