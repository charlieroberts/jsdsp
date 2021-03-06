module.exports = function({ types: t }) {

  const operators = {
    '+':  'add',
    '-':  'sub',
    '*':  'mul',
    '/':  'div',
    '^':  'pow',
    '**': 'pow',
    '%':  'mod',
    '+=': 'add',
    '*=': 'mul',
    '-=': 'sub',
    '/=': 'div',
    '%=': 'mod',
    '^=': 'pow',
    '<':  'lt',
    '<=': 'lte',
    '>':  'gt',
    '>=': 'gte',
    '==': 'eq',
    '===':'eq',
    '!=': 'neq',
    '!==':'neq',
    '&&': 'and' 
  }

  const innerVisitor = {
    BinaryExpression( path, state ) {
      //console.log( 'jsdsp:', state.usejsdsp )

      if( state.usejsdsp === false ) return

      // don't transform if arguments are both number literals
      if( t.isNumericLiteral( path.node.left ) && t.isNumericLiteral( path.node.right ) ) return

      // don't transform if no overload is found
      if( !(path.node.operator in operators) ) return

      const operatorString = operators[ path.node.operator ]

      path.replaceWith(
        t.callExpression(
          t.memberExpression(
            t.identifier( 'genish' ),
            t.identifier( operatorString )
          ),
          [ path.node.left, path.node.right ]
        )
      )
    },

    AssignmentExpression( path, state ) {
      if( state.usejsdsp === false ) return

      // don't transform if arguments are both number literals
      if( t.isNumericLiteral( path.node.left ) && t.isNumericLiteral( path.node.right ) ) return

      // don't transform if no overload is found
      if( !(path.node.operator in operators) ) return

      if( path.node.operator.length < 2 ) return

      const operatorString = operators[ path.node.operator ]

      path.replaceWith(
        t.assignmentExpression( 
          '=',
          path.node.left,

          t.callExpression(
            t.memberExpression(
              t.identifier( 'genish' ),
              t.identifier( operatorString )
            ),
            [ path.node.left, path.node.right ]
          )
        )
      )
    },
    ExpressionStatement( path, state ) {
      if( path.node.expression.value === 'use jsdsp' ) {
        state.usejsdsp = true
        //path.traverse( innerVisitor, state )
      }
      //state.usejsdsp = false
      //path.skip()
    },

    BlockStatement( path, state ) {
      if( path.node.directives !== undefined ) {
        path.node.directives.forEach( directive => {
          if( directive.value.value === 'use jsdsp' ) {
            state.usejsdsp = true
          }
        })
      }
      path.traverse( innerVisitor, state )
      state.usejsdsp = false;
      path.skip()
    }
  }

  return {
    visitor: {
      BlockStatement( path, state ) {
        // off by default

        state.usejsdsp = false

        if( path.node.directives !== undefined ) {
          path.node.directives.forEach( directive => {
            if( directive.value.value === 'use jsdsp' ) {
              state.usejsdsp = true
            }
          })
        }

        path.traverse( innerVisitor, state )
        path.skip()
        state.usejsdp = false
      },

      Function( path, state ) {
        state.usejsdsp = false

        path.traverse( innerVisitor, state )

        state.usejsdsp = false
        path.skip()

      },
    }
  }
}
