const chai = require('chai');
const mocha = require('mocha');

const prettyPrint = require('../../src/index');

const { describe, it } = mocha;
const { expect } = chai;
chai.use(require('chai-string'));
chai.use(require('chai-diff'));

describe('Print: Mustache Comment Statement', function() {
  it('Non-breaking', function() {
    const pretty = `
<div {{! hello}}>
  Hello
</div>
`;
    expect(prettyPrint(pretty).trim()).not.differentFrom(pretty.trim(), {
      showSpace: true
    });
  });

  it('breaking', function() {
    const pretty = `
<div {{!--
hello
--}}>
  Hello
</div>
`;
    expect(prettyPrint(pretty).trim()).not.differentFrom(pretty.trim(), {
      showSpace: true
    });
  });
});
