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
 * Transform an array of event args to something readable.
 *
 * @param {any[]} args Array of event args to transform.
 * @returns {string[]}
 */
export function classNames(args) {
  return args.map(
    o => ((typeof o === 'object') ?
      o?.constructor?.name || JSON.stringify(o) :
      String(o))
  );
}

/** @type {util.DebugLoggerFunction|util.DebugLogger} */
export let log = util.debuglog('mock-tls-server', optimized => {
  log = optimized;
});
