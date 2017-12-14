const calcWhiteSpace = require('./calc-white-space');
const getBody = require('./get-body');
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
        output.push(buildEach(ast.body.filter(checkIfEmpty)).join(''));
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
      const needsBreak = shouldBreak(ast);
      const joinCharacter = needsBreak ? calcWhiteSpace(ast, 1) : ' ';
      if (ast.attributes.length) {
        output.push(' ', buildEach(ast.attributes).join(joinCharacter));
        if (ast.modifiers.length && needsBreak) {
          output.push(calcWhiteSpace(ast, 1));
        }
      }
      if (ast.modifiers.length) {
        output.push(
          ast.attributes.length && needsBreak ? '' : ' ',
          buildEach(ast.modifiers).join(joinCharacter)
        );
        if (ast.comments.length && needsBreak) {
          output.push(calcWhiteSpace(ast, 1));
        }
      }
      if (ast.comments.length) {
        output.push(
          ast.modifiers.length && needsBreak ? '' : ' ',
          buildEach(ast.comments).join(joinCharacter)
        );
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
        const needsBreak = shouldBreak(ast);

        if (ast['chained']) {
          lines.push(['{{else ', pathParams(ast, needsBreak), '}}'].join(''));
        } else {
          lines.push(openBlock(ast, needsBreak));
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
        const needsBreak = shouldBreak(ast);
        const params = pathParams(ast, needsBreak);
        const needsNewLine = needsBreak && ast.hash.pairs.length === 0;
        const lastParamIsSubExpression =
          ast.params.length > 0 &&
          ast.params[ast.params.length - 1].type === 'SubExpression';
        output.push(
          compactJoin([
            '{{',
            params,
            needsNewLine && !lastParamIsSubExpression
              ? calcWhiteSpace(ast)
              : '',
            '}}',
            !isLast ? calcWhiteSpace(ast) : ''
          ])
        );
      }
      break;
    /**
     * SubExpressions are helper invocations inside of mustache, block statements
     * or even themselves. This kind of double nesting means that they require
     * a lot more logic when it comes to spacing them correctly.
     * {{#block (helper param hashKey=value)}}
     */
    case 'SubExpression':
      {
        const parentBreak = shouldBreak(ast.parent);
        if (parentBreak && ast.parent.type !== 'SubExpression') {
          output.push(calcWhiteSpace(ast));
        }
        if (shouldBreak(ast)) {
          const needsFinalLine =
            ast.parent.type !== 'SubExpression' &&
            ast.parent.type !== 'HashPair' &&
            ast.parent.type !== 'BlockStatement';
          const params = paramsForSubExpression(ast);
          output.push(
            '(',
            params.reduce((str, param, idx, arr) => {
              const isLast = idx === arr.length - 1;
              return str + param + calcWhiteSpace(ast, isLast ? 0 : 1);
            }, ''),
            ')',
            needsFinalLine ? calcWhiteSpace(ast, -1) : ''
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
          hash.pairs.indexOf(ast) === hash.pairs.length - 1;
        const needsEndNewLine = !(
          hash.parent.type === 'BlockStatement' && isLastHashPair
        );
        const isFirstHashPair = hash.pairs.indexOf(ast) === 0;

        if (ast.shouldSpace) {
          output.push(
            isFirstHashPair ? calcWhiteSpace(ast) : '',
            `${ast.key}=${build(ast.value)}`,
            needsEndNewLine ? calcWhiteSpace(ast, isLastHashPair ? -1 : 0) : ''
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
     * Element modifier statements are mustache expressions inside of element nodes.
     * Like the action helper for example:
     * ```hbs
     * <tag {{action param [hash]}}
     * ```
     * They are identical to mustache statements in terms of data
     */
    case 'ElementModifierStatement': {
      if (shouldBreak(ast)) {
        const isLast =
          ast.parent.comments.length === 0 &&
          ast.parent.modifiers.findIndex(node => ast === node) ===
            ast.parent.modifiers.length - 1;
        const params = paramsForSubExpression(ast).map(a => a.trim());
        output.push(
          calcWhiteSpace(ast),
          '{{',
          params.reduce((str, param, idx, arr) => {
            const isLast = idx === arr.length - 1;
            return str + param + (isLast ? '' : calcWhiteSpace(ast, 1));
          }, ''),
          calcWhiteSpace(ast),
          '}}',
          isLast ? calcWhiteSpace(ast, -1) : ''
        );
      } else {
        output.push(compactJoin(['{{', pathParams(ast), '}}']));
      }
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
        const isOrphan = ast.parent.type === 'Program';
        if (ast.value.includes('\n')) {
          output.push(
            compactJoin([
              '{{!--',
              ast.value,
              '--}}',
              isOrphan ? calcWhiteSpace(ast) : ''
            ])
          );
        } else {
          output.push(
            compactJoin([
              '{{! ',
              ast.value.trim(),
              '}}',
              isOrphan ? calcWhiteSpace(ast) : ''
            ])
          );
        }
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

function paramsForSubExpression(ast) {
  return [getPath(ast), ...buildEach(ast.params), ...buildEach(ast.hash.pairs)];
}

function pathParams(ast, shouldBreak = false) {
  return compactJoin(
    [
      getPath(ast),
      buildEach(ast.params).join(shouldBreak ? calcWhiteSpace(ast, 1) : ' '),
      build(ast.hash)
    ],
    ' '
  );
}

function getPath(ast) {
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
    default:
      throw new Error('unreachable');
  }
  return path;
}

function compactJoin(array, delimiter = '') {
  return compact(array).join(delimiter);
}

function getBlockParams(block) {
  const params = block.program.blockParams;

  if (params.length) {
    if (shouldBreak(block)) {
      return calcWhiteSpace(block) + `as |${params.join(' ')}|`;
    } else {
      return ` as |${params.join(' ')}|`;
    }
  }

  return null;
}

function openBlock(block, needsBreak) {
  const blockParams = getBlockParams(block);
  if (blockParams) {
    return [
      '{{#',
      pathParams(block, needsBreak),
      blockParams,
      '}}',
      calcWhiteSpace(block, 1)
    ].join('');
  }
  return [
    '{{#',
    pathParams(block, needsBreak),
    needsBreak ? calcWhiteSpace(block) : '',
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
