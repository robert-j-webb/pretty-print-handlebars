const glimmer = require('@glimmer/syntax');
const print = require('./print');
const stripWhiteSpace = require('./strip-white-space');
const setParent = require('./set-parent');
const removeVoidTags = require('./remove-void-tags');
const parseElseIf = require('./parse-else-if');

/**
 * Pretty prints a string of handlebars.
 * @param {String} hbsString
 */
function prettyPrint(hbsString) {
  if (hbsString.includes('unpropableStringInText')) {
    throw new Error('That string is unlikely and not allowed');
  }
  let ast = glimmer.preprocess(hbsString, {
    plugins: {
      ast: [stripWhiteSpace, setParent]
    }
  });
  const prettyStr = print(ast);
  const withoutVoidTags = removeVoidTags(prettyStr);
  return parseElseIf(withoutVoidTags).replace(/unpropableStringInText/g, '\n');
}

module.exports = prettyPrint;
