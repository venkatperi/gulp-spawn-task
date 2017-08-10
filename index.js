const gulp = require( 'gulp' );
const gutil = require( 'gulp-util' );
const mergeStream = require( 'merge-stream' );
const spawn = require( 'cross-spawn' );


function type( obj ) {
  return Object.prototype.toString.call( obj ).slice( 8, -1 ).toLowerCase();
}

function nop( x ) {
  return x;
}

/**
 * Creates a gulp task which invokes `ChildProcess.spawn()`. Logs any output
 * from the spawned process via gutil.log().
 *
 * @param name {string} name of the task
 * @param deps {string[]} optional dependencies for this task
 * @param opts {Object} - spawn options
 * @param {string} opts.cmd - command to invoke
 * @param {string[]} [opts.args] - command args
 * @param {Object} [opts.opts] - spawn options
 * @param {string} [opts.tag=name] - logger tag
 * @param {string} [opts.data] - string data to be written to the process' stdin
 * @param cb {Function} Optional callback invoked when the spawned process terminates.
 * @returns {Gulp} the gulp instance, for chaining.
 */
function spawnTask( name, deps, opts, cb ) {
  // no deps?
  if ( type( deps ) === 'object' ) {
    cb = opts;
    opts = deps;
    deps = null;
  }
  opts = opts || {};
  const tag = opts.tag || name;
  cb = cb || nop;

  return gulp.task( name, opts.deps, ( done ) => {
    const proc = spawn( opts.cmd, opts.args, opts.opts );
    if ( opts.data ) {
      proc.stdin.write( opts.data );
    }

    const logger = ( buffer ) => {
      buffer.toString()
        .split( /\n/ )
        .forEach( ( message ) => gutil.log( `${tag}: ${message}` ) );
    };

    let _doneCalled = false;
    const _done = ( err ) => {
      if ( _doneCalled ) return;
      _doneCalled = true;
      if ( type( err ) === 'number' && err !== 0 ) {
        err = new Error( `Process exited with non-zero error code: ${err}` );
      }
      done( cb( err ) );
    };

    proc.on( 'error', _done ).on( 'exit', _done );

    const merged = new mergeStream( proc.stdout, proc.stderr );
    if ( type( opts.dest ) === 'function' ) {
      opts.dest( merged );
    }
    opts.dest ? merged.pipe( opts.dest ) : merged.on( 'data', logger );
  } );
}

module.exports = spawnTask;
