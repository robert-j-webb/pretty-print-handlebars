<h2 align="center">Handlebars pretty printer</h2>


## Intro

This is an attempt to make a pretty printer for handlebars, powered by the glimmer-vm.

### Input

```hbs
{{mustache param firstHash=hash hash=hash hash=hash hash=hash hash=hash hash=hash hash=hash hash=hash}}
```

### Output

```hbs
{{mustache param firstHash=hash
  hash=hash
  hash=hash
  hash=hash
  hash=hash
  hash=hash
  hash=hash
  hash=hash
}}
```

### Input

```hbs
{{#large-block-component hashKey=hashKey foobar=foobar hashValue=hashValue hashKey=(not (and subExpressionParam subExpressionParam param param param)) hashKey=(action "stringLiteral")
}}
```

### Output

```hbs
{{#large-block-component 
  hashKey=hashKey
  foobar=foobar
  hashValue=hashValue
  hashKey=
    (not
      (and subExpressionParam subExpressionParam param param param)
    )
  hashKey=(action "stringLiteral")
}}
```

### Input

```hbs
{{foobar-sub-component/foobar-foo 
  hook="stringLiteral" 
  foo=(t (concat "stringLiteral" (get blockParam "stringLiteral") hash=hash hash=hash) 
    foo=(simple-helper (hash hashKey=blockParam.foo assignParam=blockParam.bar)))}}
```

### Output
<!-- prettier-ignore -->
```hbs
{{foobar-sub-component/foobar-foo 
  hook="stringLiteral"
  foo=
    (t
      (concat
        "stringLiteral"
        (get blockParam "stringLiteral")
        hash=hash
        hash=hash
      )
      foo=
        (simple-helper (hash hashKey=blockParam.foo assignParam=blockParam.bar))
    )
}}
```

### Input

```hbs
<input type="stringLiteral" class="stringLiteral" name="stringLiteral" onChange={{action "stringLiteral" null}} checked={{is-empty fooBarParam}}>

```

### Output

```hbs
<input type="stringLiteral"
  class="stringLiteral"
  name="stringLiteral"
  onChange={{action "stringLiteral" null}}
  checked={{is-empty fooBarParam}}>
```

### Input

<!-- prettier-ignore -->

```hbs
{{#with (long-name-helper (map-by "stringLiteral" foobar.keyOfParam)) as |block assign|}}{{/with}}

```

### Output

<!-- prettier-ignore -->
```hbs
{{#with 
  (long-name-helper (map-by "stringLiteral" foobar.keyOfParam))
as |block assign|}}
  
{{/with}}
```


---

## ToDo

1. Accept file/directory as input/output
2. Find more test cases that may fail and fix them.
3. Make the print function more modular
4. Add proper travis ci integration
5. Write contribution.md
6. Make a website where one can interactively test the pretty printer.


## Testing

npm run test:watch