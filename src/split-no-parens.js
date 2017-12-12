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
  if (!matches) {
    return '';
  }
  matches.forEach(elem => {
    if (/(\w+=\s+)/.test(elem)) {
      return (res = res.concat(equalsCase(elem)));
    }
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
      // Check to see if the first element before the space has the equal sign
      if (elem[elem.length - 1] === '=') {
        res.push(elem);
      } else {
        const withoutSpaces = elem.match(/([^\s]+)/g) || [];
        res = res.concat(withoutSpaces);
      }
    }
  });
  // If there is an equals sign, we want to concatenate the elements together
  // This is to preserve hashPair spacing
  return res.reduce((res, curr) => {
    const prev = res[res.length - 1];
    const trimPrev = prev ? prev.trim() : null;
    if (trimPrev && trimPrev[trimPrev.length - 1] === '=') {
      res[res.length - 1] = prev + curr;
    } else {
      res.push(curr);
    }
    return res;
  }, []);
}

function equalsCase(elem) {
  const equals = (elem.match(/(\w+=\s*)/) || [])[0];
  const notEquals = elem.slice(0, elem.indexOf(equals));
  return [...splitNoParens(notEquals), equals].filter(a => a !== '');
}

module.exports = splitNoParens;
