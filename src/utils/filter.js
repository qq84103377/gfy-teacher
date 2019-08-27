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
let generateTimeReqestNumber = (data=new Date()) => {
  // var date = new Date()
  let d = data
  return d.getFullYear().toString() + '-' + pad2(d.getMonth() + 1) + '-' + pad2(d.getDate())
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
export {ellipsis, formatSeconds, generateTimeReqestNumber, formatTime, randomString}
