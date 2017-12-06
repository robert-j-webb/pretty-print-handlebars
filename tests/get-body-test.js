const getBody = require('../src/get-body');
const chai = require('chai');
const mocha = require('mocha');

const { describe, it } = mocha;
const { expect } = chai;

describe('Get Body', function() {
  const body = [
    {
      type: 'TextNode',
      chars: '\n\n  '
    },
    {
      type: 'TextNode',
      chars: 'hello'
    }
  ];
  it('should strip out nodes that are just whitespace from a Program', function() {
    const block = {
      parent: {
        type: 'Program',
        body: body
      }
    };
    expect(getBody(block)).to.deep.equal(body.slice(1));
  });

  it('should get the body for an Element node', function() {
    const block = {
      parent: {
        type: 'ElementNode',
        children: body
      }
    };
    expect(getBody(block)).to.deep.equal(body.slice(1));
  });

  it('should get the body for an AttrNode', function() {
    const block = {
      parent: {
        type: 'AttrNode',
        value: body[1]
      }
    };
    expect(getBody(block)).to.deep.equal(body.slice(1));
  });
});
