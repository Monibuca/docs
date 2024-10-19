  pull:
    # 代表重试的次数，如果设置为`-1`则为无限重试，`0`则是不重试
    repull: 10
    # 代表代理地址，如果需要代理拉流，可以配置该项
    proxy: [Proxy URL]
    # 代表随着`m7s`启动，则立即进行拉流
    pullonstart:
      # 是一个键值对映射（map）`key`代表拉流进入`m7s`后的`streamPath`，`value`就是远程流地址
      live/test: [URL1]
      live/test2: [URL2]
    # 代表的是按需拉流，即`m7s`收到指定流的订阅时才开始拉流
    pullonsub:
      # 格式同上
      live/test3: [URL3]
      live/test4: [URL4]