const calcWhiteSpace = require('./calc-white-space');
const getBody = require('./get-body');
const splitNoParens = require('./split-no-parens');
const shouldBreak = require('./should-break');

/**
 * The main pretty formatting function.
 * This is originally based off of the glimmer-vm print with heavy
 * modifications to put in new lines and spaces at the correct spots.
 * @param {Node} ast
 */
function build(ast) {
  if (!ast) {
    return '';
  }
  /**
   * What will be rendered. Is built recursively.
   */
  const output = [];

  switch (ast.type) {
    /**
     * Programs are either: The root of the AST, the body of a BlockElement or ElementNode
     */
    case 'Program':
      {
        const chainBlock = ast['chained'] && ast.body[0];
        if (chainBlock) {
          chainBlock['chained'] = true;
        }
        let body = buildEach(ast.body.filter(checkIfEmpty)).join('');
        output.push(body);
      }
      break;
    /**
     * Element nodes are traditional HTML elements like:
     * <tag attribute='value' {{modifier}} {{! comment }}>
     *  children
     * </tag>
     */
    case 'ElementNode': {
      output.push('<', ast.tag);
      const children = ast.children.filter(checkIfEmpty);
      const joinCharacter = shouldBreak(ast) ? calcWhiteSpace(ast, 1) : ' ';
      if (ast.attributes.length) {
        output.push(' ', buildEach(ast.attributes).join(joinCharacter));
      }
      if (ast.modifiers.length) {
        output.push(' ', buildEach(ast.modifiers).join(joinCharacter));
      }
      if (ast.comments.length) {
        output.push(' ', buildEach(ast.comments).join(joinCharacter));
      }
      output.push('>');
      if (children.length > 0) {
        output.push(calcWhiteSpace(ast, 1));
      }
      output.push(...buildEach(ast.children));
      if (children.length > 0) {
        output.push(calcWhiteSpace(ast));
      }
      output.push('</', ast.tag, '>');
      const body = getBody(ast);
      const isLast = body && body.length - 1 === body.indexOf(ast);
      if (!isLast) {
        output.push(calcWhiteSpace(ast).repeat(2));
      }
      break;
    }
    /**
     * Block statements are invocations that have a body of their own.
     * {{#block [params] with param as |block param|}}
     *   [Program]
     * {{else}}
     *   [Inverse Program]
     * {{/block}}
     */
    case 'BlockStatement':
      {
        const lines = [];

        if (ast['chained']) {
          lines.push(['{{else ', pathParams(ast), '}}'].join(''));
        } else {
          lines.push(openBlock(ast));
        }

        lines.push(build(ast.program));

        if (ast.inverse) {
          if (!ast.inverse['chained']) {
            lines.push(
              `${calcWhiteSpace(ast)}{{else}}${calcWhiteSpace(ast, 1)}`
            );
          }
          lines.push(build(ast.inverse));
        }

        if (!ast['chained']) {
          lines.push(closeBlock(ast));
        }
        output.push(lines.join(''));
      }
      break;
    /**
     * Mustache Statements are simple invocations of helpers or components
     * Like {{hello-component param hashPair=value}}
     */
    case 'MustacheStatement':
      {
        const body = getBody(ast);
        const isLast = body.length - 1 === body.indexOf(ast);
        const params = pathParams(ast, shouldBreak(ast));
        output.push(
          compactJoin(['{{', params, '}}', !isLast ? calcWhiteSpace(ast) : ''])
        );
      }
      break;
    /**
     * SubExpressions are helper invocations inside of mustache or block statements.
     * {{#block (helper param hashKey=value)}}
     * They have some of the more complex spacing rules.
     */
    case 'SubExpression':
      {
        if (shouldBreak(ast)) {
          const splitParams = splitNoParens(pathParams(ast));
          output.push(
            calcWhiteSpace(ast),
            '(',
            splitParams.reduce((str, param, idx, arr) => {
              if (idx !== arr.length - 1) {
                return str + param.trim() + calcWhiteSpace(ast, 1);
              } else {
                return str + param + (idx === 0 ? ' ' : '');
              }
            }, ''),
            calcWhiteSpace(ast),
            ')',
            calcWhiteSpace(ast, -1)
          );
        } else {
          output.push('(', pathParams(ast), ')');
        }
      }
      break;
    /**
     * Hashes are the data structure that contain hashPairs.
     * {{mustache [a=b c=d d=e...]}}
     */
    case 'Hash':
      {
        const needsNewLine = shouldBreak(ast.parent);
        if (needsNewLine) {
          ast.pairs.forEach(pair => (pair.shouldSpace = true));
        }
        const pairs = buildEach(ast.pairs);
        output.push(pairs.join(needsNewLine ? '' : ' '));
      }
      break;
    /**
     * HashPairs are the data structure that contain the key & value pair
     * {{mustache [key=value]}}
     */
    case 'HashPair':
      {
        const hash = ast.parent;
        const isLastHashPair =
          hash.pairs.findIndex(n => n === ast) === hash.pairs.length - 1;

        const isFirstHashPair = hash.pairs.findIndex(n => n === ast) === 0;
        if (ast.shouldSpace) {
          output.push(
            isFirstHashPair ? calcWhiteSpace(ast) : '',
            `${ast.key}=${build(ast.value)}` +
              calcWhiteSpace(ast, isLastHashPair ? -1 : 0)
          );
        } else {
          output.push(`${ast.key}=${build(ast.value)}`);
        }
      }
      break;
    /**
     * AttrNodes are attributes, which are exclusively in ElementNodes
     * <tag attribute="value"></tag>
     */
    case 'AttrNode': {
      output.push(ast.name, '=');
      const value = build(ast.value);
      if (ast.value.type === 'TextNode') {
        output.push('"', value, '"');
      } else {
        output.push(value);
      }
      break;
    }
    /**
     * Concat statements are used when attribute values have their own helpers
     * <tag attribute="value {{if true otherValue}}"></tag>
     * In that situation, the concat would have the pairs of a textNode and a
     * mustacheStatement
     */
    case 'ConcatStatement': {
      output.push('"');
      const needsNewLine = shouldBreak(ast);
      if (needsNewLine) {
        output.push(calcWhiteSpace(ast));
      }
      ast.parts.forEach((node, idx, arr) => {
        if (node.type === 'StringLiteral') {
          output.push(node.original);
        } else {
          output.push(build(node));
        }
        if (needsNewLine && idx !== arr.length - 1) {
          output.push(calcWhiteSpace(ast));
        }
      });
      if (needsNewLine) {
        output.push(calcWhiteSpace(ast, -1));
      }
      output.push('"');
      break;
    }
    /**
     * Text nodes are simply nodes that contain only text.
     * <div> TextNode </div>
     * They are not keys to hashPairs, or pathExpressions.
     */
    case 'TextNode':
      output.push(ast.chars);
      break;
    case 'MustacheCommentStatement':
      {
        output.push(
          compactJoin(['{{!--', ast.value, '--}}', calcWhiteSpace(ast)])
        );
      }
      break;
    case 'ElementModifierStatement':
      {
        output.push(compactJoin(['{{', pathParams(ast), '}}']));
      }
      break;
    /**
     * Path Expressions are used to declare blocks
     * {{#path-expression/to-block param hashPair=value}}
     */
    case 'PathExpression': {
      output.push(ast.original);
      break;
    }
    case 'BooleanLiteral':
      output.push(ast.value ? 'true' : 'false');
      break;
    case 'PartialStatement': {
      throw new Error('Handlebar partials are not supported');
    }
    case 'CommentStatement':
      {
        output.push(compactJoin(['<!--', ast.value, '-->']));
      }
      break;
    case 'StringLiteral':
      {
        output.push(`"${ast.value}"`);
      }
      break;
    case 'NumberLiteral':
      {
        output.push(String(ast.value));
      }
      break;
    case 'UndefinedLiteral':
      {
        output.push('undefined');
      }
      break;
    case 'NullLiteral':
      {
        output.push('null');
      }
      break;
  }
  return output.join('');
}

