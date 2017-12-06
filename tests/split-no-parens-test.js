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
});
