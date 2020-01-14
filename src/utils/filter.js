// 字符省略
let ellipsis = (value, len) => {
  if (!len) {
    len = 20;
  }
  if (!value) return '';
  if (value.length > len) {
    return value.slice(0, len) + '...'
  }
  return value
};

// 将秒转换成分钟
let formatSeconds = (s) => {

  if (!s) {
    return '';
  }
  //计算分钟
  //算法：将秒数除以60，然后下舍入，既得到分钟数
  var h;
  h = Math.floor(s / 60);
  //计算秒
  //算法：取得秒%60的余数，既得到秒数
  s = s % 60;
  //将变量转换为字符串
  h += '';
  s += '';
  //如果只有一位数，前面增加一个0
  // h = (h.length == 1) ? '0' + h : h;
  s = (s.length == 1) ? '0' + s : s;
  return h + ':' + s;
};

// 时间戳转换为yyyyMMdd
let generateTimeReqestNumber = (data=new Date(),type) => {
  // var date = new Date()
  let d = data
  if(type==='MMdd') {
    return pad2(d.getMonth() + 1) + '-' + pad2(d.getDate())
  }else {
    return d.getFullYear().toString() + '-' + pad2(d.getMonth() + 1) + '-' + pad2(d.getDate())
  }
}
let pad2 = (n) => {
  return n < 10 ? '0' + n : n
}

// 时间戳转换为yyyyMMddhhmmss
let fillZero = (n) => {
  let result = (n).toString().length === 1 ? ('0' + n): n;
  return result;
}
let formatTime = (t = new Date()) => {
  let d = new Date(t);
  let year = d.getFullYear();
  let month = d.getMonth() + 1;
  let date = d.getDate();
  let hours = d.getHours();
  let minutes = d.getMinutes();
  let seconds = d.getSeconds();
  let result = `${year}-${fillZero(month)}-${fillZero(date)} ${fillZero(hours)}:${fillZero(minutes)}:${fillZero(seconds)}`;
  return result;
}
// 秒数转换为时分秒
const formathms = time => {
  var min=Math.floor(time%3600);
  const hour = Math.floor(time/3600)>=10?Math.floor(time/3600):('0' + Math.floor(time/3600))
  const minutes = Math.floor(min/60)>=10?Math.floor(min/60):('0' + Math.floor(min/60))
  const second = time%60>=10?time%60:('0' + time%60)
 return hour + ":" + minutes + ":"+ second
}
let getStudentName = (accountNo,classId) => {
  if(accountNo === JSON.parse(localStorage.userInfo).accountNo) {
    return JSON.parse(localStorage.userInfo).userName
  }
  if (!classId || !accountNo){
    return "--"
  }
  let key = "classStudent_" + classId
  if (localStorage.getItem(key)) {
    let student = JSON.parse(localStorage.getItem(key))[accountNo]
    if (student){
      return student.studentName
    } else{
      return '--'
    }


  } else {
    return "--"
  }
};
let getGradeName = (grade)=>{
  let gradeName = "其他"
  switch (grade) {
    case 'G01':
      gradeName = "一年级"
      break
    case 'G02':
      gradeName = "二年级"
      break
    case 'G03':
      gradeName = "三年级"
      break
    case 'G04':
      gradeName = "四年级"
      break
    case 'G05':
      gradeName = "五年级"
      break
    case 'G06':
      gradeName = "六年级"
      break
    case 'G07':
      gradeName = "初一"
      break
    case 'G08':
      gradeName = "初二"
      break
    case 'G09':
      gradeName = "初三"
      break
    case 'G10':
      gradeName = "高一"
      break
    case 'G11':
      gradeName = "高二"
      break
    case 'G12':
      gradeName = "高三"
      break
  }
  return gradeName
}
let getSubjectName = (subjectType)=>{
  let subjectName = "其他"
  switch (subjectType) {
    case 'S01':
      subjectName = "语文"
      break
    case 'S02':
      subjectName = "数学"
      break
    case 'S03':
      subjectName = "英语"
      break
    case 'S04':
      subjectName = "物理"
      break
    case 'S05':
      subjectName = "化学"
      break
    case 'S06':
      subjectName = "政治"
      break
    case 'S07':
      subjectName = "历史"
      break
    case 'S08':
      subjectName = "生物"
      break
    case 'S09':
      subjectName = "地理"
      break
    case 'S19':
      subjectName = "体育"
      break
    case 'S20':
      subjectName = "家庭教育"
      break
    case 'S21':
      subjectName = "教育学习"
      break
    case 'S22':
      subjectName = "名著导读"
      break
    case 'S23':
      subjectName = "在线家课"
      break
  }
  return subjectName
}
let getTermName = (type) => {
  if (type == "T01") {
    return "上学期"
  } else if (type=="T02"){
    return "下学期"
  } else {
    return ""
  }
}
let dealType =(val1,val2)=>{
  if (val1 == null || val1 == undefined) {
    return ''
  } else {
    if (val2[val1]) {
      return val2[val1]
    } else {
      return ''
    }
  }
  console.log(val1, val2)
}
let randomString = (len) => {
  len = len || 32
  var $chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890'
  var maxPos = $chars.length
  var pwd = ''
  for ( let i = 0; i < len; i++) {
    pwd += $chars.charAt(Math.floor(Math.random() * maxPos))
  }
  return pwd
}

