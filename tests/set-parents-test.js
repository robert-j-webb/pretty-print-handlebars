const setParents = require('../src/set-parent');
const chai = require('chai');
const mocha = require('mocha');
const testCases = require('./test-cases');
const glimmer = require('@glimmer/syntax');

const { describe, it } = mocha;
const { expect } = chai;
chai.use(require('chai-string'));
chai.use(require('chai-diff'));

describe('Set Parents', function() {
  it('all children should have parents, besides the root and path expressions', function() {
    testCases().forEach(({ test }) => {
      const noThrow = () =>
        glimmer.preprocess(test, {
          plugins: {
            ast: [setParents, throwIfNoParent]
          }
        });
      expect(noThrow).to.not.throw();
    });
  });

  it('Element Modifier Case', function() {
    const noThrow = () =>
      glimmer.preprocess(`<div {{mustache (param (hello)) hash=Key}}></div>`, {
        plugins: {
          ast: [setParents, throwIfNoParent]
        }
      });
    expect(noThrow).to.not.throw();
  });
});

function throwIfNoParent() {
  return {
    visitor: {
      All(node) {
        if (
          !node.parent &&
          !(node.type === 'Program' || node.type === 'PathExpression')
        ) {
          throw new Error('\n\tNode of type: ' + node.type + ' has no parent');
        }
      }
    }
  };
}
