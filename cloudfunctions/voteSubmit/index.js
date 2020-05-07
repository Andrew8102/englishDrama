// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()

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

exports.main = async(event, context) => {
  try {
    let d = new Date().Format("yyyy-MM-dd hh:mm:ss")
    return await db.collection('eventVote').add({
      // data 字段表示需新增的 JSON 数据
      data: {
        event_id: event.event_id,
        school_id: event.college_id,
        mark: event.mark,
        school: event.school,
        title: event.title,
        voter_openid: event.voter_openid,
        nickName: event.nickName,
        datetime: d,
        truename:event.truename,
        userSchool:event.userSchool,
        event_name:event.event_name
      }
    })
  } catch (e) {
    console.error(e)
  }
}