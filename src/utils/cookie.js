export function setCookie(c_name, value, expire) {
  let date=new Date()
  date.setSeconds(date.getSeconds()+expire)
  document.cookie=encodeURIComponent(c_name)+ "="+encodeURIComponent(value)+"; expires="+date.toGMTString()
}

export function getCookie(c_name) {
  if (document.cookie.length>0){
    let c_start=document.cookie.indexOf(c_name + "=")
    if (c_start!=-1){
      c_start=c_start + c_name.length+1
      let c_end=document.cookie.indexOf(";",c_start)
      if (c_end==-1) c_end=document.cookie.length
      return unescape(decodeURI(document.cookie.substring(c_start,c_end)))
    }
  }
  return ""
}


export function GetLastUser() {
  var id = "49BAC005-7D5B-4231-8CEA-16939BEACD67";//GUID标识符
  var usr = getCookie(id);
  return  usr;
}

export function delCookie(c_name) {
  setCookie(c_name, "", -1)
}
export function SetLastUser(usr) {
  var id = "49BAC005-7D5B-4231-8CEA-16939BEACD67";
  var expdate = new Date();
  //当前时间加上两周的时间
  expdate.setTime(expdate.getTime() + 14 * (24 * 60 * 60 * 1000));
  setCookie(id, usr, expdate);
}
export function ToCDB(str) {
  var tmp = "";
  for (var i = 0; i < str.length; i++) {
    if (str.charCodeAt(i) > 65248 && str.charCodeAt(i) < 65375) {
      tmp += String.fromCharCode(str.charCodeAt(i) - 65248);
    }
    else {
      tmp += String.fromCharCode(str.charCodeAt(i));
    }
  }
  return tmp;
}
