import fs = require('fs');

export type FileSystem = Pick<typeof fs, 'readFileSync' | 'writeFileSync' | 'unlinkSync'>;

export type ResolveFilenameFunction = (request: string, parent: ProxiableModule, isMain: boolean) => string;

export type KeyedObject = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: number]: any;
  // TODO: un-comment this once tsc supports symbol-keyed index signatures
  // [key: symbol]: any;
};
export type ObjectModule = object;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type FunctionModule = (...args: any[]) => any;
export type ProxiableModule = (ObjectModule | FunctionModule) & KeyedObject;

export type LoadModuleFunction = (request: string, parent: ProxiableModule, isMain: boolean) => ProxiableModule;

export interface LoadModule extends LoadModuleFunction {
  _origLoad?: LoadModuleFunction;
}

export interface Module {
  _load: LoadModule;
  _resolveFilename: ResolveFilenameFunction;
}
