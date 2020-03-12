// 加减乘除浮点运算

(function() {

  const getFloatLen = num => {
    if(typeof num === 'number' && !isNaN(num)) {
      return (`${num}`.split('.')[1] || '').length
    } else {
        return 0
    }
  }

  // 浮点运算
  // Array or Array<Number>
  const basePowLen = num => {
    const arr = []
    if(Array.isArray(num)) {
      num.forEach(item => arr.push(getFloatLen(item)))
    } else {
      arr.push(getFloatLen(num))
    }
    return Math.pow(10, Math.max(...arr))
  }

  const arithmetic = (arr, arithmeticFn) => {
    const baseLen = basePowLen(arr)
    return arr.reduce((prev, next) => {
      return arithmeticFn(prev * baseLen, next * baseLen, baseLen)
    })
  }

  // 加法
  const add = (...args) => {
    return arithmetic(args, (prev, next, baseLen) => {
      return (prev  + next) / baseLen
    })
  }

  // 减法
  const subtrac = (...args) => {
    return arithmetic(args, (prev, next, baseLen) => {
      return (prev - next) / baseLen
    })
  }

  // 乘法
  const multip = (...args) => {
    return arithmetic(args, (prev, next, baseLen) => {
      return prev * next / (baseLen * baseLen)
    })
  }

  // 除法
  const divid = (...args) => {
    return arithmetic(args, (prev, next, baseLen) => {
      return prev / next
    })
  }


  console.log( 
    add(0.1, 0.2),
    subtrac(6.8, 0.9),
    multip(2.3, 100),
    divid(2.14, 100),
  )

  console.log(
    add(0.1, 0.2, 0.5, 1),
    subtrac(6.8, 0.9, 1),
    multip(2.3, 100, 20),
    divid(2.14, 100, 0.1, 2),
  )

}())