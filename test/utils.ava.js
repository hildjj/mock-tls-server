import {classNames, normalizeArgs} from '../lib/utils.js';
import {Buffer} from 'node:buffer';
import test from 'ava';

test('normalizeArgs', t => {
  t.deepEqual(normalizeArgs(), {});
  t.throws(() => normalizeArgs(() => 0));
});

test('classNames', t => {
  const o = Object.create(null);
  const n = classNames([1, 'two', null, {a: 1}, o, Buffer.from([])]);
  t.deepEqual(n, ['1', 'two', 'null', 'Object', '{}', 'Buffer']);
});
