const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,

  // Set the title that will appear in the browser tab
  chainWebpack: config => {
    config.plugin('html').tap(args => {
      args[0].title = 'Weekly WoW Tasks'
      return args
    })
  },

  pluginOptions: {
    vuetify: {
      // https://github.com/vuetifyjs/vuetify-loader/tree/next/packages/vuetify-loader
    }
  }
})
