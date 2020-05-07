// 云函数入口文件
const cloud = require('wx-server-sdk')
//json2csv
// const {
//   Parser
// } = require('json2csv')

//node-xlsx
const xlsx = require('node-xlsx');

//废弃的csv
// const fields = [
//   '_id',
//   'event_id',
//   'school',
//   'title',
//   'mark',
//   'nickName',
//   'voter_openid',
//   'datetime'
// ]
// const opts = {
//   fields
// }

//日期格式化
Date.prototype.Format = function(fmt) {
  var o = {
    "M+": this.getMonth() + 1,
    "d+": this.getDate(),
    "h+": this.getHours()+8,
    "m+": this.getMinutes(),
    "s+": this.getSeconds(),
    "q+": Math.floor((this.getMonth() + 3) / 3),
    "S": this.getMilliseconds()
  };
  if (/(y+)/.test(fmt))
    fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
  for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt))
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
  return fmt;
}

cloud.init()
const db = cloud.database()
const MAX_LIMIT = 100

//引入发送邮件的类库
var nodemailer = require('nodemailer')
// 创建一个SMTP客户端配置
var config = {
  host: 'smtp.163.com', //网易163邮箱 smtp.163.com
  port: 465, //网易邮箱端口 25
  auth: {
    user: 'XXXX@163.com', //邮箱账号
    pass: 'XXXX' //邮箱的授权码
  }
}
// 创建一个SMTP客户端对象
var transporter = nodemailer.createTransport(config)
// 云函数入口函数
exports.main = async(event, context) => {
  var email_address = event.email_address

  //取集合所有数据，突破一次100条的限制
  const countResult = await db.collection('eventVote').count()
  const total = countResult.total
  // 计算需分几次取
  const batchTimes = Math.ceil(total / 100)
  // 承载所有读操作的 promise 的数组
  const tasks = []
  for (let i = 0; i < batchTimes; i++) {
    const promise = db.collection('eventVote').skip(i * MAX_LIMIT).limit(MAX_LIMIT).get()
    tasks.push(promise)
  }
  // 等待所有
  var myData = (await Promise.all(tasks)).reduce((acc, cur) => {
    return {
      data: acc.data.concat(cur.data),
      errMsg: acc.errMsg,
    }
  })

  // 一次只能取100条数据，对于更多的数据集合需要用上面的方法
  // try {
  //   var myData = await db
  //     .collection('eventVote')
  //     .orderBy('datetime', 'desc')
  //     .orderBy('event_id', 'desc')
  //     .orderBy('school', 'desc')
  //     .orderBy('title', 'desc')
  //     .get()
  //   //console.log(JSON.stringify(myData))
  // } catch (err) {
  //   console.error(err)
  // }


  try {
    let userdata = myData.data
    let d = new Date().Format("yyyyMMddhhmmss")
    //1,定义excel表格名
    let dataCVS = 'excel/result' + d + '.xlsx'
    //2，定义存储数据的
    let alldata = [];
    let row = [
      '_id唯一序号',
      'event_id活动id',
      'event_name活动名称',
      'school学院',
      'title标题',
      'mark评委打分',
      'nickName评委微信昵称',
      'voter_openid评委微信唯一id',
      'datetime提交时间',
      'truename提交者真实姓名',
      'userSchool提交者所在学院'
    ]; //表属性
    alldata.push(row);
    for (let key in userdata) {
      let arr = [];
      arr.push(userdata[key]._id);
      arr.push(userdata[key].event_id);
      arr.push(userdata[key].event_name);
      arr.push(userdata[key].school);
      arr.push(userdata[key].title);
      arr.push(userdata[key].mark);
      arr.push(userdata[key].nickName);
      arr.push(userdata[key].voter_openid);
      arr.push(userdata[key].datetime);
      arr.push(userdata[key].truename);
      arr.push(userdata[key].userSchool);
      alldata.push(arr)
    }
    //console.log(alldata)
    //3，把数据保存到excel里
    var buffer = await xlsx.build([{
      name: "投票数据",
      data: alldata
    }]);
    //4，把excel文件保存到云存储里
    var fileres = await cloud.uploadFile({
      cloudPath: dataCVS,
      fileContent: buffer, //excel二进制文件
    })
  } catch (e) {
    console.error(e)
    return e
  }
  //console.log(fileres)
  //获取真实的下载地址
  const fileUrl = [fileres.fileID]
  const result = await cloud.getTempFileURL({
    fileList: fileUrl,
  })
  var downloadUrl = result.fileList[0].tempFileURL
  console.log(result.fileList)

  //废弃的csv
  // const json2csvParser = new Parser({
  //   fields
  // })
  // const csv = await json2csvParser.parse(myData.data)
  // console.log(myData)
  // console.log(myData.data)
  // console.log(csv)
  // 创建一个邮件对象
  var htmltext =
    '<p>您好，您的投票数据已经导出</p> <p>请点击下方链接下载excel文件</p> <p>字段说明：</p> <figure><table><thead><tr><th>字段名称</th><th>字段说明</th></tr></thead><tbody><tr><td>_id</td><td>本投票唯一编号</td></tr><tr><td>event_id</td><td>活动编号</td></tr><tr><td>event_name</td><td>活动名称</td></tr><tr><td>school</td><td>学院名</td></tr><tr><td>title</td><td>团队演出标题</td></tr><tr><td>mark</td><td>投票的打分</td></tr><tr><td>nickName</td><td>提交者的微信昵称</td></tr><tr><td>voter_openid</td><td>提交者微信唯一识别号</td></tr><tr><td>datetime</td><td>提交者提交投票时间</td></tr><tr><td>truename</td><td>提交者真实姓名</td></tr><tr><td>userSchool</td><td>提交者所在学院</td></tr></tbody></table></figure> <p>投票数据（请点击下载）：</p>' +
    downloadUrl
  console.log(htmltext)
  var mail = {
    // 发件人
    from: '新英投票系统 <XXXX@163.com>',
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
