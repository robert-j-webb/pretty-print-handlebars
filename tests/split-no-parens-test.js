const splitNoParens = require('../src/split-no-parens');
const chai = require('chai');
const mocha = require('mocha');

const { describe, it } = mocha;
const { expect } = chai;

describe('Split by space, ignoring parenthesis', function() {
  it('should return an array from a string separated by spaces', function() {
    const input = 'a b c (d e f) g';
    const result = ['a', 'b', 'c', '(d e f)', 'g'];
    expect(splitNoParens(input)).to.deep.equal(result);
  });

  it('should preserve whitespace if in between = and parens', function() {
    const input = 'a=\n    (b)';
    const result = ['a=\n    (b)'];
    expect(splitNoParens(input)).to.deep.equal(result);
  });

  it('preserves whitespace between hash pairs and subexps', function() {
    const input = `a 
     c=
  (d (e f))`;
    const result = ['a', 'c=\n  (d (e f))'];
    expect(splitNoParens(input)).to.deep.equal(result);
  });
});
