## 这是一个简易的字典工具  

是一个解决应用程序共享字典的一个简易的工具   
它可以集中管理应用程序的字典, 并且在多个组件中复用  

## used

```
import dictionary from 'dictionary'

// 配置的字典
const config = {
  platform: [
    {label: '抖音', value: 0 },
    {label: '快手', value: 1},
    {label: '小红书', value: 2}
  ],
  kolType: [
    {value: 0, label: '所有达人'},
    {value: 1, label: '带货达人'}
  ],
  options: {
    status: [
      {value: 0, label: '待审核'},
      {value: 1, label: '审核失败'},
      {value: 2, label: '已审未导入'},
      {value: 3, label: '已导'},
      {custom: 4, label: '自定义'}
    ]
  }
}


const dic = dictionary(config)

// find()
const platform = dic.find('platform')
console.log(platform.value()) //=> [{"label":"抖音","value":0},{"label":"快手","value":1},{"label":"小红书","value":2}]

// 多层级 find
const status = dic.find('options').find('status')
console.log(status.value()) //=> [{"value":0,"label":"待审核"},{"value":1,"label":"审核失败"},{"value":2,"label":"已审未导入"},{"value":3,"label":"已导"},{"custom":4,"label":"自定义"}]

// value() 
// value 会输出结果, 不再有链式调用
const statusValue = status.value() // => [{"value":0,"label":"待审核"},{"value":1,"label":"审核失败"},{"value":2,"label":"已审未导入"},{"value":3,"label":"已导"},{"custom":4,"label":"自定义"}]


// resolve(value, key = 'value')
// 当find() 返回数组可用
const statusResolve = status.resolve(1)
console.log(statusResolve.value()) // => {value: 1, label: '审核失败'}
// 可以定义 resolve key 
const findCustom = status.resolve(4, 'custom')
console.log(findCustom.value()) // => {custom: 4, label: '自定义'}
```

### add
```
// add(value, key)
// 可以通过add 方法添加字典

dic.add([{name: 'ido', age: 10}, {name: 'igo', age: 20}], 'newOne')
const newOne = dic.find('newOne')
console.log(newOne.value()) // => [{"name":"ido","age":10},{"name":"igo","age":20}]

newOne.add({name: 'imo', age: 30})
console.log(newOne.value()) // => [{"name":"ido","age":10},{"name":"igo","age":20},{"name":"imo","age":30}]
```

### remove

```
// remove(key)
dic.remove('newOne')
```

### remote
```
// 如果你的字典需要通过远程方法获取
const remoteConifg = {
  user() {
    return new Promise(resolve => {
      console.log('requesting.......')
      setTimeout(() => resolve({number: 1300000000, name: 'iko'}), 2000)
    })
  }
}

const remoteDic = dictionary(remoteConifg)
remoteDic.find('user').then(data => console.log(data.value()))

// async/await
async function getUserConfig() {
  const userConifg = await remoteDic.find('user')
  console.log(userConifg.value()) // => 
}

getUserConfig()
```

### update
```
update('key')
// 如果字典数据是远程获取可以调用update进行更新
// update方法会重新发起一次 request
remoteDic.update('user')
  .find('user')
  .then(data => console.log(data.value()))
```

## Vue Plugin

```
import dic from 'dictionary'

const Plugin = {}

Plugin.install = (Vue, config) => {
  Vue.prototype.$dic = dic(config)
}

```