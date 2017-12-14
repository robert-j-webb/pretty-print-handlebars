const chai = require('chai');
const mocha = require('mocha');

const prettyPrint = require('../../src/index');

const { describe, it } = mocha;
const { expect } = chai;
chai.use(require('chai-string'));
chai.use(require('chai-diff'));

describe('Print: Element Node', function() {
  it('Non Breaking', function() {
    const pretty = `
<div class="attribute" {{modifier}} {{! comment}}>
  Hello
</div>
`;
    expect(prettyPrint(pretty).trim()).not.differentFrom(pretty.trim(), {
      showSpace: true
    });
  });

  it('Non Breaking, non last', function() {
    const pretty = `
<div>
  Hello
</div>
<div>
  hi
</div>
`;
    const res = `
<div>
  Hello
</div>

<div>
  hi
</div>
`;
    expect(prettyPrint(pretty).trim()).not.differentFrom(res.trim(), {
      showSpace: true
    });
  });

  it('With Breaking', function() {
    const pretty = `
<div class="attribute"
  class="attribute"
  {{modifier}}
  {{modifier}}
  {{! comment}}
  {{! comment}}>
  Hello
</div>
`;
    expect(prettyPrint(pretty).trim()).not.differentFrom(pretty.trim(), {
      showSpace: true
    });
  });

  it.skip('Out of order', function() {
    const pretty = `
<div class="attribute"
  {{modifier}}
  {{! comment}}
  class="attribute"
  {{modifier}}
  {{! comment}}>
  Hello
</div>
`;
    expect(prettyPrint(pretty).trim()).not.differentFrom(pretty.trim(), {
      showSpace: true
    });
  });
});
