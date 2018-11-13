import fs = require('fs');

export type FileSystem = Pick<typeof fs, 'readFileSync' | 'writeFileSync' | 'unlinkSync'>;

export type ResolveFilenameFunction = (request: string, parent: ProxiableModule, isMain: boolean) => string;

export type KeyedObject = {
  // tslint:disable-next-line:no-any
  [key: string]: any;
  // tslint:disable-next-line:no-any
  [key: number]: any;
  // TODO: un-comment this once tsc supports symbol-keyed index signatures
  // [key: symbol]: any;
};
export type ObjectModule = object;
export type FunctionModule = (...args: any[]) => any; // tslint:disable-line:no-any
export type ProxiableModule = (ObjectModule | FunctionModule) & KeyedObject;

export type LoadModuleFunction = (request: string, parent: ProxiableModule, isMain: boolean) => ProxiableModule;

export interface LoadModule extends LoadModuleFunction {
  _origLoad?: LoadModuleFunction;
}

export interface Module {
  _load: LoadModule;
  _resolveFilename: ResolveFilenameFunction;
}
