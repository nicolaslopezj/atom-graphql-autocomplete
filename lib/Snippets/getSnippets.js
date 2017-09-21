'use babel'

import {getAutocompleteSuggestions} from 'graphql-language-service-interface'
import cleanQuery from '../graphql/cleanQuery'
import getCustomSnippet from './getCustomSnippet'

const getRow = function(fileContent, query, bufferPosition) {
  const prefix = fileContent.split(query)[0]
  const lines = prefix.split('\n')
  const startLine = lines.length - 1
  return bufferPosition.row - startLine
}

const getColumn = function(fileContent, query, bufferPosition) {
  const row = getRow(fileContent, query, bufferPosition)
  if (row === 0) {
    const prefixLines = fileContent.split(query)[0].split('\n')
    const linePrefix = prefixLines[prefixLines.length - 1]
    return bufferPosition.column - linePrefix.length
  } else {
    return bufferPosition.column
  }
}

const isCursorInQuery = function(query, fileContent, bufferPosition) {
  const prefix = fileContent.split(query)[0]
  const lines = prefix.split('\n')
  const startLine = lines.length - 1
  const endLine = startLine + query.split('\n').length - 1
  return startLine <= bufferPosition.row && endLine >= bufferPosition.row
}

export default async function({schema, query, fileContent, bufferPosition}) {
  if (!isCursorInQuery(query, fileContent, bufferPosition)) return []
  const cursor = {
    line: getRow(fileContent, query, bufferPosition),
    character: getColumn(fileContent, query, bufferPosition)
  }
  const cleanedQuery = cleanQuery(query)
  const hints = getAutocompleteSuggestions(schema, cleanedQuery, cursor)
  const custom = getCustomSnippet(hints, schema, cleanedQuery, cursor)
  if (custom) {
    hints.push(custom)
  }

  if (!hints) return []
  return hints.map(hint => {
    return {
      snippet: hint.label,
      displayText: hint.label,
      leftLabel: hint.detail,
      description: hint.documentation || 'Self descriptive.'
    }
  })
}
