  http:
    listenaddr: :8080 # 网关地址，用于访问API
    listenaddrtls: :8443 # 用于HTTPS方式访问API的端口配置
    certfile: ""
    keyfile: ""
    cors: true # 是否自动添加cors头
    username: "" # 用户名和密码，用于API访问时的基本身份认证
    password: ""
    readtimeout: 0 # 读超时时间
    writetimeout: 0 # 写超时时间
    idletimeout: 0 # 空闲超时时间