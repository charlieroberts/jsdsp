#.jsdsp

jsdsp is a small plugin for Babel that enables faux operator overloading in JavaScript. For example, consider the following two snippets of genish.js code:

```javascript

/*** regular JS, no jsdsp ***/
amplitudeLFO = add( 
  .1, 
  mul( cycle(4), .1 ) 
) 
play( mul( cycle( 440 ), amplitudeLFO ) )


/*** using jsdsp ***/
amplitudeLFO = .1 + cycle( 4 ) * .1
play( cycle( 440 ) * amplitudeLFO )
```

For many types of algorithms (especially the differential equations found in most filters) I think the second form is much easier to write, read, and reason about.

## Overloaded Operators

| Operators | jsdsp expression      | conversion                        |
| --------- | -------------------   | -------------------------------   |
|    `+`    | `cycle(440) + .1`     | `genish.add( cycle(440), .1 )`    |
|    `-`    | `noise() - .1`        | `genish.sub( noise(), .1 )`       |
|    `*`    | `phasor(220) * .5`    | `genish.mul( phasor(220), .5 )`   |
|    `/`    | `train(110) / 2`      | `genish.div( train(110), 2 )`     |
|    `%`    | `noise() % noise()`   | `genish.mod( noise(), noise() )`  |
|    `^`    | `cycle(110) ^ 2`      | `genish.pow( cycle(110), 2 )`     |
|    `**`   | `cycle(110) ** 2`     | `genish.pow( cycle(110), 2 )`     |
|    `+=`   | `a += cycle(440)`     | `a = genish.add( a, cycle(440) )` |
|    `-=`   | `a -= cycle(440)`     | `a = genish.sub( a, cycle(440) )` |
|    `*=`   | `b *= noise()`        | `b = genish.mul( b, noise()  ) `  |
|    `/=`   | `c /= noise()`        | `c = genish.div( c, noise() )`    |
|    `%=`   | `d %= noise()`        | `d = genish.mod( d, noise() )`    |
|    `^=`   | `e ^= 2`              | `e = genish.pow( e, 2 )`          |

## Using with Gulp

Below is a simple gulp script that reads in .jsdsp files and converts them to .js files. The jsdsp plugin is available via NPM.

```javascript

const babel  = require( 'gulp-babel'  )
const jsdsp  = require( 'jsdsp' )
const rename = require( 'gulp-rename' )

// convert .jsdsp into .js files
gulp.task( 'jsdsp', ()=> {
  gulp.src( './js/**/*.jsdsp', { base:'./' })
      .pipe( babel({ plugins:jsdsp }) )
      .pipe( rename( path => path.ext = '.js' ) )
      .pipe( gulp.dest('.') )
})
```

For a more complete example of a workflow (including browserify etc.) see the [gulpfile for Gibberish](http://github.com/charlieroberts/Gibberish/blob/v3/gulpfile.js).

## Using in the Browser
This example shows how to use jsdsp in an online code editor (see the [genish.js playground](http://charlie-roberts.com/genish/playground) for an example of this). The example assumes you have a html `textarea` element with some jsdsp code placed inside of it somewhere on your page.


```javascript
const Babel = require( 'babel-standalone' )
const jsdsp = require( 'jsdsp' )

Babel.registerPlugin( 'jsdsp', jsdsp )

const rawCode = document.querySelector( 'textarea' ).innerText
const transformedCode = Babel.transform( rawCode, presets:[], plugins:['jsdsp'] ).code 
```
