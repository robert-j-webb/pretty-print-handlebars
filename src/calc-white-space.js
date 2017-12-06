const { TAB_SIZE } = require('../config');
const getDepth = require('./get-depth');

/**
 * Returns how a newline and how many spaces the node will need based off of
 * it's depth which is calculated by seeing how many parents it has.
 * This is used to print spacing correctly
 * @param {Node} node
 * @param {number} depthOffset
 */
function calcWhiteSpace(node, depthOffset = 0) {
  const depth = getDepth(node);
  return '\n' + ' '.repeat(Math.abs((depth + depthOffset) * TAB_SIZE));
}

module.exports = calcWhiteSpace;
