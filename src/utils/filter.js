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
export {ellipsis, formatSeconds}
