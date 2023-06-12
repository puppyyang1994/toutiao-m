const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({

  devServer: { // 服务器配置

    proxy: { // 代理配置
      'app/': {
        target: 'http://localhost:8080',
        changeOrigin: true
      }
    }
  },
  lintOnSave:false //关闭语法检查

})
