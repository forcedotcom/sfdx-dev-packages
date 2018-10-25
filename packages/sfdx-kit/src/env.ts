/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { definiteEntriesOf, Dictionary, isKeyOf, KeyValue, Nullable, Optional } from '@salesforce/ts-types';
import { InvalidDefaultEnvValueError } from './errors';

/**
 * An injectable abstraction on top of `process.env` with various convenience functions
 * for accessing environment variables of different anticipated shapes.
 */
export class Env {
    public constructor(
        private store: Dictionary<string> = (process && process.env) || {}
    ) {
        this.store = store;
    }

    /**
     * Gets a `string` value for a given key.
     *
     * @param key The name of the envar.
     */
    public getString(key: string): Optional<string>;
    /**
     * Gets a `string` value for a given key.
     *
     * @param key The name of the envar.
     * @param def A default value.
     */
    public getString(key: string, def: string): string;
    // underlying method
    public getString(key: string, def?: string): Optional<string> {
        return this.store[key] || def;
    }

    /**
     * Gets a `string` value from a finite set of expected values, matched case-insensitively.
     *
     * @param key The name of the envar.
     * @param values The finite set of expected values.
     */
    public getStringIn(key: string, values: string[]): Optional<string>;
    /**
     * Gets a `string` value from a finite set of expected values, matched case-insensitively, using a default if
     * not found.
     *
     * @param key The name of the envar.
     * @param values The finite set of expected values.
     * @param def A default value.
     * @throws {@link InvalidDefaultEnvValueError} If the provided default value is not a member of the expected set.
     */
    public getStringIn(key: string, values: string[], def: string): string;
    // underlying method
    public getStringIn(key: string, values: string[], def?: string): Optional<string> {
        const re = new RegExp(values.join('|'), 'i');
        if (def && !re.test(def.toString())) {
            throw new InvalidDefaultEnvValueError(`${def} is not a member of ${values}`);
        }
        const value = this.getString(key);
        if (!value) return def;
        return re.test(value) ? value : def;
    }

    /**
     * Gets a `string` value from a finite set of expected values derived from the keys of a given object of type `T`,
     * matched case-insensitively. An optional `transform` may be provided that will preprocess both the found value
     * and any provided default before testing for membership in the target object's key set.
     *
     * @param key The name of the envar.
     * @param obj The object providing the keys to test with.
     * @param transform A transform function applied to both the default and value before testing that
     *  either is a key of `T`.
     *
     * ```
     * enum Mode { TEST = 'test', DEMO = 'demo' }
     * env.setString('MY_ENVAR', Mode.DEMO);
     * const check = env.getString('MY_ENVAR');
     * // check -> 'demo'
     * // typeof check -> string
     * const value = env.getKeyOf('MY_ENVAR', Mode, v => v.toUpperCase());
     * // value -> 'DEMO'
     * // typeof value -> 'TEST' | 'DEMO' (i.e. Extract<keyof typeof Mode, string>)
     * const enumValue = Mode[value];
     * // enumValue -> 'demo'
     * // typeof enumValue -> Mode
     * ```
     */
    public getKeyOf<T extends object>(
        key: string,
        obj: T,
        transform?: (k: string) => string
    ): Optional<Extract<keyof T, string>>;
    /**
     * Gets a `string` value from a finite set of expected values derived from the keys of a given object of type `T`,
     * matched case-insensitively, using a default if not found. An optional `transform` may be provided that will
     * preprocess both the found value and any provided default before testing for membership in the target object's
     * key set.
     *
     * @param key The name of the envar.
     * @param obj The object providing the keys to test with.
     * @param def A default value.
     * @param transform A transform function applied to both the default and value before testing that
     *  either is a key of `T`.
     * @param {@link InvalidDefaultEnvValueError} If the provided default value is not a member of the expected set.
     *
     * ```
     * enum Mode { TEST = 'test', DEMO = 'demo' }
     * env.setString('MY_ENVAR', Mode.DEMO);
     * const check = env.getString('MY_ENVAR');
     * // check -> 'demo'
     * // typeof check -> string
     * const value = env.getKeyOf('MY_ENVAR', Mode, Mode.TEST, v => v.toUpperCase());
     * // value -> 'DEMO'
     * // typeof value -> 'TEST' | 'DEMO' (Extract<keyof typeof Mode, string>)
     * const enumValue = Mode[value];
     * // enumValue -> 'demo'
     * // typeof enumValue -> Mode
     * ```
     */
    public getKeyOf<T extends object>(
        key: string,
        obj: T,
        def: string,
        transform?: (k: string) => string
    ): Extract<keyof T, string>;
    // underlying method
    public getKeyOf<T extends object>(
        key: string,
        obj: T,
        defOrTransform?: string | ((k: string) => string),
        transform?: (k: string) => string
    ): Optional<Extract<keyof T, string>> {
        let value: Optional<string>;
        let def: Optional<string>;
        if (typeof defOrTransform === 'function') {
            transform = defOrTransform;
        } else {
            def = defOrTransform;
        }
        if (def === undefined) {
            value = this.getStringIn(key, Object.keys(obj));
        } else {
            if (transform) def = transform(def);
            value = this.getStringIn(key, Object.keys(obj), def);
        }
        if (!value) return;
        if (typeof transform === 'function') value = transform(value);
        if (isKeyOf(value, obj)) return value;
    }

