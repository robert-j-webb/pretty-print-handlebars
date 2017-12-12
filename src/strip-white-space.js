function stripWhiteSpace() {
  return {
    visitor: {
      TextNode(node) {
        node.chars = node.chars.replace('\n\n', 'unpropableStringInText').trim();
      }
    }
  };
}

module.exports = stripWhiteSpace;
