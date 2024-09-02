import util from 'node:util';

/**
 * @template T
 * @typedef {T | Readonly<T[]>} Many
 */

/**
 * Normalize arguments for functions that take one of these three things
 * for the first arg: port (number), options (object), listener (function).
 *
 * @template {Record<string,Function|undefined>} T
 * @template U
 * @param {number | U} [options] Options.
 * @param {T} [listener] Callback.
 * @returns {U & {port?: number} & T} The normalized options.
 * @throws {TypeError} No callback allowed for this function.
 */
export function normalizeArgs(
  options,
  listener = undefined
) {
  let opts = null;
  if (options === undefined) {
    options = Object.create(null);
  }
  if (typeof options === 'function') {
    if (listener) {
      // @ts-ignore
      listener[Object.keys(listener)[0]] = options;
    } else {
      throw new Error('Function provided for options when not expecting it');
    }
    options = Object.create(null);
  }
  switch (typeof options) {
    case 'object':
      opts = options || Object.create(null);
      break;
    case 'number':
      opts = {port: options};
      break;
    default:
      throw new TypeError(`Invalid type for options: ${typeof options} (${options})`);
  }

  // @ts-ignore
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
 * @template {Record<string,any>} T
 * @param {T} obj The source object.
 * @param {(keyof T)[][]} args Arrays of strings to select into the result
 *   objects.
 * @returns {Partial<Record<keyof T, any>>[]} One object for each of args,
 * plus an extra one for everything that was left over.
 */
export function select(obj, ...args) {
  /** @type {Partial<Record<keyof T, any>>[]} */
  const res = args.map(() => Object.create(null));
  const leftovers = Object.create(null);
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
        // @ts-ignore
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
