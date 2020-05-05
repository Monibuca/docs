# 更新历史
- 2020/5/5 v2.0.0
修改内容
1. 采用RingBuffer数据结构代替原来的channel方式（向订阅者push变成由订阅者自取）
2. Room修改为Stream，为后续编写服务端业务逻辑做准备
3. InputStream修改为Publisher，去除OnClose方法
4. OutputStream修改为Subscriber,Play方法改为Subscribe
5. UI界面由原来的WebComponent方式修改为vue的lib方式
6. UI框架由iview变为muse-ui，并定制化一套赛博朋克风格的主题
7. 增加插件配置热更新机制

- 2020/3/5 v1.1.0 配置文件格式简化
- 2020/3/1 v1.0.2
项目迁移到github.com/Monibuca中，完成拆分
- 2020/2/26 v0.4.0
加入h265和mp3两种格式，加入插件市场功能
- 2020/2/20
完成实例管理器
- 2020/1/27
完成核心架构