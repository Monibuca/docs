  publish:
    pubaudio: true # 是否发布音频流
    pubvideo: true # 是否发布视频流
    kickexist: false # 剔出已经存在的发布者，用于顶替原有发布者
    insertsei: false # 是否启用插入SEI功能
    publishtimeout: 10s # 发布流默认过期时间，超过该时间发布者没有恢复流将被删除
    idletimeout: 0 # 发布者空闲超时时间，超过该时间发布者没有任何操作将被删除，0为关闭该功能
    delayclosetimeout: 0 # 自动关闭触发后延迟的时间(期间内如果有新的订阅则取消触发关闭)，0为关闭该功能，保持连接。
    waitclosetimeout: 0 # 发布者断开后等待时间，超过该时间发布者没有恢复流将被删除，0为关闭该功能，由订阅者决定是否删除
    buffertime: 0 # 缓存时间，用于时光回溯，0为关闭缓存
    key: "" # 订阅者鉴权秘钥
    secretargname: secret # 订阅者鉴权参数名
    expireargname: expire # 订阅者鉴权过期时间参数名
    speedlimit: 500ms # 限速超时时间0为不限速，对于读取文件这类流需要限速，否则读取过快