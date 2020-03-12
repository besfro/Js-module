/*
 * @Description: 常用JS工具
 * @Author: clc
 * @Date: 2019-08-27 12:00:17
 * @LastEditors: clc
 * @LastEditTime: 2019-10-28 14:11:51
 */

/**
 * @description: 返回参数的数据类型
 * @param {Any} 
 * @return {String}  
 */ 
const _type = o => {
  const str = Object.prototype.toString.call(o)
  return str.replace(/\[object (.)(.+)\]/, (match, first, sec) => `${first.toLocaleLowerCase()}${sec}`)
}

// 是否为数组
const isArray = o => _type(o) === 'array'

// 是否为 Object
const isObject = o => _type(o) === 'object'

// 是否为 Number
const isNumber = o => _type(o) === 'number'

// 是否为 String
const isString = o => _type(o) === 'string'

// 是否为 Function
const isFunction = o => _type(o) === 'function'

// 是否为 isPromise
const isPromise = o => _type(o) === 'promise'

// 是否为 Blob
const isBlob = o => _type(o) === 'blob'

const type = {
  isArray, isNumber, isString, 
  isObject, isFunction, isBlob, isPromise
} 

/** 
 * @description: 四舍五入算法 
 * @param {Number} num - 需要四舍五入的数据
 * @param {Number} decimal - 要保留小数位 def - 2 
 * @return {Number} 计算后的结果
 */
const toFixed = (num = 0, decimal = 2) => {
  const pow = Math.pow(10, decimal)
  return Math.round(num * pow) / pow
}


/**
 * @description: 空值处理
 */
const valueFixed = val => {
  if(val == null || val === '') {
    return '-'
  } else {
    return val
  }
}

/**
 * @description: 时间戳格式化 
 * @return {string}
 */
const timeStampFormat = (timeStamp = '', symbol = '-') => {
  if(!timeStamp) {
    return timeStamp
  }
  const date = new Date(timeStamp)
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  return `${year}${symbol}${month >= 10 ? month : '0' + month}${symbol}${day >= 10 ? day : '0' + day}`
}


/**
 * @description: 将数值单位转为万
 * @param {Number} val - 需要转化的数值 
 * @return {String} 装换后toFixed的字符串
 */
const number2Wan = (val = 0) => {
  const unit = '万'
  const len = 10000
  const value = +val
  if(!val || isNaN(value) || !isNumber(value) || value < len) {
    return val
  }
  return `${toFixed(value / len)}${unit}`
}

/**
 * @description: 数组转文本
 */
const arr2Text = val => {
  return isArray(val) ? val.join('、') : val
}

/**
 * @description: 查询参数解析方法 
 * @param {String} query - 查询参数字符串 ( .e.g. ?institueName=第三新&age=20 )
 * @return {Object} 返回键值对象 ( .e.g. {institueName: 第三新, age: 20} )
 */
const queryParser = str => {
  const fn = queryParser
  // 有缓存 返回缓存
  if(fn.cache && fn.cache[str]) {
    return fn.cache[str]
  }
  // 
  const obj = {}
  const reg = /(?:\?|&)?(\w+)=([\%\w\u4e00-\u9fa5]+)/ig
  // 只处理字符串
  if(isString(str)) {
    str.replace(reg, (input, key, val) => {
      obj[key] = val
    })
    // 添加到缓存
    fn.cache = {
      ...fn.cache,
      [str]: obj
    }
  }
  return obj
}

/**
 * @description: 新开窗口
 * @param {String} url - 新开地址 
 */
const windowOpen = url => {
  const link = document.createElement('a')
  link.href = url
  link.target = '_blank'
  link.style.display = 'none'
  document.body.append(link)
  link.click()
  link.remove()
}

// 对象序列化过程
const _serialize = (params = {}, process = () => {}) => {
  // 递归添加 input
  const serialize = (newKey, item) => {
    if(isObject(item)) {
      objSerialize(newKey, item)
    } else if(isArray(item)) {
      arrSerialize(newKey, item)
    } else {
      if(isString(item) || isNumber(item)) {
        process && process(newKey, item) 
      }
    }
  }
  // 序列化数组
  const arrSerialize = (key = '', arr) => {
    arr.forEach((item, index) => {
      const newKey = `${key}`
      serialize(newKey, item || '')
    })
  }
  // 序列化对象
  const objSerialize = (key = '', obj) => {
    Object.keys(obj).forEach(subKey => { 
      const item = obj[subKey]
      const newKey = key ? `${key}.${subKey}` : subKey
      serialize(newKey, item)
    })
  }
  
  if(isObject(params)) {
    objSerialize(null, params)
  }
}