function compact(array) {
  const newArray = [];
  array.forEach(a => {
    if (typeof a !== 'undefined' && a !== null && a !== '') {
      newArray.push(a);
    }
  });
  return newArray;
}

function buildEach(asts) {
  return asts.map(build);
}

function pathParams(ast, shouldBreak) {
  let path;

  switch (ast.type) {
    case 'MustacheStatement':
    case 'SubExpression':
    case 'ElementModifierStatement':
    case 'BlockStatement':
      if (isLiteral(ast.path)) {
        return String(ast.path.value);
      }

      path = build(ast.path);
      break;
    case 'PartialStatement':
      path = build(ast.name);
      break;
    default:
      throw new Error('unreachable');
  }

  return compactJoin(
    [
      path,
      buildEach(ast.params).join(shouldBreak ? calcWhiteSpace(ast) : ' '),
      build(ast.hash)
    ],
    ' '
  );
}

function compactJoin(array, delimiter) {
  return compact(array).join(delimiter || '');
}

function blockParams(block) {
  const params = block.program.blockParams;
  if (params.length) {
    return ` as |${params.join(' ')}|`;
  }

  return null;
}

function openBlock(block) {
  return [
    '{{#',
    pathParams(block),
    blockParams(block),
    '}}',
    calcWhiteSpace(block, 1)
  ].join('');
}

function closeBlock(block) {
  const body = getBody(block);
  const isLast = body.length - 1 === body.indexOf(block);
  return [
    calcWhiteSpace(block),
    '{{/',
    build(block.path),
    '}}',
    !isLast ? calcWhiteSpace(block) : ''
  ].join('');
}

function isLiteral(input) {
  return !!(typeof input === 'object' && input.type.match(/Literal$/));
}

function checkIfEmpty(node) {
  return (
    node.type !== 'TextNode' ||
    (node.type === 'TextNode' && node.chars.trim() !== '')
  );
}

module.exports = build;
