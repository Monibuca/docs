### 获取所有 HLS 流

- **URL**: `/hls/api/list`
- **请求方式**: GET
- **描述**: 列出所有 HLS 流，该接口是一个 Server-Sent Events (SSE)，可以持续接收到列表数据。
- **参数**:

| 参数名 | 必填 | 类型   | 描述                                              |
| ------ | ---- | ------ | ------------------------------------------------- |
| json   | 否   | string | 可选参数，设置 1 ，则返回的数据将以 JSON 格式呈现 |

- **示例**:
  - `/hls/api/list`
  - `/hls/api/list?json=1`

### 保存指定的流为 HLS 文件

- **URL**: `/hls/api/save`
- **请求方式**: GET
- **描述**: 保存指定的流为 HLS 文件（m3u8 和 ts）。当请求关闭时，保存过程将结束。该 API 仅作用于远程拉流。
- **参数**:

| 参数名     | 必填 | 类型   | 描述                                |
| ---------- | ---- | ------ | ----------------------------------- |
| streamPath | 是   | string | 指定要保存的流路径，例如 `live/hls` |

- **示例**:
  - `/hls/api/save?streamPath=live/hls`

### 拉取目标 HLS 流作为媒体源

- **URL**: `/hls/api/pull`
- **请求方式**: GET
- **描述**: 将目标 HLS 流拉取过来，作为媒体源在 Monibuca 内以指定流路径的形式存在。
- **参数**:

| 参数名     | 必填 | 类型   | 描述                                                     |
| ---------- | ---- | ------ | -------------------------------------------------------- |
| streamPath | 是   | string | 指定在 Monibuca 内的流路径，例如 `live/hls`              |
| target     | 是   | string | 指定目标 HLS 流的 URL，例如 `http://localhost/abc.m3uo8` |

- **示例**:
  - `/hls/api/pull?streamPath=live/hls&target=http://localhost/abc.m3u8`
