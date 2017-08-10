// Copyright 2017, Venkat Peri.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

const assert = require( 'assert' );
const gulp = require( 'gulp' );
const spawnTask = require( '..' );

describe( 'spawn task', () => {

  it( 'runs a cmd', ( done ) => {
    spawnTask( 'test', {
      cmd: 'ls'
    }, done );
    gulp.start( 'test' )
  } );

  it( 'errors for bad cmd', ( done ) => {
    spawnTask( 'test', {
      cmd: 'lsadf'
    }, ( err ) => {
      assert.isPrototypeOf( err, Error )
      if ( !err ) done( 'expected error' )
      done();
    } );
    gulp.start( 'test' )
  } );

  it( 'errors for bad cmd', ( done ) => {
    spawnTask( 'test', {
      cmd: 'rm /tmp/asjdfipasdfpiasfsa'
    }, ( err ) => {
      assert.isPrototypeOf( err, Error )
      if ( !err ) done( 'expected error' )
      done();
    } );
    gulp.start( 'test' )
  } )

  it( 'waits for command to complete', ( done ) => {
    let t1done = false;

    spawnTask( 't1', {
      cmd: 'sleep',
      args: [3]
    }, () => {
      t1done = true;
    } );

    gulp.task( 't2', ['t1'], (  ) => {
      if ( !t1done ) return done( 't1 not done' )
      else done();
    } )
    gulp.start('t2')
  } )

} )
;