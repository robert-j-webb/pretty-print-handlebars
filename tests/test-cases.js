module.exports = function() {
  return [
    {
      test: `
<div><span>hello</span></div>`,
      result: `
<div>
  <span>
    hello
  </span>
</div>`
    },
    {
      test: `
{{#block}}{{#block2}}hello{{/block2}}{{/block}}`,
      result: `
{{#block}}
  {{#block2}}
    hello
  {{/block2}}
{{/block}}`
    },
    {
      test: `
<div><span>hello</span><span>world</span></div>`,
      result: `
<div>
  <span>
    hello
  </span>
  
  <span>
    world
  </span>
</div>`
    },
    {
      test: `
{{#block}}{{#block2}}hello{{/block2}}{{#block3}}hello{{/block3}}{{/block}}`,
      result: `
{{#block}}
  {{#block2}}
    hello
  {{/block2}}
  {{#block3}}
    hello
  {{/block3}}
{{/block}}`
    },
    {
      test: `
      {{#if true}}hello{{else}}goodbye{{/if}}`,
      result: `
{{#if true}}
  hello
{{else}}
  goodbye
{{/if}}`
    },
    {
      test: `
{{mustache
  key=(helper "a" "long" expression "that" "will" require a "line" break because "its" long)
}}
    `,
      result: `
{{mustache key=
  (helper
    "a"
    "long"
    expression
    "that"
    "will"
    require
    a
    "line"
    break
    because
    "its"
    long
  )
}}`
    },
    {
      test: `
{{mustache param firstHash=hash hash=hash hash=hash hash=hash hash=hash hash=hash}}`,
      result: `
{{mustache param 
  firstHash=hash
  hash=hash
  hash=hash
  hash=hash
  hash=hash
  hash=hash
}}`
    },
    {
      test: `{{mustache param  bigKey=(helper bigKey=1 bigKey=2 bigKey=3 bigKey=last)}} `,
      result: `
{{mustache param
  bigKey=
    (helper hello
      bigKey=1
      bigKey=2
      bigKey=3
      bigKey=last
    )
}} `
    },
    {
      test: `
{{#block param as |block assign|}}
  hello world
{{/block}}
`,
      result: `
{{#block param as |block assign|}}
  hello world
{{/block}}
`
    },
    {
      test: `
{{#nest}}
  <div>
    {{#white space}}
      hello
    {{/white}}
  </div>
{{/nest}}`,
      result: `
{{#nest}}
  <div>
    {{#white space}}
      hello
    {{/white}}
  </div>
{{/nest}}`
    },

    {
      test: `{{#block-component foobar as |block assign|}}
  {{#if isLongConditionalExpression}}
    {{#nested-component foobar as |block assign|}}
      <div local-class="stringLiteral" data-test={{hook "stringLiteral"}}>
        {{component/nested-expression singleBlockParam
          property=(if service.hasProperty paramExpression)
        }}
    </div>
    {{/nested-component}}
  {{else if param}}
    <div local-class="stringLiteral" data-test={{hook "stringLiteral"}}>
      {{component/nested-expression param
        hashValue=(simple-helper (hash
          hashKey=hashValue.expression
          assignParam=assignParam
        ))
        hashKey=hashValue.value
        property=(if service.hasProperty
          paramExpression)}}
    </div>
  {{/if}}
{{/block-component}}`,
      result: `
{{#block-component foobar as |block assign|}}
  {{#if isLongConditionalExpression}}
    {{#nested-component foobar as |block assign|}}
      <div local-class="stringLiteral" data-test={{hook "stringLiteral"}}>
        {{component/nested-expression singleBlockParam 
          property=(if service.hasProperty paramExpression)
        }}
      </div>
    {{/nested-component}}
  {{else if param}}
    <div local-class="stringLiteral"
      data-test={{hook "stringLiteral"}}>
      {{component/nested-expression param
        hashValue=
          (simple-helper
            (hash hashKey=hashValue.expression assignParam=assignParam)
          )
        hashKey=hashValue.value
        property=(if service.hasProperty paramExpression)}}
    </div>
  {{/if}}
{{/block-component}}
`
    },
    {
      test: `{{#with (long-name-helper (map-by "stringLiteral" foobar.keyOfParam) param) as |block assign|}}{{/with}}`,
      result: `
{{#with 
  (long-name-helper (map-by "stringLiteral" foobar.keyOfParam) param)
as |block assign|}}
  
{{/with}}`
    },
    {
      test: `{{#large-block-component 
      hashKey=hashKey 
        foobar=foobar 
        hashValue=hashValue 
        hashKey=(not (or subExpressionParam subExpressionParam param param param param))
        hashKey=(action "stringLiteral")
      }}
     {{/large-block-component}}`,
      result: `
{{#large-block-component
  hashKey=hashKey
  foobar=foobar
  hashValue=hashValue
  hashKey=
    (not
      (or subExpressionParam subExpressionParam param param param param)
    )
  hashKey=(action "stringLiteral")
}}
  
{{/large-block-component}}`
    },
    {
      test: `{{foobar-sub-component/nested-expression param hasVideoSlide=hashValue hashKey=(action "stringLiteral")}}`,
      result: `
{{foobar-sub-component/nested-expression param
  hasVideoSlide=hashValue
  hashKey=(action "stringLiteral")
}}`
    },
    {
      test: `
{{#if}}
  hi
{{/if}}

{{yield (hash hashKey=(local-class "stringLiteral"))}}

{{#foobar-sub-component/nested foobar as |block assign|}}
  hi
{{/foobar-sub-component/nested}}`,
      result: `
{{#if}}
  hi
{{/if}}

{{yield (hash hashKey=local-class "stringLiteral"))}}

{{#foobar-sub-component/nested foobar as |block assign|}}
  hi
{{/foobar-sub-component/nested}}`
    },
    {
      test: `
{{foobar-sub-component/foobar-foo 
  hook="stringLiteral" 
  foo=(t (concat "stringLiteral" (get blockParam "stringLiteral")) 
    foo=(simple-helper (hash hashKey=blockParam.foo assignParam=blockParam.bar)))}}`,
      result: `
{{foobar-sub-component/foobar-foo hook="stringLiteral"
  foo=
    (t
      (concat
        "stringLiteral"
        (get blockParam "stringLiteral")
        hash=hash
        hash=hash
      )
      foo=
        (simple-helper (hash hashKey=blockParam.foo assignParam=blockParam.bar)
    )
  )
}}`
    },
    {
      test: `
<div>
  <div>
    <div>
      <div>
        <div>
          <div>
            {{#if (not (and fooBarBazString selectedFooBar param param param param))}}
                  hello
            {{/if}}
</div>
</div>
</div>
</div>
</div>
</div>
`,
      result: `
<div>
  <div>
    <div>
      <div>
        <div>
          <div>
            {{#if 
              (not
                (and fooBarBazString selectedFooBar param param param param)
              )
            }}
              hello
            {{/if}}
          </div>
        </div>
      </div>
    </div>
  </div>
</div>`
    },
    {
      test: `
<div local-class="hashKey{{if (or (enabled "stringLiteral") (enabled "stringLiteral")) "stringLiteral"}}">
    {{#if foobar.inStock}}
      hi
    {{/if}}
</div>`,
      result: `
<div local-class="
  hashKey
  {{if (or (enabled "stringLiteral") (enabled "stringLiteral")) "stringLiteral"}}
">
  {{#if foobar.inStock}}
    hi
  {{/if}}
</div>`
    },
    {
      test: `
<li local-class="stringLiteral">
  <label class="stringLiteral" data-test={{hook "stringLiteral" for="stringLiteral"}}>
    <input type="stringLiteral" class="stringLiteral" name="stringLiteral" onChange={{action "stringLiteral" null}} checked={{is-empty fooBarParam}}>
    <span class="stringLiteral">
    </span>
    <span local-class="stringLiteral">
      {{t "stringLiteral"}}
    </span>
  </label>
</li>`,
      result: `
<li local-class="stringLiteral">
  <label class="stringLiteral"
    data-test={{hook "stringLiteral" for="stringLiteral"}}>
    <input type="stringLiteral"
      class="stringLiteral"
      name="stringLiteral"
      onChange={{action "stringLiteral" null}}
      checked={{is-empty fooBarParam}}>
    
    <span class="stringLiteral"></span>
    
    <span local-class="stringLiteral">
      {{t "stringLiteral"}}
    </span>
  </label>
</li>`
    },
    {
      test: `
{{#if a}}
  b
{{else if c}}
  c
{{else}}
  d
{{/if}}
   `,
      result: `
{{#if a}}
  b
{{else if c}}
  c
{{else}}
  d
{{/if}}
         `
    },
    {
      test: `
{{mustacheStatement param}}
{{!-- A rather long comment should have a new line before and after that --}}
{{mustache statement}}
      `,
      result: `
{{mustacheStatement param}}
{{!-- A rather long comment should have a new line before and after that --}}
{{mustache statement}}`
    }
  ];
};
