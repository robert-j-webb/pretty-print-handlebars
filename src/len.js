/**
 * Returns the number of characters the given section of the sub tree would use
 * if it were to be rendered, before a line break that needs to happen.
 * For calculating if the printer needs to break.
 * @param {Node} node
 */
function len(node) {
  if (!node) {
    return 0;
  }
  if (node instanceof Array) {
    return node.reduce((sum, n) => len(n) + sum, 0);
  }
  switch (node.type) {
    case 'Program':
      return len(node.body);

    case 'ElementNode':
      return (
        len(node.attributes) +
        len(node.comments) +
        len(node.modifiers) +
        node.attributes.length +
        node.comments.length +
        node.modifiers.length +
        node.tag.length +
        '<>'.length
      );

    case 'AttrNode':
      return (
        node.name.length +
        len(node.value) +
        (node.value.type === 'TextNode' ? '""'.length : 0) +
        '='.length
      );

    case 'ConcatStatement':
      return len(node.parts) + 2;

    case 'TextNode':
      return node.chars.length;

    case 'MustacheStatement':
      return (
        node.params.length +
        len(node.params) +
        len(node.hash) +
        len(node.path) +
        '{{}}'.length
      );

    case 'MustacheCommentStatement':
      return node.value.length + '{{!----}}'.length;

    case 'ElementModifierStatement': {
      return (
        len(node.params) +
        len(node.hash) +
        len(node.path) +
        node.params.length +
        '{{}}'.length
      );
    }

    case 'PathExpression':
      return node.original.length;

    case 'SubExpression':
      return (
        len(node.path) +
        len(node.params) +
        node.params.length +
        len(node.hash) +
        '()'.length
      );

    case 'BooleanLiteral':
      return node.value.toString().length;

    case 'BlockStatement': {
      let totalLen = 0;
      // Add in the length of params like {{#block as |hello world|}}[Program]{{/block}}
      if (node.program.blockParams.length !== 0) {
        totalLen += node.program.blockParams.join(' ').length + ' as ||'.length;
      }
      return (
        totalLen +
        len(node.path) +
        len(node.params) +
        node.params.length +
        len(node.hash) +
        5
      );
    }

    case 'PartialStatement': {
      throw new Error('Partials are not supported:' + node.loc.start.line);
    }

    case 'CommentStatement': {
      return node.value.length + '<!---->'.length;
    }

    case 'StringLiteral': {
      return node.value.length + 2;
    }

    case 'NumberLiteral': {
      return `${node.value}`.length;
    }

    case 'UndefinedLiteral': {
      return 'undefined'.length;
    }

    case 'NullLiteral': {
      return 'null'.length;
    }

    case 'Hash': {
      return len(node.pairs) + node.pairs.length;
    }

    case 'HashPair': {
      return `${node.key}=`.length + len(node.value);
    }

    default:
      throw new Error(node.type + ' not found at ' + node.loc.start.line);
  }
}

module.exports = len;
