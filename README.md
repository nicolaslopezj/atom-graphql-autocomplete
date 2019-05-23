# GraphQL Autocomplete Atom

```sh
graphql-autocomplete
```

Autocomplete and lint from a GraphQL endpoint or static JSON introspection query in atom.

![](https://github.com/nicolaslopezj/atom-graphql-autocomplete/blob/master/resources/example.png)

### Instructions

- Create a `.graphqlrc` file in the root of your project

- For querying against a live endpoint, add the `endpoint`:

```json
{
  "request": {
    "url": "http://localhost:3000/graphql"
  }
}
```

- Adding headers for ex authentication:

```
{
  "request": {
    "url": "http://localhost:8082/v1alpha1/graphql",
    "headers": {
      "Authorization": "Bearer <token>"
    }
  }
}
```

- For using a static file, add the `file path` (can be relative to the project or the fully-qualified path):

```json
{
  "file": {
    "path": "./introspection.json"
  }
}
```
