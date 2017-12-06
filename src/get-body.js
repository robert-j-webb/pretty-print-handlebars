/**
 * Returns the body of the AST passed in. This may be the body of a block,
 * a mustache statement, or an element. Empty text nodes are filtered out.
 * @param {Node} block
 */
function getBody(block) {
  let body = [];
  switch (block.parent.type) {
    case 'Program': {
      body = block.parent.body;
      break;
    }
    case 'ElementNode': {
      body = block.parent.children;
      break;
    }
    case 'AttrNode': {
      body = [block.parent.value];
      break;
    }
  }
  body = body.filter(
    node =>
      node.type !== 'TextNode' ||
      (node.type === 'TextNode' && node.chars.trim() !== '')
  );
  return body;
}

module.exports = getBody;
