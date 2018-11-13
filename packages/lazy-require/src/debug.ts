import * as Debug from 'debug';

const doTrace = (process.env.LAZY_REQUIRE_TRACE || '').toLowerCase() === 'true';

export const debug = Debug('lazy-require');
export const trace = doTrace ? debug : (...args: any[]) => {}; // tslint:disable-line:no-any
