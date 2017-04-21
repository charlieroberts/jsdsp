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
    '^=': 'pow'
  }

  return {
    visitor: {
      BinaryExpression( path ) {

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

      AssignmentExpression( path ) {

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
      }
    }
  }
}
