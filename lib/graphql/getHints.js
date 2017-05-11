'use babel'
import {getAutocompleteSuggestions} from 'graphql-language-service-interface'

export default function ({ schema, query, cursor }) {
  return getAutocompleteSuggestions(schema, query, cursor)
}
