module.exports = function (api) {
  // Quasar compatibility check.
  api.compatibleWith('quasar', '>=2.0.0-beta.10 <3.0.0')
  api.compatibleWith('@quasar/app', '>=3.0.0-beta.9 <4.0.0')

  // Require vue-i18n v9 to be installed.
  api.compatibleWith('vue-i18n', '>=9.0.0 <10.0.0')

  // Render the templates in the app.
  // api.render('./templates', { prompts: api.prompts })
}