// 序列化方法
const serialize = (params = {}) => {
  let str = ''
  _serialize(params, (key, val) => str += `${key}=${val}&`)
  return str
}

/**
 * @description: 表单提交下载
 * @param {Object<Array>} data - 接受一个 Object, 可以嵌套数组 
 */
const formDownload = (url = '', data = {}, method = 'post') => {
  // input arr
  const inputArr = []
  // 添加 form input
  const inputAdd = (name, value) => inputArr.push(`<input name="${name}" value="${value}">`)
  // 序列化
  if(isObject(data)) {
    _serialize(data, inputAdd)
  }
  // create form
  const form = document.createElement('form')
  form.id = 'formDownload'
  form.method = method
  form.action = url
  form.target = '_blank'
  form.style.display = 'none'
  form.innerHTML = inputArr.join('')
  document.body.append(form)
  // download
  form.submit()
  form.remove()
}

// link 下载
const linkDownload = (url, fileName) => {
  const link = document.createElement('a')
  link.href = url
  link.download = fileName
  link.style.display = 'none'
  document.body.appendChild(link)
  link.click()
  link.remove()
}

// blob 下载
// https://developer.mozilla.org/zh-CN/docs/Web/API/Blob
const blobDownload = (blob, fileName) => {
  const URL = window.URL
  const blobURL = URL.createObjectURL(blob)
  linkDownload(blobURL, fileName)
  URL.revokeObjectURL(blobURL)
}

const delay = (fn, time = 500) => {
  return (...args) => {
    return setTimeout(() => fn && fn(...args), time)
  }
}

/**
 * @description: 防抖动
 * @param {Function} fn - 需要防抖的方法 
 * @param {Number} delay - 多少秒的防抖
 * @return {Function}
 */
const debounce = (fn, duration = 1000) => {
  let timeout
  let newFn = delay(fn, duration)
  if(isFunction(fn)) {
    return (...args) => {
      clearTimeout(timeout)
      timeout = newFn(...args)
    }
  }
}

/**
 * @description: 在数组指定位置插值  
 * @param {Array} arr - 需要插值的数组
 * @param {Number} index - 插值的位置
 * @param {Array} insertArr - 需要插入的值 
 * @return {Array} 返回新数组
 */
const arrInsert = (arr, index, insertArr) => {
  const newArr = [...arr]
  newArr.splice(index, 0, ...insertArr)
  return newArr
}

const timer = (ctx = {}, count = 60, key = 'timing', setTime = true) => {
  setTime && (ctx[key] = count)
  if(ctx[key] === false) {
    return
  }
  if(ctx[key] <= 0) {
    ctx[key] = false
  } else {
    setTimeout(() => timer(ctx, ctx[key]--, key, false), 1000)      
  }
  return {
    stop: () => ctx[key] = false
  } 
}

const deepCopy = o => {
  let reValue
  if(isObject(o)) {
    reValue = {}
    Object.keys(o).forEach(key => {
      reValue[key] = deepCopy(o[key])
    })
  } else if(isArray(o)) {
    reValue = []
    o.forEach(item => reValue.push(deepCopy(item)))
  } else {
    reValue = o
  }
  return reValue
}

const trim = str => {
  if(!isString(str)) {
    return str
  }
  return str.replace(/^\s*|\s*$/g, '')
}

// 严格合并选项
// const mergeOptions = (base, ...args) => {
//   args.forEach(item => {
//     Object.keys(item).forEach(key => {
//       const baseValue = base[key]
//       const value = item[key]
//       if(type(baseValue) === type(value)) {
//         base[key] = value
//       }
//     })    
//   })
//   return base
// }

export {
  type,
  arr2Text,
  number2Wan,
  timeStampFormat,
  valueFixed,
  toFixed,
  windowOpen,
  queryParser,
  serialize,
  formDownload,
  blobDownload,
  linkDownload,
  debounce,
  arrInsert,
  delay,
  timer,
  deepCopy,
  trim
}