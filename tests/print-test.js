const chai = require('chai');
const mocha = require('mocha');
const testCases = require('./test-cases');

const prettyPrint = require('../src/index');

const { describe, it } = mocha;
const { expect } = chai;
chai.use(require('chai-string'));
chai.use(require('chai-diff'));

describe('Glimmer-vm testing', function() {
  chai.config.includeStack = true;

  describe('Acceptance Tests', function() {
    const cases = testCases();
    it('case 0', function() {
      const { test, result } = cases[0];
      expect(prettyPrint(test).trim()).not.differentFrom(result.trim(), {
        showSpace: true
      });
    });

    it('case 1', function() {
      const { test, result } = cases[1];
      expect(prettyPrint(test).trim()).not.differentFrom(result.trim(), {
        showSpace: true
      });
    });

    it('case 2', function() {
      const { test, result } = cases[2];
      expect(prettyPrint(test).trim()).not.differentFrom(result.trim(), {
        showSpace: true
      });
    });

    it('case 3', function() {
      const { test, result } = cases[3];
      expect(prettyPrint(test).trim()).not.differentFrom(result.trim(), {
        showSpace: true
      });
    });

    it('case 4', function() {
      const { test, result } = cases[4];
      expect(prettyPrint(test).trim()).not.differentFrom(result.trim(), {
        showSpace: true
      });
    });

    it('HashPair with a large subExpression', function() {
      const { test, result } = cases[5];
      expect(prettyPrint(test).trim()).not.differentFrom(result.trim(), {
        showSpace: true
      });
    });

    it('case 6: Multiple hash params, no sub expression in MustacheStatement', function() {
      const { test, result } = cases[6];
      expect(prettyPrint(test).trim()).not.differentFrom(result.trim(), {
        showSpace: true
      });
    });

    it.skip('Mustache with many hashes inside sub-expression', function() {
      const { test, result } = cases[7];
      expect(prettyPrint(test).trim()).not.differentFrom(result.trim(), {
        showSpace: true
      });
    });

    it('case 8', function() {
      const { test, result } = cases[8];
      expect(prettyPrint(test).trim()).not.differentFrom(result.trim(), {
        showSpace: true
      });
    });

    it('case 9', function() {
      const { test, result } = cases[9];
      expect(prettyPrint(test).trim()).not.differentFrom(result.trim(), {
        showSpace: true
      });
    });

    it('case 10', function() {
      const { test, result } = cases[10];
      expect(prettyPrint(test).trim()).not.differentFrom(result.trim(), {
        showSpace: true
      });
    });

    it.skip('case 11 Large with statement', function() {
      const { test, result } = cases[11];
      expect(prettyPrint(test).trim()).not.differentFrom(result.trim(), {
        showSpace: true
      });
    });

    it.skip('case 12: Mustache with many helpers and hashes', function() {
      const { test, result } = cases[12];
      expect(prettyPrint(test).trim()).not.differentFrom(result.trim(), {
        showSpace: true
      });
    });

    it.skip('Mustache with hash and params', function() {
      const { test, result } = cases[13];
      expect(prettyPrint(test).trim()).not.differentFrom(result.trim(), {
        showSpace: true
      });
    });

    it.skip('Mustache statements next to each other', function() {
      const { test, result } = cases[14];
      expect(prettyPrint(test).trim()).not.differentFrom(result.trim(), {
        showSpace: true
      });
    });

    it.skip('Some weird sub expression nesting', function() {
      const { test, result } = cases[15];
      expect(prettyPrint(test).trim()).not.differentFrom(result.trim(), {
        showSpace: true
      });
    });

    it('Proper indentation with sub expressions', function() {
      const { test, result } = cases[16];
      expect(prettyPrint(test).trim()).not.differentFrom(result.trim(), {
        showSpace: true
      });
    });

    it('Proper line breaking within a concat statement', function() {
      const { test, result } = cases[17];
      expect(prettyPrint(test).trim()).not.differentFrom(result.trim(), {
        showSpace: true
      });
    });

    it('Element nodes that are empty have proper spacing', function() {
      const { test, result } = cases[18];
      expect(prettyPrint(test).trim()).not.differentFrom(result.trim(), {
        showSpace: true
      });
    });
    it('Should handle else if statements', function() {
      const { test, result } = cases[19];
      expect(prettyPrint(test).trim()).not.differentFrom(result.trim(), {
        showSpace: true
      });
    });

    it('Should handle comment spacing', function() {
      const { test, result } = cases[20];
      expect(prettyPrint(test).trim()).not.differentFrom(result.trim(), {
        showSpace: true
      });
    });
  });
});
