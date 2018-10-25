/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { Optional } from '@salesforce/ts-types';

/**
 * A simple utility class for converting durations between minutes, seconds, and milliseconds.
 */
export class Duration {

    /**
     * The number of milliseconds in one second.
     */
    public static readonly MILLIS_IN_SECONDS: number = 1000;

    /**
     * The number of seconds in one minute.
     */
    public static readonly SECONDS_IN_MINUTE: number = 60;

    /**
     * Returns a new `Duration` instance created from the specified number of milliseconds.
     *
     * @param quantity The number of milliseconds.
     */
    public static milliseconds(quantity: number): Duration {
        return new Duration(quantity, Duration.Unit.MILLISECONDS);
    }

    /**
     * Returns a new `Duration` instance created from the specified number of seconds.
     *
     * @param quantity The number of seconds.
     */
    public static seconds(quantity: number): Duration {
        return new Duration(quantity, Duration.Unit.SECONDS);
    }

    /**
     * Returns a new `Duration` instance created from the specified number of minutes.
     *
     * @param quantity The number of minutes.
     */
    public static minutes(quantity: number): Duration {
        return new Duration(quantity, Duration.Unit.MINUTES);
    }

    private readonly quantity: number;
    private readonly unit: Duration.Unit;

    constructor(quantity: number, unit: Duration.Unit = Duration.Unit.MINUTES) {
        this.quantity = quantity;
        this.unit = unit;
    }

    /**
     * Returns the current number of minutes represented by this `Duration` instance, rounded to the nearest integer value.
     */
    get minutes(): number {
        switch (this.unit) {
            case Duration.Unit.MINUTES:
                return this.quantity;
            case Duration.Unit.SECONDS:
                return Math.round(this.quantity / Duration.SECONDS_IN_MINUTE);
            case Duration.Unit.MILLISECONDS:
                return Math.round(this.quantity / Duration.MILLIS_IN_SECONDS / Duration.SECONDS_IN_MINUTE);
        }
    }

    /**
     * Returns the current number of seconds represented by this `Duration` instance, rounded to the nearest integer value.
     */
    get seconds(): number {
        switch (this.unit) {
            case Duration.Unit.MINUTES:
                return this.quantity * Duration.SECONDS_IN_MINUTE;
            case Duration.Unit.SECONDS:
                return this.quantity;
            case Duration.Unit.MILLISECONDS:
                return Math.round(this.quantity / Duration.MILLIS_IN_SECONDS);
        }
    }

    /**
     * Returns the current number of milliseconds represented by this `Duration` instance.
     */
    get milliseconds(): number {
        switch (this.unit) {
            case Duration.Unit.MINUTES:
                return this.quantity * Duration.SECONDS_IN_MINUTE * Duration.MILLIS_IN_SECONDS;
            case Duration.Unit.SECONDS:
                return this.quantity * Duration.MILLIS_IN_SECONDS;
            case Duration.Unit.MILLISECONDS:
                return this.quantity;
        }
    }
}

export namespace Duration {
    /**
     * Units of duration.
     */
    export enum Unit {
        MINUTES,
        MILLISECONDS,
        SECONDS
    }
}

/**
 * An abstraction for any interruptable operation.
 */
export interface Interruptable {
    interrupt: () => void;
}

/**
 * A promise of result type `T` that can be interrupted prematurely, resulting in an early resolution.
 */
export type InterruptablePromise<T> = Promise<T> & Interruptable;

/**
 * Sleeps for a given `Duration`. This is essentially a promisified version of `setTimeout`. May be interrupted
 * by calling `interrupt()` on the returned `InterruptablePromise`.
 *
 * @param duration The duration to wait.
 *
 * ```
 * // sleep 5 seconds
 * await sleep(Duration.seconds(5));
 *
 * // sleep 10 minutes unless interrupted by an event
 * const promise = sleep(Duration.minutes(10));
 * events.on('someEvent', promise.interrupt);
 * await promise;
 * ```
 */
export function sleep(duration: Duration): InterruptablePromise<void>;
/**
 * Sleeps for a given duration, with units defaulting to milliseconds. This is essentially a promisified version
 * of `setTimeout`. May be interrupted by calling `interrupt()` on the returned `InterruptablePromise`.
 *
 * @param quantity The quantity of duration to wait.
 * @param unit The `Duration.Unit` in which quantity is specified, defaulting to milliseconds.
 *
 * ```
 * // sleep 5 seconds
 * await sleep(5000);
 *
 * // sleep 10 minutes unless interrupted by an event
 * const promise = sleep(10, Duration.Unit.MINUTES);
 * events.on('someEvent', promise.interrupt);
 * await promise;
 * ```
 */
export function sleep(quantity: number, unit?: Duration.Unit): InterruptablePromise<void>;
// underlying function
export function sleep(durationOrQuantity: Duration | number, unit: Duration.Unit = Duration.Unit.MILLISECONDS): InterruptablePromise<void> {
    const duration = durationOrQuantity instanceof Duration ? durationOrQuantity : new Duration(durationOrQuantity, unit);
    let handle: Optional<NodeJS.Timer>;
    let doResolve: () => void;
    const wake = () => {
        if (!handle) return;
        clearTimeout(handle);
        handle = undefined;
        doResolve();
    };
    const promise = new Promise<void>(resolve => {
        doResolve = resolve;
        handle = setTimeout(wake, duration.milliseconds);
    });
    return Object.assign(promise, { interrupt: wake });
}
