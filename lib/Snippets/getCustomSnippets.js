'use babel'

import getQueryParams from './getQueryParams'
import getQueryName from './getQueryName'

export default function({hints, schema, query, cursor}) {
  const snippets = []

  const queryParams = getQueryParams({hints, schema, query, cursor})
  if (queryParams) {
    snippets.push(queryParams)
  }

  const name = getQueryName({hints, schema, query, cursor})
  if (name) {
    snippets.push(name)
  }

  return snippets
}
