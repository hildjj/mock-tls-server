/// <reference types="node" />
/**
 * Normalize arguments for functions that take one of these three things
 * for the first arg: port (number), options (object), listener (function).
 *
 * @param {object|number|Function} [options] Options.
 * @param {Object.<string,Function>} [listener] Callback.
 * @returns {object} The normalized options.
 * @throws {TypeError} No callback allowed for this function.
 */
export function normalizeArgs(options?: object | number | Function, listener?: {
    [x: string]: Function;
}): object;
/**
 * Create an extended Error, by assigning all of the properties in opts.
 *
 * @param {string} message Error text.
 * @param {object} opts Extra properties for error (e.g. {code: 'EADDRINUSE'}).
 * @returns {Error} The extended error.
 */
export function extendedError(message: string, opts: object): Error;
/**
 * Select some properties from an object into multiple other objects.
 *
 * @param {object} obj The source object.
 * @param {string[][]} args Arrays of strings to select into the result
 *   objects.
 * @returns {object[]} One object for each of args, plus an extra one for
 *   everything that was left over.
 */
export function select(obj: object, ...args: string[][]): object[];
/** @type {util.DebugLoggerFunction|util.DebugLogger} */
export let log: util.DebugLoggerFunction | util.DebugLogger;
import util from "util";
