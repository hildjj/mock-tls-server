'use strict';

/** @type {import('typedoc').TypeDocOptions} */
module.exports = {
  entryPoints: 'lib/index.js',
  out: 'docs',
  cleanOutputDir: true,
  sidebarLinks: {
    'Playground': '/cbor2/playground/index.html',
    'cbor-edn': 'https://github.com/hildjj/cbor-edn',
    'GitHub': 'https://github.com/hildjj/cbor2/',
    'Spec': 'http://cbor.io/',
    'Documentation': 'http://hildjj.github.io/cbor2/',
  },
  navigation: {
    includeCategories: false,
    includeGroups: false,
  },
  categorizeByGroup: false,
  sort: ['static-first', 'alphabetical'],
  exclude: ['**/*.spec.ts'],
};
