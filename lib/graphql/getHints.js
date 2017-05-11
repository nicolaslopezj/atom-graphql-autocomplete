'use babel'
import {getAutocompleteSuggestions} from 'graphql-language-service-interface'

export default function ({ schema, query, cursor }) {
  console.log(cursor, query)
  return getAutocompleteSuggestions(schema, query, cursor)
}
