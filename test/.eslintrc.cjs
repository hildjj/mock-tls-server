'use strict'

module.exports = {
  extends: '@cto.af/eslint-config/ava',
  rules: {
    'node/no-missing-import': ['error', {
      allowModules: ['ava'],
    }],
  },
}
