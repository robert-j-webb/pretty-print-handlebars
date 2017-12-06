const { COLUMN_BREAK, TAB_SIZE } = require('../config');
const getDepth = require('./get-depth');
const len = require('./len');
/**
 * @param {Node} node
 */
function shouldBreak(node) {
  if (!node) {
    return false;
  }
  switch (node.type) {
    case 'BlockStatement':
    case 'ElementNode':
    case 'MustacheStatement':
      return prevNewLine(node) + len(node) > COLUMN_BREAK;
    case 'SubExpression':
    case 'Hash':
    case 'HashPair':
    case 'ConcatStatement':
    case 'AttrNode': {
      if (shouldBreak(node.parent)) {
        return prevNewLine(node) + len(node) > COLUMN_BREAK;
      } else {
        return false;
      }
    }
    default:
      throw new Error(node.type + ' not for breaking ' + node.loc.start.line);
  }
}

function prevNewLine(node) {
  if (!node.parent) {
    return 0;
  }
  const depth = getDepth(node);
  return depth * TAB_SIZE;
}

module.exports = shouldBreak;
