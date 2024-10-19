### 接收 PS 流

- **URL**: `/ps/api/receive`
- **请求方式**: GET
- **参数**:

| 参数名     | 必填 | 类型   | 描述                                                                                                                                                                                       |
| ---------- | ---- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| streamPath | 是   | string | 流标识，用于标识特定的流                                                                                                                                                                   |
| ssrc       | 是   | string | 设备发送的 ssrc                                                                                                                                                                            |
| port       | 是   | string | 端口号                                                                                                                                                                                     |
| reuse      | 否   | int    | 是否端口复用，1 表示复用，0 表示不复用。如果使用端口复用，请务必确定设备发送的 ssrc 和 ssrc 参数一致，否则会出现混流的情况                                                                 |
| dump       | 是   | string | 是否 dump 到文件，如果 dump 到文件，会在当前目录下生成一个以 dump 为名的文件夹，文件夹下面是以 streamPath 参数值为名的文件，文件内容从端口收到的数据[4byte 内容长度][2byte 相对时间][内容] |

- **示例**:
  - `/ps/api/receive?streamPath=xxx&ssrc=xxx&port=xxx&reuse=1&dump=xxx`

### 回放 PS 的 dump 文件

- **URL**: `/ps/api/replay`
- **请求方式**: GET
- **参数**:

| 参数名     | 必填 | 类型   | 描述                                                                                                               |
| ---------- | ---- | ------ | ------------------------------------------------------------------------------------------------------------------ |
| streamPath | 是   | string | 代表回放时生成的视频流的 streamPath, 默认是 replay/dump/ps (如果 dump 传了 abc, 那么 streamPath 默认是 replay/abc) |
| dump       | 是   | string | dump 代表需要回放的文件，默认是 dump/ps                                                                            |

- **示例**:
  - `/ps/api/replay?streamPath=xxx&dump=xxx`


### 以 ws 协议读取 PS 流

- **URL**: `ws://[host]/ps/[streamPath]`
- **描述**: 数据包含的是裸的 PS 数据，不包含 rtp 头
- **示例**:
  - `ws://localhost:8080/ps/live/test`