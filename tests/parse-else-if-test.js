const parseElseIf = require('../src/parse-else-if');
const chai = require('chai');
const mocha = require('mocha');

const { describe, it } = mocha;
const { expect } = chai;
chai.use(require('chai-string'));
chai.use(require('chai-diff'));

describe('Parse Else if', function() {
  it('should replace an else if in a simple case', function() {
    const result = `
{{#if a}}
b
{{else if c}}
d
{{else}}
e
{{/if}}`;
    const input = `
{{#if a}}
b
{{else}}
{{#if c}}
  d
{{else}}
  e
{{/if}}
{{/if}}`;
    expect(parseElseIf(input).trim()).not.differentFrom(result.trim(), {
      showSpace: true
    });
  });

  it('should replace even if there is an if inside the else if block', function() {
    const input = `
{{#if a}}
  b
{{else}}
  {{#if c}}
    d
  {{else}}
    hello
    {{#if f}}
      g
    {{/if}}
    e
  {{/if}}
{{/if}}`;
    const result = `
{{#if a}}
  b
{{else if c}}
  d
{{else}}
  hello
  {{#if f}}
    g
  {{/if}}
  e
{{/if}}`;

    expect(parseElseIf(input).trim()).not.differentFrom(result.trim(), {
      showSpace: true
    });
  });

  it('parse else if should not remove excess whitespace from nested', function() {
    const input = `
<div>
  {{#if a}}
    b
  {{else}}
    {{#if c}}
      d
    {{else}}
      e
    {{/if}}
  {{/if}}
</div>`;
    const result = `
<div>
  {{#if a}}
    b
  {{else if c}}
    d
  {{else}}
    e
  {{/if}}
</div>`;

    expect(parseElseIf(input).trim()).not.differentFrom(result.trim(), {
      showSpace: true
    });
  });

  it('parse else if should work with double nested', function() {
    const input = `
<div>
  <div>
    {{#if a}}
      b
    {{else}}
      {{#if c}}
        d
      {{else}}
        e
      {{/if}}
    {{/if}}
  </div>
</div>`;
    const result = `
<div>
  <div>
    {{#if a}}
      b
    {{else if c}}
      d
    {{else}}
      e
    {{/if}}
  </div>
</div>`;

    expect(parseElseIf(input).trim()).not.differentFrom(result.trim(), {
      showSpace: true
    });
  });

  it('should replace an else if in a nested case', function() {
    const result = `
{{#if a}}
b
{{else if c}}
d
{{else if e}}
f
{{else if g}}
h
{{else}}
j
{{/if}}`;
    const input = `
{{#if a}}
b
{{else}}
{{#if c}}
  d
{{else}}
  {{#if e}}
    f
  {{else}}
    {{#if g}}
      h
    {{else}}
      j
    {{/if}}
  {{/if}}
{{/if}}
{{/if}}`;
    expect(parseElseIf(input).trim()).not.differentFrom(result.trim(), {
      showSpace: true
    });
  });
});
