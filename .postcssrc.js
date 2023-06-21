// postcss.config.js
module.exports = {
    plugins: {
      'postcss-pxtorem': {
        rootValue: 37.5,
        propList: ['*'],
         // 配置不做单位转换的资源文件名
    exclude: 'github-markdown'
      }
    }
  }