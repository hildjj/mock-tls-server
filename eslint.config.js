import ava from '@cto.af/eslint-config/ava.js';
import es6 from '@cto.af/eslint-config/es6.js';
import jsdoc_ts from '@cto.af/eslint-config/jsdoc_ts.js';
import markdown from '@cto.af/eslint-config/markdown.js';

export default [
  {
    ignores: [
      'types/*',
    ],
  },
  ...es6,
  ...jsdoc_ts,
  ...markdown,
  ...ava,
  {
    files: [
      'examples/**',
    ],
    rules: {
      'no-console': 'off',
    },
  },
];
