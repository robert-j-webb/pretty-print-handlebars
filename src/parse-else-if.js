const { TAB_SIZE } = require('../config');

/**
 * If the glimmer-vm is given a hbs file that has something like this:
 * {{#if a}}
 *   b
 * {{else if c}}
 *   c
 * {{else}}
 *   d
 * {{/if}}
 * It will print out:
 * {{#if a}}
 *   b
 * {{else}}
 *   {{#if c}}
 *     c
 *   {{else}}
 *     d
 *   {{/if}}
 * {{/if}}
 * This function is applied after pretty printing has happened and will replace
 * the bad else if statements with the properly formatted ones.
 * @param {String} hbs
 */
function parseElseIf(hbs) {
  let { elseIfIdx, leadingElseWhiteSpace } = getIndices(hbs);
  while (elseIfIdx !== -1) {
    const remainder = hbs.slice(elseIfIdx);
    const endIfIdx = getEndIfIdx(remainder, leadingElseWhiteSpace, elseIfIdx);
    const block = hbs
      .slice(elseIfIdx, endIfIdx)
      .split('\n' + ' '.repeat(TAB_SIZE)) //Remove one tab of depth
      .join('\n')
      .replace(RegExp(leadingElseWhiteSpace + '{{/if}}'), ''); //Remove closing if statement

    hbs = hbs.slice(0, elseIfIdx) + block + hbs.slice(endIfIdx);
    hbs = hbs.replace(/{{else}}\s*{{#if\s/, '{{else if ');
    ({ elseIfIdx, leadingElseWhiteSpace } = getIndices(hbs));
  }
  return hbs;
}

/**
 * Due to the way this is being parsed, whenever an else if statement is not,
 * nested it tends to break. This if statement takes care of that. 
 * @param {String} block 
 * @param {String} leadingElseWhiteSpace 
 * @param {Number} offset 
 */
function getEndIfIdx(block, leadingElseWhiteSpace, offset) {
  const endIfIdx = block.indexOf(leadingElseWhiteSpace + '{{/if}}');
  if (leadingElseWhiteSpace === '\n') {
    return endIfIdx + offset + (leadingElseWhiteSpace + '{{/if}}').length;
  } else {
    return endIfIdx + offset;
  }
}

function getIndices(hbs) {
  let elseIfIdx = hbs.search(/{{else}}\s*{{#if /);
  let leadingElseWhiteSpace = '';
  if (elseIfIdx !== -1) {
    leadingElseWhiteSpace = hbs.match(/(\s*){{else}}\s*{{#if /)[1];
  }
  return { elseIfIdx, leadingElseWhiteSpace };
}

module.exports = parseElseIf;
