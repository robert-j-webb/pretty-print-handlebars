const removeVoidTags = require('../src/remove-void-tags');
const chai = require('chai');
const mocha = require('mocha');

const { describe, it } = mocha;
const { expect } = chai;
chai.use(require('chai-string'));
chai.use(require('chai-diff'));

describe('Remove void tags', function() {
  it('should remove a void tag and its previous new line from the parsed string', function() {
    const input = `<input>

</input>`;
    const result = '<input>';
    expect(removeVoidTags(input)).not.differentFrom(result);
  });
});
