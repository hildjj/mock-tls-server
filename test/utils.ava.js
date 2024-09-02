import {normalizeArgs, select} from '../lib/utils.js';
import test from 'ava';

test('normalizeArgs', t => {
  t.deepEqual(normalizeArgs(), {});
  t.throws(() => normalizeArgs(() => 0));
});

test('select', t => {
  t.deepEqual(select(), [{}]);
  t.deepEqual(select({a: 2}), [{a: 2}]);
  t.deepEqual(select({a: 2}, ['a']), [{a: 2}, {}]);
  t.deepEqual(select({a: 2}, ['b']), [{}, {a: 2}]);
});
