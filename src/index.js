const path = require('path')

module.exports = function (api) {
  // App configuration.
  api.extendQuasarConf((conf) => {
    // Register the extension boot file.
    conf.boot.push('~src/extensions/qint/boot')

    // Make sure the extension files get transpiled.
    conf.build.transpileDependencies.push(/quasar-app-extension-qint[\\/]src/)
  })

  api.extendWebpack((cfg) => {
    // Add a webpack resolve alias for the extension.
    cfg.resolve.alias.qint = path.resolve(__dirname, 'lib')
  })
}
