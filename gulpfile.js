const babel  = require( 'gulp-babel'  )
const jsdsp  = require( './jsdsp' )
const rename = require( 'gulp-rename' )
const gulp   = require( 'gulp' )

// convert .jsdsp into .js files
gulp.task( 'jsdsp', ()=> {
  gulp.src( './*.dsp.js', { base:'./' })
      .pipe( babel({ plugins:jsdsp }) )
      .pipe( rename( path => {
        path.basename = path.basename.split('.')[0]
      } ))
      .pipe( gulp.dest('.') )
})
