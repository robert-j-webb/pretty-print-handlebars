/**
 * Used as a plugin for the glimmer-vm processor.
 * Adds parents to each node in the AST.
 * By traversing through parents until the root is reached, this is how depth
 * can be calculated for the purpose of finding out how many tabs to use.
 */
function setParents() {
  return {
    visitor: {
      HashPair(node) {
        setParent(node, node.value);
      },
      ElementModifierStatement(node) {
        setParent(node, [node.hash].concat(node.params));
      },
      MustacheStatement(node) {
        setParent(node, [node.hash].concat(node.params));
      },
      Hash(node) {
        setParent(node, node.pairs);
      },
      SubExpression(node) {
        setParent(node, [node.hash].concat(node.params));
      },
      ConcatStatement(node) {
        setParent(node, node.parts);
      },
      AttrNode(node) {
        setParent(node, node.value);
      },
      BlockStatement(node) {
        const body = [node.program]
          .concat(node.inverse ? node.inverse : [])
          .concat(node.hash ? [node.hash] : [])
          .concat(node.params);
        setParent(node, body);
      },
      ElementNode(node) {
        setParent(
          node,
          node.children
            .concat(node.attributes)
            .concat(node.modifiers)
            .concat(node.comments)
        );
      },
      Program(node) {
        setParent(node, node.body);
      }
    }
  };
}

function setParent(parent, child) {
  if (!(parent && child)) {
    throw new Error('There needs to be a parent and a child');
  }
  if (child instanceof Array) {
    child.forEach(n => (n.parent = parent));
  } else {
    child.parent = parent;
  }
}
module.exports = setParents;
