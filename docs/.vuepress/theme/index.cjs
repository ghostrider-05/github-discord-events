// Theme needs to be in commonJS: https://github.com/vuepress/vuepress-next/issues/617

const { defaultTheme } = require('@vuepress/theme-default')
const path = require('path')

const localTheme = (options) => {
  return {
    name: 'vuepress-theme-local',
    extends: defaultTheme(options),
    layouts: {
      Layout: path.resolve(__dirname, 'layouts/Layout.vue'),
    },
  }
}

module.exports = { localTheme }