# 苏大科协新生英语短剧大赛投票系统

支持自定义投票，支持自定义评分规则，支持快速统计评分、支持数据导出到邮箱
完全免费，使用云开发环境提供后台服务，无需挂载服务器，也就是说，装备不花一分钱

## 当前版本

Version 1.1.0

### 更新日志

2019.11.7 1.1.0 新增数据管理功能，可直接通过小程序将数据邮件推送到指定电子邮箱账户，感谢 Node
2019.11.7 新增 GPL 证书，去除了不需要的文件，添加投票字段时间，修改投票逻辑避免重复投票，修改联系人邮箱，版本 1.0.1
2019.11.6 初始化版本，放入模拟数据便于测试，长按关于内的链接可清除缓存重新评分

## 如何使用

1. 下载之后更改自己的 appid
2. 创建云开发环境，并更换自己的环境
3. 分别创建 活动列表 eventList、队伍列表 eventCollege、投票规则 eventRule、以及投票者信息表 enentVote，导入数据
4. 修改 app.js 中的后台登录密码，修改云函数 sendMail 中的发送配置文件
5. 即可开始使用

## 数据格式

eventList 表

```json
{
  "name": "第20届新生英语短剧大赛决赛",
  "date": "2019年11月22日",
  "event_id": 2,
  "location": "苏州大学存菊堂",
  "picture": "https://moechu.cn/usr/uploads/2019/10/2135419809.jpg",
  "password": 1234
}
{
  "name": "第20届新生英语短剧大赛半决赛",
  "date": "2019年11月11日",
  "location": "苏州大学进贤堂",
  "picture": "https://moechu.cn/usr/uploads/2019/11/906212061.jpg",
  "password": 1234,
  "event_id": 1
}
```

eventCollege

```json
{
    "event_id":1,
    "college_id": 1,
    "title": "天气之子",
    "school": "东吴商学院",
    "image": "https://moechu.cn/usr/uploads/2019/11/906212061.jpg"
} {
    "event_id":1,
    "college_id": 2,
    "title": "天野阳菜粉丝会",
    "school": "体育学院",
    "image": "https://moechu.cn/usr/uploads/2019/11/906212061.jpg"
} {
    "event_id":1,
    "college_id": 3,
    "title": "你的名字是宫本茂",
    "school": "电子信息学院",
    "image": "https://moechu.cn/usr/uploads/2019/11/906212061.jpg"
} {
    "event_id":1,
    "college_id": 4,
    "title": "新海诚好棒",
    "school": "王建法学院",
    "image": "https://moechu.cn/usr/uploads/2019/11/906212061.jpg"
} {
    "event_id":1,
    "college_id": 5,
    "title": "Radwimps",
    "school": "音乐学院",
    "image": "https://moechu.cn/usr/uploads/2019/11/906212061.jpg"
} {
    "event_id":2,
    "college_id": 1,
    "title": "天气之子",
    "school": "东吴商学院",
    "image": "https://moechu.cn/usr/uploads/2019/11/906212061.jpg"
} {
    "event_id":2,
    "college_id": 2,
    "title": "天野阳菜粉丝会",
    "school": "体育学院",
    "image": "https://moechu.cn/usr/uploads/2019/11/906212061.jpg"
} {
    "event_id":2,
    "college_id": 3,
    "title": "你的名字是宫本茂",
    "school": "电子信息学院",
    "image": "https://moechu.cn/usr/uploads/2019/11/906212061.jpg"
} {
    "event_id":2,
    "college_id": 4,
    "title": "新海诚好棒",
    "school": "王建法学院",
    "image": "https://moechu.cn/usr/uploads/2019/11/906212061.jpg"
} {
    "event_id":2,
    "college_id": 5,
    "title": "Radwimps",
    "school": "音乐学院",
    "image": "https://moechu.cn/usr/uploads/2019/11/906212061.jpg"
}
```

eventRule

