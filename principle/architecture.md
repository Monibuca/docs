# 设计架构

## 插件启动

```mermaid
sequenceDiagram
participant Instance
participant Engine
participant Plugin
par 引入
Instance-->>Engine:import
Instance-->>Plugin:import
end
Plugin->>Engine: Install
Note Left of Plugin:包含run回调函数
Instance->>Instance:获取配置文件地址
Instance->>Engine:Run
Engine->>Engine:加载配置文件 Config.toml
Engine-->>Plugin:填充配置
Engine->>Plugin:run
```

## 流转发

```mermaid
sequenceDiagram
participant Publisher
participant Stream
participant Track
participant Subscriber
Publisher->>+Stream: 创建（StreamPath）
Subscriber->>Stream: 订阅
Subscriber->>Track: 等待
Publisher->>Stream: Publish
Publisher->>Track: 添加
Track-->>Subscriber: 通知
Publisher->>Track: 推送音视频数据
Subscriber->>Track: 获取音视频数据
Publisher->>Stream: 关闭
Stream->>Subscriber: 关闭
Stream->>Track: 销毁
```

## 缓冲环

```mermaid
graph LR
    A-->B-->C-->D-->A
```

## 缓冲读写

```mermaid
sequenceDiagram
participant Publisher
participant 当前节点
participant 下一个节点
participant Subscriber
Publisher->>当前节点: 写入数据
Publisher->>下一个节点: 加锁（waitGroup add)
Publisher->>当前节点: 释放锁（waitGroup done）
Subscriber->>当前节点 : 获取数据
Subscriber->>下一个节点 : 等待（waitGroup Wait）
```
## 缓冲环的销毁

::: TIP
当发布者关闭后，需要将所有的缓冲环的当前锁定的节点解锁，防止订阅者无限等待
:::

通过原子操作避免使用锁，因为销毁操作和写入操作可能不在同一个goroutine中
- 在写入操作时，尝试从0改成1，如果成功那么说明写入成功，否则说明已被销毁（已变为2）
- 在写完以后，尝试从1改变成0，如果失败，说明已经变为2了，需要解锁
```go
func (r *RingDisposable) Write(value interface{}) {
	// r.UpdateTime = time.Now()
	last := r.Current()
	last.Value = value
	if atomic.CompareAndSwapInt32(&r.Flag, 0, 1) {
		current := r.GetNext()
		current.Add(1)
		last.Done()
		//Flag不为1代表被Dispose了，但尚未处理Done
		if !atomic.CompareAndSwapInt32(&r.Flag, 1, 0) {
			current.Done()
		}
	}
}
```
- 在销毁时,尝试从0改成2，如果成功，就解锁，如果失败说明此时为1，尝试从1改成2，如果失败，说明此时为0，则尝试从0改成2
```go
func (r *RingDisposable) Dispose() {
	current := r.Current()
	if atomic.CompareAndSwapInt32(&r.Flag, 0, 2) {
		current.Done()
	} else if atomic.CompareAndSwapInt32(&r.Flag, 1, 2) {
		//当前是1代表正在写入，此时变成2，但是Done的任务得交给NextW来处理
	} else if atomic.CompareAndSwapInt32(&r.Flag, 0, 2) {
		current.Done()
	}
}
```
```mermaid
stateDiagram-v2
   0 --> 1
   1 --> 0
   0 --> 2
   1 --> 2
```
```mermaid
sequenceDiagram
participant 0
participant 1
participant 2
loop 写入循环
0->>1: 写入数据
1->>0: 写入完成
end
opt 写入时已被销毁
0-->>2: 销毁成功
0-x1: 失败
end
opt 写入完成后被销毁
0->>1: 写入数据
1-->>2: 销毁成功
1-x0: 失败
Note Right of 0:执行解锁
end
opt 首次销毁失败
0->>1: 写入数据
0--x2: 销毁失败
1-->>2: 销毁成功
Note Right of 1:不执行解锁，防止妨碍到写入操作
end
opt 第二次销毁失败
0->>1: 写入数据
0--x2: 销毁失败
1->>0: 写入完成
1--x2: 销毁失败
0-->>2: 销毁成功（一定成功，每个节点只有一次0-1-0到过程）
end
```

## 等待指定媒体轨道

在流创建后5秒内为等待区间，超过5秒后不再等待，直接判断是否存在音视频轨

### 直接返回轨道
```go
ts.RLock()
defer ts.RUnlock()
if len(codecs) == 0 {
    return ts.m[ring.Read().(string)]
} else {
    for _, codec := range codecs {
        if t, ok := ts.m[codec]; ok {
            return t
        }
    }
    return nil
}
```

### 任意编码轨道

```mermaid
sequenceDiagram
participant Subscriber
participant WaitChannel
participant 读取轨道
Subscriber-->>WaitChannel :等待
读取轨道->>WaitChannel :填入
WaitChannel->>Subscriber: 返回
```

### 指定编码轨道
```mermaid
sequenceDiagram
participant Subscriber
participant WaitChannel
participant 读取轨道
Subscriber-->>WaitChannel :等待
loop 读取每一个
读取轨道->>WaitChannel :填入
WaitChannel->>Subscriber: 返回
Subscriber->>Subscriber: 判断是否是指定的编码
end
```

## 不同视频包装格式存储
字节流格式：即RTMP协议所用的格式：
VideoTagHeader + Nalu长度 + Nalu
```mermaid
graph LR
    Pack[存储格式,包含字节流和Nalu数组]
    ByteStream[字节流]
    ByteStream --提取Nalu数组--> Pack
    RTP --拼接字节流--> Pack
```