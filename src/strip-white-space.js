function stripWhiteSpace() {
  return {
    visitor: {
      TextNode(node) {
        node.chars = node.chars.trim();
      }
    }
  };
}

module.exports = stripWhiteSpace;
