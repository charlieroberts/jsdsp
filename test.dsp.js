{ 
  "use jsdsp"; 
  const a = 1 + { test:2 }
}

{
  "use jsdsp";
  if( { a:1 } < { b:2 } ) {
    const c = 3 + {test:4}
  }
}

function tester() {
  "use jsdsp"

  const d = 2 + { test:5 }

  return d
}

{ // nope
  const b = 1 + { test:2 }
}


function tester2() {
  { 
    "use jsdsp"
    const c = 2 + {}
  }

  // no go
  const d = 3 + {}
}
