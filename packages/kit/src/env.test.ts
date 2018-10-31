/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

// tslint:disable:no-unused-expression

import { expect } from 'chai';
import { Env } from './env';
import { InvalidDefaultEnvValueError } from './errors';

describe('Env', () => {
  let env: Env;

  beforeEach(() => {
    env = new Env({
      FOO: 'BAR',
      BOOL: 'true',
      BOOL2: '1',
      SET: 'a',
      SET2: 'c',
      SET3: 'b',
      LIST: 'a,b,c',
      ENUM: 'test',
      NONE: undefined
    });
  });

  it('should get a string envar', () => {
    expect(env.getString('FOO')).to.equal('BAR');
  });

  it('should get a default string when asked for a non-existent string envar', () => {
    expect(env.getString('FOO2', 'BAR')).to.equal('BAR');
  });

  it('should get a string envar from a known set of values', () => {
    expect(env.getStringIn('SET', ['a', 'b'])).to.equal('a');
  });

  it('should get a string envar from a known set of values from an enum with differently cased keys', () => {
    enum Expected {
      A,
      B
    }
    expect(env.getStringIn('SET3', Object.keys(Expected))).to.equal('b');
  });

  it('should get undefined given an invalid member of a known set of values', () => {
    expect(env.getStringIn('SET2', ['a', 'b'])).to.be.undefined;
  });

  it('should get a default given an invalid member of a known set of values', () => {
    expect(env.getStringIn('SET2', ['a', 'b'], 'b')).to.equal('b');
  });

  it('should not throw given an valid default with different casing from the known set of values', () => {
    expect(env.getStringIn('SET2', ['a', 'b', 'c'], 'C')).to.equal('c');
  });

  it('should throw given an invalid default and an invalid member of a known set of values', () => {
    expect(() => env.getStringIn('SET2', ['a', 'b'], 'c')).to.throw(
      InvalidDefaultEnvValueError
    );
  });

  it('should get a string envar as a key of an object', () => {
    const obj = { BAR: 'TEST' };
    const value = env.getKeyOf('FOO', obj);
    expect(value).to.equal('BAR');
  });

  it('should get a string envar as a key of an object, with a transform', () => {
    const obj = { bar: 'TEST' };
    const value = env.getKeyOf('FOO', obj, v => v.toLowerCase());
    expect(value).to.equal('bar');
  });

  it('should get a string envar as a key of an enum, with a transform', () => {
    enum Mode {
      TEST = 'test',
      DEMO = 'demo'
    }
    const value = env.getKeyOf('ENUM', Mode, Mode.DEMO, v => v.toUpperCase());
    expect(value).to.equal('TEST');
    expect(Mode[value]).to.equal(Mode.TEST);
  });

  it('should get a default for an undefined envar from an enum, with a transform', () => {
    enum Mode {
      TEST = 'test',
      DEMO = 'demo'
    }
    const value = env.getKeyOf('ENUM2', Mode, Mode.DEMO, v => v.toUpperCase());
    expect(value).to.equal('DEMO');
    expect(Mode[value]).to.equal(Mode.DEMO);
  });

  it('should set a string envar', () => {
    env.setString('FOO2', 'BAR2');
    expect(env.getString('FOO2')).to.equal('BAR2');
  });

  it('should get a list envar', () => {
    expect(env.getList('LIST')).to.deep.equal(['a', 'b', 'c']);
  });

  it('should set a list envar', () => {
    env.setList('LIST2', ['a', 'b', 'c', 'd']);
    expect(env.getList('LIST2')).to.deep.equal(['a', 'b', 'c', 'd']);
  });

  it('should unset a list envar implicitly', () => {
    env.setList('LIST2', undefined);
    expect(env.getList('LIST2')).to.be.undefined;
  });

  it('should delete a string envar explicitly', () => {
    env.unset('FOO');
    expect(env.getString('FOO')).to.be.undefined;
  });

  it('should delete a string envar implicitly', () => {
    env.setString('FOO', undefined);
    expect(env.getString('FOO')).to.be.undefined;
  });

  it('should get a boolean envar set to true', () => {
    expect(env.getString('BOOL')).to.equal('true');
    expect(env.getBoolean('BOOL')).to.be.true;
  });

  it('should get a boolean envar set to 1', () => {
    expect(env.getString('BOOL2')).to.equal('1');
    expect(env.getBoolean('BOOL2')).to.be.true;
  });

  it('should get a default boolean when asked for a non-existent boolean envar', () => {
    expect(env.getString('BOOL3', 'true')).to.equal('true');
    expect(env.getBoolean('BOOL3', true)).to.be.true;
  });

  it('should set a boolean envar', () => {
    env.setBoolean('BOOL3', true);
    expect(env.getString('BOOL3')).to.equal('true');
    expect(env.getBoolean('BOOL3')).to.be.true;
  });

  it('should delete a boolean envar', () => {
    env.unset('BOOL');
    expect(env.getString('BOOL')).to.be.undefined;
    expect(env.getBoolean('BOOL')).to.be.false;
  });

  it('should delete a boolean envar implicitly', () => {
    env.setBoolean('BOOL', undefined);
    expect(env.getString('BOOL')).to.be.undefined;
    expect(env.getBoolean('BOOL')).to.be.false;
  });

  it('should easily enumerate all defined entries', () => {
    expect(env.entries()).to.deep.equal([
      ['FOO', 'BAR'],
      ['BOOL', 'true'],
      ['BOOL2', '1'],
      ['SET', 'a'],
      ['SET2', 'c'],
      ['SET3', 'b'],
      ['LIST', 'a,b,c'],
      ['ENUM', 'test']
    ]);
  });
});
