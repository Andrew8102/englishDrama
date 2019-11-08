// 云函数入口文件
const cloud = require('wx-server-sdk')
//json2csv
const { Parser } = require('json2csv')
const fields = [
  '_id',
  'event_id',
  'school',
  'title',
  'mark',
  'nickName',
  'voter_openid',
  'datetime'
]
const opts = {
  fields
}

cloud.init()
const db = cloud.database()

//引入发送邮件的类库
var nodemailer = require('nodemailer')
// 创建一个SMTP客户端配置
var config = {
  host: 'smtp.163.com', //网易163邮箱 smtp.163.com
  port: 465, //网易邮箱端口 25
  auth: {
    user: 'xxx@163.com', //邮箱账号
    pass: 'xxx' //邮箱的授权码
  }
}
// 创建一个SMTP客户端对象
var transporter = nodemailer.createTransport(config)
// 云函数入口函数
exports.main = async (event, context) => {
  var email_address = event.email_address
  try {
    var myData = await db
      .collection('eventVote')
      .orderBy('datetime', 'desc')
      .orderBy('event_id', 'desc')
      .orderBy('school', 'desc')
      .orderBy('title', 'desc')
      .get()
    //console.log(JSON.stringify(myData))
  } catch (err) {
    console.error(err)
  }

  const json2csvParser = new Parser({
    fields
  })
  const csv = await json2csvParser.parse(myData.data)
  // console.log(myData)
  // console.log(myData.data)
  // console.log(csv)
  // 创建一个邮件对象
  var htmltext =
    '<p>您好，您的投票数据已经导出</p> <p>请复制下面的csv数据文件到记事本内，保存成csv文件，再使用excel导入即可</p> <p>字段说明：</p> <figure><table><thead><tr><th>字段名称</th><th>字段说明</th></tr></thead><tbody><tr><td>_id</td><td>本投票唯一编号</td></tr><tr><td>event_id</td><td>活动编号</td></tr><tr><td>school</td><td>学院名</td></tr><tr><td>title</td><td>团队演出标题</td></tr><tr><td>mark</td><td>投票的打分</td></tr><tr><td>nickName</td><td>提交者的微信昵称</td></tr><tr><td>voter_openid</td><td>提交者微信唯一识别号</td></tr><tr><td>datetime</td><td>提交者提交投票时间</td></tr></tbody></table></figure> <p>投票数据（请保存为csv格式）：</p><PRE>' +
    csv +
    '</PRE>'
  //console.log(htmltext)
  var mail = {
    // 发件人
    from: '新英投票系统 <xxx@163.com>',
    // 主题
    subject: '投票评分数据',
    // 收件人
    to: email_address,
    // 邮件内容，text或者html格式
    html: htmltext //可以是链接，也可以是验证码
  }

  let res = await transporter.sendMail(mail)
  return res
}