    /**
     * Sets a `string` value for a given key, or removes the current value when no value is given.
     *
     * @param key The name of the envar.
     * @param value The value to set.
     */
    public setString(key: string, value: Nullable<string>): void {
        if (value == null) {
            this.unset(key);
            return;
        }
        this.store[key] = value;
    }

    /**
     * Gets a list of `string` values for a given key by splitting the raw value on `,` chars.
     *
     * @param key The name of the envar.
     */
    public getList(key: string): Optional<string[]>;
    /**
     * Gets a list of `string` values for a given key by splitting the raw value on `,` chars.
     *
     * @param key The name of the envar.
     * @param def A default list of values.
     */
    public getList(key: string, def: string[]): string[];
    // underlying method
    public getList(key: string, def?: string[]): Optional<string[]> {
        const value = this.getString(key);
        return value ? value.split(',') : def;
    }

    /**
     * Sets a `string` value from a list for a given key by joining values with a `,` into a raw `string` value,
     * or removes the current value when no value is given.
     *
     * @param key The name of the envar.
     * @param values The values to set.
     */
    public setList(key: string, values: Nullable<string[]>): void {
        if (values == null) {
            this.unset(key);
            return;
        }
        this.setString(key, values.join(','));
    }

    /**
     * Gets a `boolean` value for a given key. Returns the default value if no value was found.
     *
     * @param key The name of the envar.
     * @param def A default boolean, which itself defaults to `false` if not otherwise supplied.
     */
    public getBoolean(key: string, def = false): boolean {
        const value = this.getString(key, def.toString());
        return value.toLowerCase() === 'true' || value === '1';
    }

    /**
     * Sets a `boolean` value for a given key, or removes the current value when no value is given.
     *
     * @param key The name of the envar.
     * @param value The value to set.
     */
    public setBoolean(key: string, value: Nullable<boolean>): void {
        if (value == null) {
            this.unset(key);
            return;
        }
        this.setString(key, value.toString());
    }

    /**
     * Unsets a value for a given key.
     *
     * @param key The name of the envar.
     */
    public unset(key: string): void {
        delete this.store[key];
    }

    /**
     * Gets an array of all definitely assigned key-value pairs from the underlying envar store.
     */
    public entries(): Array<KeyValue<string>> {
        return definiteEntriesOf(this.store);
    }
}

/**
 * The default `Env` instance, which wraps `process.env`.
 */
export const env = new Env();
