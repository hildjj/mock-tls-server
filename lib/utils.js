import util from 'node:util';

// Object.<> triggers this:
/**
 * Normalize arguments for functions that take one of these three things
 * for the first arg: port (number), options (object), listener (function).
 *
 * @param {object|number|Function} [options] Options.
 * @param {Object.<string,Function>} [listener] Callback.
 * @returns {object} The normalized options.
 * @throws {TypeError} No callback allowed for this function.
 */
export function normalizeArgs(options = {}, listener = null) {
  let opts = null;
  if (typeof options === 'function') {
    if (listener) {
      listener[Object.keys(listener)[0]] = options;
    } else {
      throw new Error('Function provided for options when not expecting it');
    }
    options = {};
  }
  switch (typeof options) {
    case 'object':
      opts = options || {};
      break;
    case 'number':
      opts = {port: options};
      break;
    default:
      throw new TypeError('Invalid type for options');
  }
  return {
    ...listener,
    ...opts,
  };
}

/**
 * Create an extended Error, by assigning all of the properties in opts.
 *
 * @param {string} message Error text.
 * @param {object} opts Extra properties for error (e.g. {code: 'EADDRINUSE'}).
 * @returns {Error} The extended error.
 */
export function extendedError(message, opts) {
  const er = new Error(message);
  Object.assign(er, opts);
  return er;
}

/**
 * Select some properties from an object into multiple other objects.
 *
 * @param {object} obj The source object.
 * @param {string[][]} args Arrays of strings to select into the result
 *   objects.
 * @returns {object[]} One object for each of args, plus an extra one for
 *   everything that was left over.
 */
export function select(obj, ...args) {
  const res = args.map(() => ({}));
  const leftovers = {};
  res.push(leftovers);

  if (!obj) {
    return res;
  }

  const sets = args.map(a => new Set(a));
  for (const [k, v] of Object.entries(obj)) {
    let found = false;
    sets.forEach((s, i) => {
      if (!found && s.has(k)) {
        found = true;
        res[i][k] = v;
      }
    });
    if (!found) {
      leftovers[k] = v;
    }
  }
  return res;
}

/** @type {util.DebugLoggerFunction|util.DebugLogger} */
export let log = util.debuglog('mock-tls-server', optimized => {
  log = optimized;
});
