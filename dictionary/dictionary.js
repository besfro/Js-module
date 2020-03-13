/*
 * @Description: 字典插件 
 * @Author: clc
 * @Date: 2019-10-30 17:25:15
 * @LastEditors: clc
 * @LastEditTime: 2019-11-04 13:40:50
 */

import {type, deepCopy} from '../utils/utils.js'

const {isObject, isFunction, isArray, isPromise} = type

// 创建并返回一个Dic实例
const creator = data => {
  return new Dic(data)
}

const toValue = value => {
  return deepCopy(value)
}


// 远程方法
// 统一的调用和控制
// 缓存调用结果
class Remote {
  constructor(fn) {
    this.isRemote = true
    // 方法
    this.fn = fn
    // 调用状态 0-未请求 1-请求中 2-请求完成
    this.status = 0
    // 请求返回的Promise
    this.promise = null
    // 请求返回的结果
    this.result = null
  }

  request() {
    if(this.isRequesting()) {
      // 调用中 直接返回 Promise
      return this.promise
    } else if(this.isRequested()) {
      // 已经调用过了直接返回结果
      return creator(this.result)
    } else {
      // 第一次调用
      return this.doRequest()
    }
  }

  doRequest() {
    const result = this.fn()
    if(isPromise(result)) {
      this.checkToRequesting()
      return this.promise = result.then(res => {
        this.checkToRequested()
        this.result = res
        return creator(res)
      })
    } else {
      this.promise = null
      this.result = result
      return creator(result)
    }
  }

  update() {
    return this.doRequest()
  }

  checkToRequesting() {
    this.status = 1
  }

  checkToRequested() {
    this.status = 2
  }

  isRequesting() {
    return this.status === 1
  }
  
  isRequested() {
    return this.status === 2
  }

} 

class Dic {
  constructor(config) {
    this.create(config)
  }

  // 解析config, 并创建基础数据
  create(config) {
    if(isObject(config)) {
      const data = {}
      Object.keys(config).forEach(key => {
        const item = config[key]
        // 如果是方法, 将被保存到 remote 里边
        data[key] = isFunction(item) ? new Remote(item) : item
      })
      this.data = data
    } else {
      this.data = config
    }
  }

  find(key) {
    const data = this.data

    if(!data) {
      return isArray(key) ? creator([]) : creator(null)
    } 

    const getValue = value => {
      return value && value.isRemote ? value.request() : creator(value)
    }
    
    if(isArray(key)) {
      const arr = []
      key.forEach(keyItem => {
        arr.push(
          getValue(data[keyItem])
        )
      })
      return arr
    } else {
      return getValue(data[key])      
    }

  }
  
  add(value, key) {
    const data = this.data
    if(isObject(data) && value && key) {
      data[key] = value
    } else if(isArray(data) && value) {
      data.push(value)
    }
    return this
  }
  
  remove(key) {
    const data = this.data
    if(isObject(data)) {
      data.hasOwnProperty(key) && delete data[key]
    }
    return this
  }

  update(key) {
    const item = this.data && this.data[key]
    // 如果是远程数据调用请求更新数据
    item && item.isRemote && item.update()  
    return this
  }
  
  value() {
    return toValue(this.data)
  }
  
  resolve(value, key = 'value') {
    const data = this.data
    if(isArray(data)) {
      return creator(data.filter(item => item[key] === value)[0])
    } else {
      return creator(null)
    }
  }

  stringify() {
    return JSON.stringify(this.data)
  }

}

export default creator