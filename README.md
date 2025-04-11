# VUP Homepage

这是一个强大的虚拟主播个人主页系统前端页面，目前用于 阿音Ayln 的歌单网站。

![image](https://github.com/user-attachments/assets/744cc3bf-f6bc-48ef-8e45-08e48c8e07a8)

Deploy

基于 `yarn` 进行构建：

```
yarn install
```

若要进行 `prod` 模式构建，则需设置环境变量 `NODE_ENV` 为 `production`。

注意，此时使用的配置文件为 `src/config/config.prod.js`，请确保该文件设置正确。

```
yarn build
```

# Develop

> 后端暂未开源，如果你需要自行搭建，请你自行制作一个符合如下标准的后端：

### 1. SongAPI

`/getSongNum`

> 获取歌曲数目

示例返回

```json
{
    "code": 200,
    "msg": null,
    "data": 1003
}
```

`/getSongList`

> 获取歌曲列表

参数

`songType`: 歌曲类型

`language`: 歌曲语言

`songName`: 歌曲名称

`id`: id字段（唯一标识符）

`pageNum`：分段请求总数

`pageNum`：分段请求段大小

示例返回：

```json
{ 
    "code": 200,
    "msg": null,
    "data": {
        "total": 1,
        "list": [
            {
                "createByName": null,
                "createDeptName": null,
                "importErrInfo": null,
                "id": <id字段>,
                "searchValue": null,
                "createBy": null,
                "createDept": null,
                "createTime": null,
                "updateBy": null,
                "updateTime": null,
                "updateIp": null,
                "remark": null,
                "version": null,
                "delFlag": "0",
                "handleType": null,
                "params": {},
                "songName": "歌曲名称",
                "songType": "歌曲风格",
                "songOwner": "歌曲作者",
                "songIde": null,
                "remarks": null,
                "songNum": null,
                "songNew": true,
                "isSuper": "0",
                "language": "歌曲语言",
                "info": null,
                "recordLog": true
            }
	]
}
```

`/getRandomSong`

> 获取随机歌曲

示例返回：

```json
{
    "code": 200,
    "msg": null,
    "data": {
        "createByName": null,
        "createDeptName": null,
        "importErrInfo": null,
        "id": <id字段>,
        "searchValue": null,
        "createBy": null,
        "createDept": null,
        "createTime": null,
        "updateBy": null,
        "updateTime": null,
        "updateIp": null,
        "remark": null,
        "version": null,
        "delFlag": "0",
        "handleType": null,
        "params": {},
        "songName": "歌曲名称",
        "songType": "歌曲风格",
        "songOwner": "歌曲作者",
        "songIde": null,
        "remarks": null,
        "songNum": null,
        "songNew": false,
        "isSuper": null,
        "language": "歌曲语言",
        "info": null,
        "recordLog": true
    }
}
```

`/getSuper`

> 获取高级歌曲（一般是付费歌曲）

这个结构属于非标准接口，应当集成到getSongList中，通过isSuper参数请求获取。

但是未来兼容《雪域provealms》的API，因此留了此接口。

## 2.BilibiliAPI

你需要直接反代 `api.live.bilibili.com` 到 `/api/bilibili/`下。你可以直接选择使用 `Nginx` 反代：

```nginx
location /api/bilibili/ {
  proxy_pass https://api.live.bilibili.com/;
  proxy_set_header Host api.live.bilibili.com;
  proxy_set_header Referer https://live.bilibili.com;
  proxy_set_header Origin https://live.bilibili.com;
  proxy_set_header User-Agent "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0 Safari/537.36";
  
  proxy_set_header Accept-Encoding "";
  proxy_hide_header Access-Control-Allow-Origin;
  add_header Access-Control-Allow-Origin * always;
  add_header Access-Control-Allow-Methods "GET, POST, OPTIONS" always;
  add_header Access-Control-Allow-Headers "*" always;
}
```
