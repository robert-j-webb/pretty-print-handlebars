<h2 align="center">Handlebars pretty printer</h2>


## Intro

This is an attempt to make a pretty printer for handlebars, powered by the glimmer-vm.

### Input

<!-- prettier-ignore -->
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
  hash=hash}}
```

---


## Testing

npm run test:watch