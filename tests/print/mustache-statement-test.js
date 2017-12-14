const chai = require('chai');
const mocha = require('mocha');

const prettyPrint = require('../../src/index');

const { describe, it } = mocha;
const { expect } = chai;
chai.use(require('chai-string'));
chai.use(require('chai-diff'));

describe('Print: Mustache Statement', function() {
  it('Non Breaking', function() {
    const pretty = `
{{block param hashKey=hashValue}}
`;
    expect(prettyPrint(pretty).trim()).not.differentFrom(pretty.trim(), {
      showSpace: true
    });
  });

  it('Non Last', function() {
    const pretty = `
{{block param hashKey=hashValue}}
{{block param hashKey=hashValue}}
    `;
    expect(prettyPrint(pretty).trim()).not.differentFrom(pretty.trim(), {
      showSpace: true
    });
  });

  it('With Breaking; mix of params and hashPairs', function() {
    const pretty = `
{{block param
  param
  param
  param
  param
  param
  param 
  hashKey=HashValue
  hashKey=hashValue
}}
`;
    expect(prettyPrint(pretty).trim()).not.differentFrom(pretty.trim(), {
      showSpace: true
    });
  });

  it('With Breaking; just params', function() {
    const pretty = `
{{block param
  param
  param
  param
  param
  param
  param
  param
  param
  param
  param
  param
  param
}}
`;
    expect(prettyPrint(pretty).trim()).not.differentFrom(pretty.trim(), {
      showSpace: true
    });
  });

  it('With Breaking; just hashPairs', function() {
    const pretty = `
{{block 
  hashKey=HashValue
  hashKey=hashValue
  hashKey=HashValue
  hashKey=hashValue
  hashKey=HashValue
  hashKey=hashValue
}}
`;
    expect(prettyPrint(pretty).trim()).not.differentFrom(pretty.trim(), {
      showSpace: true
    });
  });
});
