'use strict';

/** @type {import('typedoc').TypeDocOptions} */
module.exports = {
  entryPoints: ['lib/index.js', 'lib/ca.js', 'lib/net.js'],
  out: 'docs',

  categorizeByGroup: false,
  cleanOutputDir: true,
  exclude: ['**/*.spec.ts'],
  includeVersion: true,
  navigation: {
    includeCategories: false,
    includeGroups: false,
  },
  sidebarLinks: {
    GitHub: 'https://github.com/hildjj/mock-tls-server/',
    Documentation: 'http://hildjj.github.io/mock-tls-server/',
  },
  sort: ['static-first', 'alphabetical'],
};
