import autoprefixer from 'autoprefixer'
import postcssFlexbugsFixes from 'postcss-flexbugs-fixes'
import postcssPresetEnv from 'postcss-preset-env'
import postcssPxToViewport from 'postcss-px-to-viewport-8-plugin'

export default {
  plugins: [
    autoprefixer,
    postcssFlexbugsFixes,
    postcssPxToViewport({
      viewportWidth: 750,
      unitPrecision: 3,
      viewportUnit: 'vw',
      selectorBlackList: ['.ignore', '.hairlines'],
      minPixelValue: 1,
      mediaQuery: false,
      exclude: [/node_modules/]
    }),
    postcssPresetEnv({
      stage: 3,
      features: {
        'nesting-rules': true
      }
    })
  ]
}
