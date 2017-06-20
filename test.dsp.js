{ 
  "use jsdsp"; 
  const a = 1 + { test:2 }
}

{ // nope
  const b = 1 + { test:2 }
}

{
  "use jsdsp";
  if( { a:1 } < { b:2 } ) {
    const c = 3 + {test:4}
  }
}
