const shouldBreak = require('../src/should-break');
const setParents = require('../src/set-parent');
const chai = require('chai');
const mocha = require('mocha');
const glimmer = require('@glimmer/syntax');

const { describe, it } = mocha;
const { expect } = chai;
chai.use(require('chai-string'));
chai.use(require('chai-diff'));

function getAst(hbs) {
  return glimmer.preprocess(hbs, {
    plugins: {
      ast: [setParents]
    }
  });
}

function getSpanNode(ast) {
  switch (ast.type) {
    case 'Program': {
      return getSpanNode(ast.body.find(node => node.type === 'ElementNode'));
    }
    case 'ElementNode': {
      if (ast.modifiers.length > 0) {
        return getSpanNode(ast.modifiers[0]);
      }
      const spanNode = ast.children.find(node => node.tag === 'span');
      if (spanNode) {
        return spanNode;
      }
      return getSpanNode(ast.children.find(node => node.type !== 'TextNode'));
    }
    case 'BlockStatement':
    case 'MustacheStatement':
    case 'ElementModifierStatement':
      return ast;
  }
  throw new Error('span not found');
}

describe('Should Break: Integration Testing', function() {
  it('simple element node case', function() {
    const hbs = `
<div {{modifier}} {{! comment}} attr='value' attr='value' attr='value' attr=value'></div>`;
    const ast = getAst(hbs.trim());
    expect(ast.body[0].type).to.equal('ElementNode');
    expect(shouldBreak(ast.body[0])).to.equal(true);
  });
  it('nested element node', function() {
    const hbs = `
<div>
  <div>
    <div>
      <div>
        <div>
          <div>
            <span {{modifier}} {{! comment}} attr='value {{if true "hello world"}}'>
              hello
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>`;
    const ast = getAst(hbs.trim());
    const spanNode = getSpanNode(ast);
    expect(spanNode.tag).to.equal('span');
    expect(shouldBreak(spanNode)).to.equal(true);
  });
  it('nested block node', function() {
    const hbs = `
<div>
  <div>
    <div>
      <div>
        <div>
          <div>
            {{#span param hash=pair second=(subExpression hello) as |block param|}}
              hello
            {{/span}}
          </div>
        </div>
      </div>
    </div>
  </div>
</div>`;
    const ast = getAst(hbs.trim());
    const spanNode = getSpanNode(ast);
    expect(shouldBreak(spanNode)).to.equal(true);
  });

  it('nested mustache', function() {
    const hbs = `
  <div>
    <div>
      <div>
        <div>
          <div>
            <div>
              {{mustache param firstHash=hash hash=hash hash=hash hash=hashOneOne}}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>`;
    const ast = getAst(hbs.trim());
    const spanNode = getSpanNode(ast);
    expect(shouldBreak(spanNode)).to.equal(true);
  });

  it('nested element modifier statement', function() {
    const hbs = `
  <div>
    <div>
      <div>
        <div>
          <div>
            <div {{elementModifierStatement param param param param param param param}}>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>`;
    const ast = getAst(hbs.trim());
    const spanNode = getSpanNode(ast);
    expect(shouldBreak(spanNode)).to.equal(true);
  });

  it('non breaking nested element modifier statement', function() {
    const hbs = `
  <div>
    <div>
      <div>
        <div>
          <div>
            <div {{elementModifierStatement param param param param param}}>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>`;
    const ast = getAst(hbs.trim());
    const spanNode = getSpanNode(ast);
    expect(shouldBreak(spanNode)).to.equal(false);
  });

  it('lonely mustache', function() {
    const hbs = `
{{mustache param hash=hash hash=hash hash=hash hash=hash hash=hash hash=hashade}}`;
    const ast = getAst(hbs.trim());
    expect(shouldBreak(ast.body[0])).to.equal(true);
  });

  it('sub expressions', function() {
    const hbs = `
{{mustache param (hello world param param param param param param param param param)}}`;
    const ast = getAst(hbs.trim());
    expect(shouldBreak(ast.body[0])).to.equal(true);
  });

  it('sub expressions, nested', function() {
    const hbs = `
{{mustache param 
  (hello (world param param param param param param param param param param param param))
}}`;
    const ast = getAst(hbs.trim());
    expect(shouldBreak(ast.body[0].params[1].params[0])).to.equal(true);
  });
});
