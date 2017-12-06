const len = require('../src/len');
const chai = require('chai');
const mocha = require('mocha');
const glimmer = require('@glimmer/syntax');

const { describe, it } = mocha;
const { expect } = chai;
chai.use(require('chai-string'));
chai.use(require('chai-diff'));

function getAst(hbs) {
  return glimmer.preprocess(hbs);
}

describe('Len: Integration Testing', function() {
  it('should return the length of text nodes.', function() {
    const input = `hello world
foo bar`;
    const ast = getAst(input);
    expect(len(ast)).to.equal(input.length);
  });

  describe('Mustache Statements', function() {
    it('simple', function() {
      const input = `{{mustache}}`;
      const ast = getAst(input);
      expect(len(ast)).to.equal(input.length);
    });
    it('with params', function() {
      const input = `{{mustache param param}}`;
      const ast = getAst(input);
      expect(len(ast)).to.equal(input.length);
    });

    it('with hashPairs', function() {
      const input = `{{mustache hash=pair hash=pair}}`;
      const ast = getAst(input);
      expect(len(ast)).to.equal(input.length);
    });

    it('with params and hashPairs', function() {
      const input = `{{mustache param param hash=pair hash=pair}}`;
      const ast = getAst(input);
      expect(len(ast)).to.equal(input.length);
    });
  });

  describe('Block Statements', function() {
    it('simple', function() {
      const input = `{{#block/path}}`;
      const ast = getAst(input + 'hello{{/block/path}}');
      expect(len(ast)).to.equal(input.length);
    });

    it('with params', function() {
      const input = `{{#block/path param param}}`;
      const ast = getAst(input + '{{/block/path}}');
      expect(len(ast)).to.equal(input.length);
    });

    it('with hashPairs', function() {
      const input = `{{#block/path a=a b=b}}`;
      const ast = getAst(input + '{{/block/path}}');
      expect(len(ast)).to.equal(input.length);
    });

    it('with a block param', function() {
      const input = `{{#block/path as |param param|}}`;
      const ast = getAst(input + '{{/block/path}}');
      expect(len(ast)).to.equal(input.length);
    });
  });

  describe('Element Nodes', function() {
    it('simple', function() {
      const input = `<span>`;
      const ast = getAst(input + 'hello</span>');
      expect(len(ast)).to.equal(input.length);
    });

    it('with modifiers', function() {
      const input = `<span {{action foo=bar hash=pair}} {{action 'goodbye'}}>`;
      const ast = getAst(input + '</span>');
      expect(len(ast)).to.equal(input.length);
    });

    it('with attributes (including concat statement)', function() {
      const input = `<span href="hello" src="{{hello param}} hello">`;
      const ast = getAst(input + '</span>');
      expect(len(ast)).to.equal(input.length);
    });

    it('with comments', function() {
      const input = `<span {{!--comment--}} {{!--comment--}}>`;
      const ast = getAst(input + '</span>');
      expect(len(ast)).to.equal(input.length);
    });

    it('with a mix', function() {
      const input =
        '<span {{!--comment--}} {{!--comment--}} href="hello" ' +
        'src="{{hello param}} hello" {{action "hello"}} {{action "goodbye"}}>';
      const ast = getAst(input + '</span>');
      expect(len(ast)).to.equal(input.length);
    });
  });

  describe('Sub Expressions', function() {
    it('simple', function() {
      const input = `{{#block/path a=(hello world foo=bar)}}`;
      const ast = getAst(input + 'hello{{/block/path}}');
      expect(len(ast)).to.equal(input.length);
    });

    it('nested', function() {
      const input = `{{block/path a=(hello (world (foo bar=baz)))}}`;
      const ast = getAst(input);
      expect(len(ast)).to.equal(input.length);
    });
  });
});
