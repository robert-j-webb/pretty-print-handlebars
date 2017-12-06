// From https://stackoverflow.com/a/25060605/5066792
/**
 * Turns a string like "a b (c d e) f g" into ['a','b','(c d e)', 'f', 'g']
 * Used for splitting sub expressions into their individual params and keys.
 * @param {String} strToSplit
 */
function splitNoParens(strToSplit) {
  const matches = strToSplit.match(/([^()]+)|([()])/g);
  let numLeftParens = 0,
    numRightParens = 0,
    str = '',
    res = [];
  matches.forEach(elem => {
    if (elem === '(') {
      ++numLeftParens;
    } else if (elem === ')') {
      ++numRightParens;
    }
    if (numLeftParens !== 0) {
      str += elem;
      if (numLeftParens === numRightParens) {
        res.push(str);
        numLeftParens = 0;
        numRightParens = 0;
        str = '';
      }
    } else {
      const withoutSpaces = elem.match(/([^ ]+)/g) || [];
      res = res.concat(withoutSpaces);
    }
  });
  return res;
}

module.exports = splitNoParens;
