import autoprefixer from 'autoprefixer'
import postcssFlexbugsFixes from 'postcss-flexbugs-fixes'
import postcssPresetEnv from 'postcss-preset-env'
import postcssPxToViewport from 'postcss-px-to-viewport-8-plugin'

export default {
  plugins: [
    autoprefixer,
    postcssFlexbugsFixes,
    postcssPxToViewport({
      // 动态设置 viewportWidth：根据文件来源使用不同设计稿宽度
      viewportWidth: (file) => {
        // antd-mobile 原生 375px 设计稿
        if (file.includes('node_modules/antd-mobile')) {
          return 375
        }
        // 项目自有代码 750px 设计稿
        return 750
      },
      unitPrecision: 3,
      viewportUnit: 'vw',
      selectorBlackList: ['.ignore', '.hairlines'],
      minPixelValue: 1,
      mediaQuery: false
    }),
    postcssPresetEnv({
      stage: 3,
      features: {
        'nesting-rules': true
      }
    })
  ]
}
