# 推流问题


- ffmpeg推流是请加-c:v h264 -c:a aac 否则推出的视频格式无法使用
- StreamPath 必须形如 live/test 。不能只有一级，或者斜杠开头，如/live 是错误的。
