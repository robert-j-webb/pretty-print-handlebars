const chai = require('chai');
const mocha = require('mocha');

const prettyPrint = require('../../src/index');

const { describe, it } = mocha;
const { expect } = chai;
chai.use(require('chai-string'));
chai.use(require('chai-diff'));

describe('Print: Block Statement', function() {
  it('Non Breaking', function() {
    const pretty = `
{{#block param hashKey=hashValue as |blockParam|}}
  Hello
{{/block}}
`;
    expect(prettyPrint(pretty).trim()).not.differentFrom(pretty.trim(), {
      showSpace: true
    });
  });

  it('Chained: Else If', function() {
    const pretty = `
{{#if}}
  Hello
{{else if false}}
  Good Afternoon
{{else}}
  Goodbye
{{/if}}
`;
    expect(prettyPrint(pretty).trim()).not.differentFrom(pretty.trim(), {
      showSpace: true
    });
  });

  it('With Breaking; mix of params and hash values', function() {
    const pretty = `
{{#block param
  param
  param
  param
  param
  param
  param 
  hashKey=HashValue
  hashKey=hashValue
}}
  Hello
{{/block}}
`;
    expect(prettyPrint(pretty).trim()).not.differentFrom(pretty.trim(), {
      showSpace: true
    });
  });

  it('With Breaking; just params', function() {
    const pretty = `
{{#block param
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
  Hello
{{/block}}
`;
    expect(prettyPrint(pretty).trim()).not.differentFrom(pretty.trim(), {
      showSpace: true
    });
  });

  it('With Breaking; just hashPairs', function() {
    const pretty = `
{{#block param 
  hashKey=HashValue
  hashKey=hashValue
  hashKey=HashValue
  hashKey=hashValue
  hashKey=HashValue
  hashKey=hashValue
}}
  Hello
{{/block}}
`;
    expect(prettyPrint(pretty).trim()).not.differentFrom(pretty.trim(), {
      showSpace: true
    });
  });
});
