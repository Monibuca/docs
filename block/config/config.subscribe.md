  subscribe:
    subaudio: true # 是否订阅音频流
    subvideo: true # 是否订阅视频流
    subaudioargname: ats # 订阅音频轨道参数名
    subvideoargname: vts # 订阅视频轨道参数名
    subdataargname: dts # 订阅数据轨道参数名
    subaudiotracks: [] # 订阅音频轨道名称列表
    subvideotracks: [] # 订阅视频轨道名称列表
    submode: 0 # 订阅模式，0为跳帧追赶模式，1为不追赶（多用于录制），2为时光回溯模式
    syncmode: 0 # 音视频同步模式，0 为按照时间戳同步，1 为按照写入时间同步
    iframeonly: false # 只订阅关键帧
    waittimeout: 10s # 等待发布者的超时时间，用于订阅尚未发布的流
    writebuffersize: 0 # 订阅者写缓存大小，用于减少io次数，但可能影响实时性
    key: "" # 订阅者鉴权秘钥
    secretargname: secret # 订阅者鉴权参数名
    expireargname: expire # 订阅者鉴权过期时间参数名
    internal: false # 是否内部订阅，内部订阅不会触发发布者自动断开功能