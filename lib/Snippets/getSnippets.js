'use babel'

import {getAutocompleteSuggestions} from 'graphql-language-service-interface'

const getRow = function (fileContent, query, bufferPosition) {
  const prefix = fileContent.split(query)[0]
  const lines = prefix.split('\n')
  const startLine = lines.length - 1
  return bufferPosition.row - startLine
}

const getColumn = function (fileContent, query, bufferPosition) {
  const row = getRow(fileContent, query, bufferPosition)
  if (row === 0) {
    const prefixLines = fileContent.split(query)[0].split('\n')
    const linePrefix = prefixLines[prefixLines.length - 1]
    return bufferPosition.column - linePrefix.length
  } else {
    return bufferPosition.column
  }
}

const isCursorInQuery = function (query, fileContent, bufferPosition) {
  const prefix = fileContent.split(query)[0]
  const lines = prefix.split('\n')
  const startLine = lines.length - 1
  const endLine = startLine + query.split('\n').length - 1
  return startLine <= bufferPosition.row && endLine >= bufferPosition.row
}

export default async function ({schema, query, fileContent, editor, bufferPosition, scopeDescriptor, file, lineText, prefix}) {
  if (!isCursorInQuery(query, fileContent, bufferPosition)) return []
  const cursor = {line: getRow(fileContent, query, bufferPosition), character: getColumn(fileContent, query, bufferPosition)}
  const hints = getAutocompleteSuggestions(schema, query, cursor)

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
