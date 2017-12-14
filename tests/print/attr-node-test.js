const chai = require('chai');
const mocha = require('mocha');

const prettyPrint = require('../../src/index');

const { describe, it } = mocha;
const { expect } = chai;
chai.use(require('chai-string'));
chai.use(require('chai-diff'));

describe('Print: Attribute Node', function() {
  it('Text Node', function() {
    const pretty = `
<div class="hello">
  Hello
</div>
`;
    expect(prettyPrint(pretty).trim()).not.differentFrom(pretty.trim(), {
      showSpace: true
    });
  });

  it('Other', function() {
    const pretty = `
<div class="hello{{if goodbye true}}">
  Hello
</div>
`;
    expect(prettyPrint(pretty).trim()).not.differentFrom(pretty.trim(), {
      showSpace: true
    });
  });
});
