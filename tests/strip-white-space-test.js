const stripWhiteSpace = require('../src/strip-white-space');
const chai = require('chai');
const mocha = require('mocha');
const testCases = require('./test-cases');
const glimmer = require('@glimmer/syntax');

const { describe, it } = mocha;
const { expect } = chai;
chai.use(require('chai-string'));
chai.use(require('chai-diff'));

describe('Strip whitespace', function() {
  it('all text nodes should have characters without leading or trailing whitespace', function() {
    testCases().forEach(({ test }) => {
      glimmer.preprocess(test, {
        plugins: {
          ast: [stripWhiteSpace, throwIfWhiteSpace]
        }
      });
      expect(true);
    });
  });
});

function throwIfWhiteSpace() {
  return {
    visitor: {
      TextNode(node) {
        if (node.chars.trim() !== node.chars) {
          throw new Error('TextNode chars were not trimmed');
        }
      }
    }
  };
}
