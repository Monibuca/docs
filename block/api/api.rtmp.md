### 获取所有 RTMP 流

- **URL**: `/rtmp/api/list`
- **请求方式**: GET
- **描述**: 获取所有 RTMP 流的列表
- **返回**: 所有 RTMP 流的列表

### 从远程拉取 RTMP 流到 m7s 中

- **URL**: `rtmp/api/pull`
- **请求方式**: GET
- **参数**:

| 参数名     | 必填 | 类型   | 描述                                                            |
| ---------- | ---- | ------ | --------------------------------------------------------------- |
| target     | 是   | string | 远程 RTMP 地址，需要进行 urlencode 以防止特殊字符影响解析       |
| streamPath | 是   | string | 流标识，用于标识特定的流                                        |
| save       | 是   | int    | 保存选项：0、不保存；1、保存到 pullonstart；2、保存到 pullonsub |

- **示例**:
  - `rtmp/api/pull?target=[RTMP 地址]&streamPath=[流标识]&save=[0|1|2]`
