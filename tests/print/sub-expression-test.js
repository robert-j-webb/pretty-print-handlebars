const chai = require('chai');
const mocha = require('mocha');

const prettyPrint = require('../../src/index');

const { describe, it } = mocha;
const { expect } = chai;
chai.use(require('chai-string'));
chai.use(require('chai-diff'));

describe('Print: Sub Expressions', function() {
  it('Non Breaking', function() {
    const pretty = `
{{mustache (concat hello " " false)}}
    `;
    expect(prettyPrint(pretty).trim()).not.differentFrom(pretty.trim(), {
      showSpace: true
    });
  });

  it('Non Breaking, nested', function() {
    const pretty = `
  {{mustache (concat (hello "world") (hello " " "goodbye"))}}
      `;
    expect(prettyPrint(pretty).trim()).not.differentFrom(pretty.trim(), {
      showSpace: true
    });
  });

  it('Breaking, simple', function() {
    const pretty = `
{{mustache 
  (concat
    "this string"
    of
    "params"
    will
    be
    "long enough"
    to
    cause="a"
    line="break"
  )
}}
      `;
    expect(prettyPrint(pretty).trim()).not.differentFrom(pretty.trim(), {
      showSpace: true
    });
  });

  it('In Mustache Statement, Breaking, nested', function() {
    const pretty = `
{{mustache 
  (concat
    (helper param hashPair=Value)
    (largeNameHelper
      param
      param
      param
      hashPair=value
      hashPair=value
      hashPair=Value
    )
    hashPair=
      (helper
        param
        param
        param
        param
        hashPair=value
        hashPair=value
        hashPair=value
      )
    hashPair=(does not need a line break due to being under 80 chars long)
  )
}}
    `;
    expect(prettyPrint(pretty).trim()).not.differentFrom(pretty.trim(), {
      showSpace: true
    });
  });

  it('In Block Statement, Breaking, nested', function() {
    const pretty = `
{{#block 
  (concat
    (helper param hashPair=Value)
    (largeNameHelper
      param
      param
      param
      hashPair=value
      hashPair=value
      hashPair=Value
    )
    hashPair=
      (helper
        param
        param
        param
        param
        hashPair=value
        hashPair=value
        hashPair=value
      )
    hashPair=(does not need a line break due to being under 80 chars long)
  )
}}
  
{{/block}}
    `;
    expect(prettyPrint(pretty).trim()).not.differentFrom(pretty.trim(), {
      showSpace: true
    });
  });

  it('In Element Node, Breaking, nested', function() {
    const pretty = `
<div 
  {{mustache
    (concat
      (helper param hashPair=Value)
      (largeNameHelper
        param
        param
        param
        hashPair=value
        hashPair=value
        hashPair=Value
      )
      hashPair=
        (helper
          param
          param
          param
          param
          hashPair=value
          hashPair=value
          hashPair=value
        )
      hashPair=(does not need a line break due to being under 80 chars long)
    )
  }}
></div>
    `;
    expect(prettyPrint(pretty).trim()).not.differentFrom(pretty.trim(), {
      showSpace: true
    });
  });
});
