module demo

go 1.16

replace (
	github.com/Monibuca/engine/v3 => ../engine
	github.com/Monibuca/plugin-gateway/v3 => ../plugin-gateway
	github.com/Monibuca/plugin-gb28181/v3 => ../plugin-gb28181
	github.com/Monibuca/plugin-hdl/v3 => ../plugin-hdl
	github.com/Monibuca/plugin-hls/v3 => ../plugin-hls
	github.com/Monibuca/plugin-jessica/v3 => ../plugin-jessica
	github.com/Monibuca/plugin-record/v3 => ../plugin-record
	github.com/Monibuca/plugin-rtmp/v3 => ../plugin-rtmp
	github.com/Monibuca/plugin-rtsp/v3 => ../plugin-rtsp
	github.com/Monibuca/plugin-summary => ../plugin-summary
	github.com/Monibuca/plugin-ts/v3 => ../plugin-ts
	github.com/Monibuca/plugin-webrtc/v3 => ../plugin-webrtc
	github.com/Monibuca/utils/v3 => ../utils
)

// replace github.com/Monibuca/plugin-ffmpeg => ../plugin-ffmpeg

// replace github.com/Monibuca/plugin-logrotate/v3 => ../plugin-logrotate

require (
	github.com/Monibuca/engine/v3 v3.0.0
	github.com/Monibuca/plugin-gateway/v3 v3.0.0-20210616163424-37db18ab9df2
	github.com/Monibuca/plugin-gb28181/v3 v3.0.0-20210626055056-51d8a8fa91cb
	github.com/Monibuca/plugin-hdl/v3 v3.0.0-20210615000534-c2fce27753fb
	github.com/Monibuca/plugin-hls/v3 v3.0.0-20210615000624-9d962270da28
	github.com/Monibuca/plugin-jessica/v3 v3.0.0-20210615000517-d850678d9886
	github.com/Monibuca/plugin-logrotate/v3 v3.0.0-20210306092538-eb6c45576107
	github.com/Monibuca/plugin-record/v3 v3.0.0-20210624074443-ead7f0ac39c8
	github.com/Monibuca/plugin-rtmp/v3 v3.0.0-20210620133342-cb2ee86b6808
	github.com/Monibuca/plugin-rtsp/v3 v3.0.0-20210624092920-ba9f39853fc3
	github.com/Monibuca/plugin-summary v0.0.0-20210615000407-2786546820de
	github.com/Monibuca/plugin-webrtc/v3 v3.0.0-20210615000306-3cd1bac6d63d
	golang.org/x/sync v0.0.0-20210220032951-036812b2e83c // indirect
)