const numToWord = section => {
  const temp = section
  var chnNumChar = ["零","一","二","三","四","五","六","七","八","九"];
  var chnUnitChar = ["","十","百","千"];
  var strIns = '', chnStr = '';
  var unitPos = 0;
  var zero = true;
  while(section > 0){
    var v = section % 10;
    if(v === 0){
      if(!zero){
        zero = true;
        chnStr = chnNumChar[v] + chnStr;
      }
    }else{
      zero = false;
      strIns = chnNumChar[v];
      strIns += chnUnitChar[unitPos];
      chnStr = strIns + chnStr;
    }
    unitPos++;
    section = Math.floor(section / 10);
  }
  if(temp > 9 && temp < 20) {
    chnStr = chnStr.substr(1)
  }
  return chnStr;
}
const mutualType = type => {
  let value = ''
  switch (type) {
    case 'O01':
      value = "点名"
      break
    case 'O02':
      value = "抢答"
      break
    case 'O03':
      value = "全班白板"
      break
    case 'O04':
      value = "小组白板"
      break
    case 'O05':
      value = "全班互批"
      break
    case 'O06':
      value = "小组互批"
      break
    case 'O07':
      value = "白板任务结束"
      break
    case 'O08':
      value = "奖励"
      break
    case 'O09':
      value = "减分"
      break
    case 'O10':
      value = "推试卷"
      break
    case 'O11':
      value = "推试题"
      break
    case 'O12':
      value = "推送范例"
      break
    case 'O13':
      value = "计时"
      break
    case 'O14':
      value = "推屏"
      break
    case 'O15':
      value = "推屏结束"
      break
    case 'O16':
      value = "投屏"
      break
    case 'O17':
      value = "投屏结束"
      break
    case 'O18':
      value = "投票"
      break
    case 'O19':
      value = "锁屏"
      break
    case 'O20':
      value = "锁屏结束"
      break
    case 'O21':
      value = "涂鸦"
      break
    case 'O22':
      value = "截屏白板"
      break
    case 'O23':
      value = "查看"
      break
    case 'O24':
      value = "题型"
      break
  }
  return value
}

const getTaskTypeName = (tType) => {
  var task_name = "";
  if (tType == "T01") {
    task_name = "微课试卷";
  } else if (tType == "T02") {
    task_name = "微课心得";
  } else if (tType == "T03") {
    task_name = "测试";
  } else if (tType == "T04") {
    task_name = "学资源";
  } else if (tType == "T05") {
    task_name = "自测";
  } else if (tType == "T06") {
    task_name = "讨论";
  } else if (tType == "T07") {
    task_name = "直播课";
  } else if (tType == "T08") {
    task_name = "做题";
  } else if (tType == "T09") {
    task_name = "白板";
  } else if (tType == "T10") {
    task_name = "堂测";
  } else if (tType == "T11") {
    task_name = "自主学习";
  } else if (tType == 'T13') {
    task_name = "口语评测";
  } else if (tType == 'T14') {
    task_name = "游戏关卡";
  } else if (tType == 'T15') {
    task_name = "关卡口语评测";
  } else if (tType == 'T16') {
    task_name = "练习测试";
  } else if (tType == 'T17') {
    task_name = "真题试卷";
  } else if (tType == 'T18') {
    task_name = "组卷测试";
  } else {
    task_name = "其他";
  }
  return task_name;
}

// 下划线转换驼峰
const toHump = (name) => {
  return name.replace(/\_(\w)/g, (all, letter) => {
    return letter.toUpperCase();
  });
}

const getFontSize = (res) => {
  let clientWidth = window.innerWidth||document.documentElement.clientWidth||document.body.clientWidth;
  if (!clientWidth) return 12;
  let fontSize = 100 * (clientWidth / 375);
  return res*fontSize;

}

export {getFontSize,toHump,getTaskTypeName,ellipsis,mutualType, formatSeconds,formathms, generateTimeReqestNumber, formatTime, randomString,getSubjectName,getStudentName,getGradeName,getTermName,dealType, numToWord}
