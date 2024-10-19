### 获取所有 HDL 流

- **URL**: `/hdl/api/list`
- **请求方式**: GET
- **描述**: 获取所有 HDL 流的列表
- **返回**: 所有 HDL 流的列表

### 从 m7s 拉取 http-flv 协议流

- **描述**: 如果 m7s 中已经存在 live/test 流的话就可以用 http-flv 协议进行播放 如果监听端口不配置则公用全局的 HTTP 端口(默认 8080)
- **示例**:
  - `ffplay http://localhost:8080/hdl/live/test.flv`

### m7s 从远程拉取 http-flv 协议流

- **URL**: `/hdl/api/pull`
- **请求方式**: GET
- **描述**: 从远程拉取 http-flv 协议流
- **参数**:

| 参数名     | 必填 | 类型   | 描述                                                            |
| ---------- | ---- | ------ | --------------------------------------------------------------- |
| target     | 是   | string | HTTP-FLV 地址，需要进行 urlencode 以防止特殊字符影响解析        |
| streamPath | 是   | string | 流标识，用于标识特定的流                                        |
| save       | 是   | int    | 保存选项：0、不保存；1、保存到 pullonstart；2、保存到 pullonsub |

- **示例**:
  - `/hdl/api/pull?target=[HTTP-FLV地址]&streamPath=[流标识]&save=[0|1|2]`
