# GraphQL Autocomplete Atom

```sh
graphql-autocomplete
```

Autocomplete and lint from a GraphQL endpoint or static JSON introspection query in atom.

![](https://github.com/nicolaslopezj/atom-graphql-autocomplete/blob/master/resources/example.png)

### Instructions

- Create a ```.graphqlrc``` file in the root of your project

- For querying against a live endpoint, add the ```endpoint```:

```json
{
  "request": {
    "url": "http://localhost:3000/graphql"
  }
}
```

- For using a static file, add the `file path`:

```json
{
  "file": {
    "path": "./introspection.json"
  }
}
```
