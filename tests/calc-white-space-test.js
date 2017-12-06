const calcWhiteSpace = require('../src/calc-white-space');
const chai = require('chai');
const mocha = require('mocha');

const { describe, it } = mocha;
const { expect } = chai;

describe('Calculate white space && Get Depth', function() {
  const simpleInput = {
    parent: {
      type: 'ElementNode'
    }
  };
  const complexInput = {
    parent: {
      type: 'ElementNode',
      parent: {
        type: 'MustacheStatement',
        parent: {
          type: 'BlockStatement',
          parent: {
            type: 'SubExpression'
          }
        }
      }
    }
  };
  it('should return the correct whitespace for a simple case', function() {
    expect(calcWhiteSpace(simpleInput)).to.be.equal('\n  ');
  });

  it('should be able to handle offsets', function() {
    expect(calcWhiteSpace(simpleInput, 1)).to.be.equal('\n    ');
    expect(calcWhiteSpace(simpleInput, -1)).to.be.equal('\n');
  });

  it('should be able to handle complex inputs', function() {
    expect(calcWhiteSpace(complexInput)).to.be.equal('\n' + '  '.repeat(4));
  });
});
