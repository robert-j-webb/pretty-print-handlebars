/**
 * Traverses up the tree to find how nested a node is.
 * Used for calculation of space.
 * @param {Node} node
 */
function getDepth(node) {
  // SubExpressions themselves count as + 1 depth
  let num = 0;
  let parent = node.parent;
  while (parent) {
    switch (parent.type) {
      case 'ElementNode':
      case 'MustacheStatement':
      case 'BlockStatement':
      case 'SubExpression':
      case 'HashPair':
      case 'ElementModifierStatement':
        num++;
    }
    parent = parent.parent;
  }
  return num;
}

module.exports = getDepth;
