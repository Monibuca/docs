# WebTransport 插件

通过 WebTransport 进行推拉流

## 插件地址

https://github.com/Monibuca/plugin-webtransport

## 插件引入

```go
import _ "m7s.live/plugin/webtransport/v4"
```

## 配置

```yaml
webtransport:
  listenaddr: :4433
  certfile: local.monibuca.com_bundle.pem
  keyfile: local.monibuca.com.key
```

## 接口 API

### 播放

- **URL**: `/play`
- **参数**:

| 参数名     | 必填 | 类型   | 描述   |
| ---------- | ---- | ------ | ------ |
| streamPath | 是   | string | 流地址 |

- **示例**:
  - `/play/[streamPath]`

### 推流

- **URL**: `/push`
- **参数**:

| 参数名     | 必填 | 类型   | 描述   |
| ---------- | ---- | ------ | ------ |
| streamPath | 是   | string | 流地址 |

- **示例**:
  - `/push/[streamPath]`

建立双向流后传输 flv 格式的数据