```json
{
  "event_id": 1,
  "rule": [{
      "id": 1,
      "title": "主题与内容（25分）",
      "msg": [{
          "sub_id": 1,
          "title": "主题明确（10分）",
          "max": 10
        },
        {
          "sub_id": 2,
          "title": "内容完整创新（15分）",
          "max": 15
        }
      ]

    },
    {
      "id": 2,
      "title": "服装道具（25分）",
      "msg": [{
          "sub_id": 1,
          "title": "服装道具符合主题（8分）",
          "max": 8
        },
        {
          "sub_id": 2,
          "title": "服装道具精致，有新意（9分）",
          "max": 9
        }, {
          "sub_id": 3,
          "title": "服装搭配恰当，视觉效果好（8分）",
          "max": 8
        }
      ]
    },
    {
      "id": 3,
      "title": "表演表达能力（25分）",
      "msg": [{
          "sub_id": 1,
          "title": "情绪表现、面部表情丰富（9分）",
          "max": 9
        },
        {
          "sub_id": 2,
          "title": "台词与肢体动作配合较好（7分）",
          "max": 7
        }, {
          "sub_id": 3,
          "title": "语音语调标准，情感丰富，语言流畅（9分）",
          "max": 9
        }
      ]
    },
    {
      "id": 4,
      "title": "整体表现（25分）",
      "msg": [{
          "sub_id": 1,
          "title": "团队配合度高，剧情完整，节目流畅（15分）",
          "max": 15
        },
        {
          "sub_id": 2,
          "title": "PPT贴合主题，音频清晰，中英字幕清楚（10分）",
          "max": 10
        }
      ]
    }
  ]
}
{
  "event_id": 2,
  "rule": [{
      "id": 1,
      "title": "主题与内容（15分）",
      "msg": [{
          "sub_id": 1,
          "title": "主题明确（7分）",
          "max": 7
        },
        {
          "sub_id": 2,
          "title": "内容完整创新（8分）",
          "max": 8
        }
      ]

    },
    {
      "id": 2,
      "title": "语音语调（15分）",
      "msg": [{
          "sub_id": 1,
          "title": "语音语调标准（5分）",
          "max": 5
        },
        {
          "sub_id": 2,
          "title": "语音情感丰富（5分）",
          "max": 5
        }, {
          "sub_id": 3,
          "title": "语言流畅度（5分）",
          "max": 5
        }
      ]
    },
    {
      "id": 3,
      "title": "服装道具（15分）",
      "msg": [{
          "sub_id": 1,
          "title": "服装道具符合主题（5分）",
          "max": 5
        },
        {
          "sub_id": 2,
          "title": "服装道具精致，有新意（5分）",
          "max": 5
        }, {
          "sub_id": 3,
          "title": "服装搭配恰当，视觉效果好（5分）",
          "max": 5
        }
      ]
    },
    {
      "id": 4,
      "title": "表演表达能力（25分）",
      "msg": [{
          "sub_id": 1,
          "title": "情绪表现、面部表情丰富（15分）",
          "max": 15
        },
        {
          "sub_id": 2,
          "title": "台词与肢体动作配合较高（10分）",
          "max": 10
        }
      ]
    },
    {
      "id": 5,
      "title": "PPT（5分）",
      "msg": [{
        "sub_id": 1,
        "title": "背景贴近主题且符合演员表演空间，音频清晰，中英字幕清楚（5分）",
        "max": 5
      }]
    },
    {
      "id": 6,
      "title": "整体表现（25分）",
      "msg": [{
          "sub_id": 1,
          "title": "团队配合度高（7分）",
          "max": 7
        },
        {
          "sub_id": 2,
          "title": "节目流畅度好（6分）",
          "max": 6
        },
        {
          "sub_id": 3,
          "title": "剧情完整（6分）",
          "max": 6
        },
        {
          "sub_id": 4,
          "title": "观众反应强烈（6分）",
          "max": 6
        }
      ]
    }
  ]
}
```

## 修改 app.js 中的后台登录密码

修改 `app.js` 中的 `globalData`，此处的 `username` 和 `password` 为个人中心数据管理模块的登陆信息

## 修改云函数 sendMail 中的发送配置文件

1. 修改 `index.js` 中的发送邮箱的信息
   注意一定要在邮箱客户端内打开 smtp 服务，否则会报错
   `pass` 填写的是邮箱授权码，而非邮箱密码

```js
var config = {
  host: 'smtp.163.com', //网易163邮箱 smtp.163.com
  port: 465, //网易邮箱非ssl发送端口 25
  auth: {
    user: 'xxxxx@163.com', //修改成你的邮箱账号
    pass: 'xxxxxx' //填写邮箱的授权码
  }
}
```

然后可以自行修改 html 邮件的内容

2.如果本地想调试使用，记得先安装 `node` 以及 `node_modules`
在`terminal` 或者 `cmd` 中安装

```bash
cd cloudfunctions/sendMail
npm install
```

## 使用开源项目

Vant weapp 有赞 UI

# 云开发 quickstart

这是云开发的快速启动指引，其中演示了如何上手使用云开发的三大基础能力：

- 数据库：一个既可在小程序前端操作，也能在云函数中读写的 JSON 文档型数据库
- 文件存储：在小程序前端直接上传/下载云端文件，在云开发控制台可视化管理
- 云函数：在云端运行的代码，微信私有协议天然鉴权，开发者只需编写业务逻辑代码

## 参考文档

- [云开发文档](https://developers.weixin.qq.com/miniprogram/dev/wxcloud/basis/getting-started.html)
