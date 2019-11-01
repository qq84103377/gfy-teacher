// 乘
function mul(a, b, digit=2) {
  let c = 0
  const d = a.toString()
  const e = b.toString()
  try {
    c += d.split('.')[1].length
  } catch (f) { console.log() }
  try {
    c += e.split('.')[1].length
  } catch (f) { console.log() }
  const result = Number(d.replace('.', '')) * Number(e.replace('.', '')) / Math.pow(10, c)
  return parseFloat(result.toFixed(digit))
}

// 加
function add(a, b, digit=2) {
  let c = 0
  let d = 0
  let e = 0
  try {
    c = a.toString().split('.')[1].length
  } catch (f) {
    c = 0
  }
  try {
    d = b.toString().split('.')[1].length
  } catch (f) {
    d = 0
  }
  e = Math.pow(10, Math.max(c, d))
  const result = (mul(a, e) + mul(b, e)) / e
  return parseFloat(result.toFixed(digit))
}

// 减
function sub(a, b,digit=2) {
  let c = 0
  let d = 0
  let e = 0
  try {
    c = a.toString().split('.')[1].length
  } catch (f) {
    c = 0
  }
  try {
    d = b.toString().split('.')[1].length
  } catch (f) {
    d = 0
  }
  e = Math.pow(10, Math.max(c, d))
  const result = (mul(a, e) - mul(b, e)) / e
  return parseFloat(result.toFixed(digit))
}

// 除
function div(a, b,digit=2) {
  let c = 0
  let d = 0
  let e = 0
  let f = 0
  try {
    e = a.toString().split('.')[1].length
  } catch (g) { console.log() }
  try {
    f = b.toString().split('.')[1].length
  } catch (g) { console.log() }
  c = Number(a.toString().replace('.', ''))
  d = Number(b.toString().replace('.', ''))
  if(d === 0) {
    return 0
  }else {
    const result = mul(c / d, Math.pow(10, f - e))
    return parseFloat(result.toFixed(digit))
  }
}

export {div,mul,sub,add}

