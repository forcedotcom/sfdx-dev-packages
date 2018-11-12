/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

// A simple utility for gathering module loading statistics for diagnostic purposes.

// tslint:disable:no-any
// tslint:disable:no-var-requires
// tslint:disable:variable-name

// -------------------------------------------------------------------------------
// No requires or imports so we can instrument as much module loading as possible.
// -------------------------------------------------------------------------------

export interface Entry {
  [key: string]: number;
}

export class Node {
  public children: { [key: string]: Node } = {};
  public elapsed = 0;
}

export interface Report {
  time: number;
  size: number;
  list: Entry;
  tree: Node;
}

export interface Analytics {
  report: () => Report;
  dump: (arg?: any) => void;
}

export function start(enabled: boolean, Module?: any): Analytics {
  const list: { [key: string]: number } = {};
  let node = new Node();
  let loading = false;
  let time = 0;

  if (enabled) {
    const paths = require('path');
    Module = Module || require('module');
    const origLoad = Module._load;
    let path = '';

    Module._load = (request: string, parent: object, isMain: boolean) => {
      const wasLoading = loading;
      loading = true;

      const lastPath = path;
      path = paths.resolve(path, request);
      const lastNode = node;
      if (!lastNode.children[request]) {
        lastNode.children[request] = new Node();
      }
      node = lastNode.children[request];

      const mark = Date.now();
      const mod = origLoad.call(Module, request, parent, isMain);
      const elapsed = Date.now() - mark;

      if (!list[path]) list[path] = elapsed;
      if (node.elapsed == null) node.elapsed = elapsed;
      node = lastNode;
      path = lastPath;

      if (!wasLoading) {
        loading = false;
        time += elapsed;
      }

      return mod;
    };
  }

  const analytics = {
    report(): Report {
      return { time, size: Object.keys(list).length, list, tree: node };
    },
    dump(): void {
      if (enabled) {
        console.error(JSON.stringify(analytics.report(), null, 2));
      }
    }
  };

  return analytics;
}
