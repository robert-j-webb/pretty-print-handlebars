/**
 * The glimmer-vm has a quirk where it will print out closing tags for all
 * elements, regardless of its behavior. This function removes closing tags
 * for elements that are empty.
 * @param {String} hbs
 */
function removeVoidTags(hbs) {
  // From https://developer.mozilla.org/en-US/docs/Glossary/Empty_element
  const voidTags = [
    'area',
    'base',
    'br',
    'col',
    'embed',
    'hr',
    'img',
    'input',
    'keygen',
    'link',
    'meta',
    'param',
    'source',
    'track',
    'wbr'
  ];

  voidTags.forEach(
    tag => (hbs = hbs.replace(RegExp(`>\\s*</${tag}>`, 'g'), '>'))
  );
  return hbs;
}

module.exports = removeVoidTags;
