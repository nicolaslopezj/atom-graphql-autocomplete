'use babel'

import {parse} from 'graphql'
import getIsMutation from './getIsMutation'
import capitalize from 'lodash/capitalize'
import getAllQueryParameters from './getAllQueryParameters'

export default function({hints, schema, query, cursor}) {
  const isMutation = getIsMutation(query)
  try {
    const {definitions} = parse(query)
    const name = definitions[0].selectionSet.selections[0].name.value
    const funcName = isMutation ? name : 'get' + capitalize(name)

    const allHints = getAllQueryParameters(schema, query)
    const params = allHints.length
      ? '(' + allHints.map(({label, detail}) => `$${label}: ${detail}`).join(', ') + ')'
      : ''

    return {
      label: funcName + params,
      detail: isMutation ? 'Name' : 'Name',
      documentation: isMutation ? 'Default mutation name' : 'Default query name'
    }
  } catch (error) {}
}
