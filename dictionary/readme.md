## 这是一个简易的字典工具  

是一个解决应用程序共享字典的一个简易的工具, 它可以集中管理应用程序的字典, 并且在多个组件中复用。

### used

```
import dictionary from 'dictionary'

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
console.log(platform[0]) //=> {"label":"抖音","value":0}

// 多层级 find
const status = dic.find('options').find('status')
console.log(status[0]) //=> {value: 0, label: '待审核'}

// value() 
// value 会输出结果, 不再有链式调用
const statusValue = status.value() // => [{"value":0,"label":"待审核"},{"value":1,"label":"审核失败"},{"value":2,"label":"已审未导入"},{"value":3,"label":"已导"}


// resolve()
// 当find()返回数组可用
const statusResolve = status.resolve(1)
console.log(statusResolve) // => {value: 1, label: '审核失败'}
// 可以定义 resolve key 
status.resolve(4, 'custom') // => {custom: 4, label: '自定义'}
```

### add

### remove

### remote

### update