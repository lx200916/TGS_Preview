<p align="center">
<img src="https://i.loli.net/2021/09/25/Q3WA54ifBLp8GTe.gif" style="width:64px"/>
</p>

<div align="center">

# TGS Previewer

配合 `Telegram` 消息转发机器人使用的 `Sticker Preview` 方案,搭建于 `Cloudflare Workers`.
</div>


----

## 🙌 开始
在 `wrangler.example.toml` 中写入相关信息,将`Bot`变量更改为`Bot Token`,并改名为`wrangler.toml`.

发布Worker
```shell
wrangler publish
```

当`Bot`获取到某个Sticker的`file_id`时,请生成以下格式URL:
```
https://${CF_WORKER_CUSTOM_DOMAIN}/${file_id}/preview
```
当用户访问此URL时,前端会渲染并展示相应的Sticker.
> 贴纸对应的Sticker元数据可以缓存在`Cloudflare Cache`约1h,因此一般不会造成Telegram API 速率问题.

## ⭐️ 用途
本项目用于在无法渲染Lottie的平台上提供一种较简易的公共预览方式.如
* 转发Telegram Sticker消息到QQ/钉钉/IRC等其他聊天工具.

## 🤯 免责
* 本项目的Bot Token仅用于下载Sticker tgs 文件数据,不会造成隐私泄露.
* `.tgs`文件数据的拉取和缓存均由Cloudflare完成,API Token不会暴露到前端用户.
* 若用于QQ机器人,请注意腾讯已屏蔽 `*.workers.dev`,请自行申请域名使用,并联系腾讯进行审核.