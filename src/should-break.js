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
    case 'SubExpression':
    case 'Hash':
    case 'HashPair':
    case 'ConcatStatement':
    case 'AttrNode': {
      return prevNewLine(node) + len(node) > COLUMN_BREAK;
    }
    default:
      throw new Error(node.type + ' not for breaking ' + node.loc.start.line);
  }
}

function prevNewLine(node) {
  return getDepth(node) * TAB_SIZE;
}

module.exports = shouldBreak;
