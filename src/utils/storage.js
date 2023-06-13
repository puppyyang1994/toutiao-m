// 封装本地存储模块

// 1. 存储数据

export const setItem = (key, value) => {
// 将数组，对象类型的数据转为JSON格式字符串进行存储
  if (typeof value === 'object') {
    JSON.stringify(window.localStorage.setItem(key, value))
  }
  window.localStorage.setItem(key, value)
}

// 获取数据

export const getItem = (key) => {
  const data = window.localStorage.getItem(key)
  // 很难判断JSON格式  所以用typeof很麻烦
  try {
    return JSON.parse(data)
  } catch (err) {
    return data
  }
}

// 删除数据

export const removeItem = (key) => {
  window.localStorage.removeItem(key)
}
