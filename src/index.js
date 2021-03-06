export default function (babel) {
  const t = babel.types;

  function timeout (assert) {
    return t.expressionStatement(
      t.callExpression(
        t.identifier('setTimeout'),
        [
          t.functionExpression(null, [], t.blockStatement([assert])),
          t.numericLiteral(0),
        ]
      )
    );
  }

  function console_ (method, args) {
    return t.expressionStatement(t.callExpression(
      t.memberExpression(
        t.identifier('console'),
        t.identifier(method)),
      args));
  }

  function consoleTest (thing, fromValue) {
    const assert = console_('assert',
      [
        t.binaryExpression('!==', t.unaryExpression('typeof', t.identifier(thing)), t.stringLiteral('undefined')),
        t.stringLiteral('[IMPORT]:'),
        t.stringLiteral(thing),
        t.stringLiteral('from'),
        t.stringLiteral(fromValue),
        t.stringLiteral('is undefined.'),
      ]
    );

    return timeout(assert);
  }

  return {
    visitor: {
      ImportDeclaration (path, state) {
        path.node.specifiers.map((specifier, idx) => {
          path.insertAfter(consoleTest(specifier.local.name, path.node.source.value));
        });
      },
    },
  };
}

