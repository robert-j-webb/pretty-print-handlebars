const chai = require('chai');
const mocha = require('mocha');

const prettyPrint = require('../../src/index');

const { describe, it } = mocha;
const { expect } = chai;
chai.use(require('chai-string'));
chai.use(require('chai-diff'));

describe('Print: Element Modifier Statement', function() {
  it('Non-breaking', function() {
    const pretty = `
<div {{hello param hash=key}} {{goodbye param}}>
  Hello
</div>
`;
    expect(prettyPrint(pretty).trim()).not.differentFrom(pretty.trim(), {
      showSpace: true
    });
  });

  it('Breaking; just params', function() {
    const pretty = `
<div 
  {{hello
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
>
  Hello
</div>
`;
    expect(prettyPrint(pretty).trim()).not.differentFrom(pretty.trim(), {
      showSpace: true
    });
  });

  it('Breaking; just params', function() {
    const pretty = `
<div 
  {{hello
    hashPair=value
    hashPair=value
    hashPair=value
    hashPair=value
    hashPair=value
  }}
>
  Hello
</div>
`;
    expect(prettyPrint(pretty).trim()).not.differentFrom(pretty.trim(), {
      showSpace: true
    });
  });

  it('Breaking; mix of hashPairs and params', function() {
    const pretty = `
<div 
  {{hello
    param
    param
    param
    param
    hashPair=value
    hashPair=value
    hashPair=value
    hashPair=value
    hashPair=value
  }}
>
  Hello
</div>
`;
    expect(prettyPrint(pretty).trim()).not.differentFrom(pretty.trim(), {
      showSpace: true
    });
  });
});
