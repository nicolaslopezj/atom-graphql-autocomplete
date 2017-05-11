'use babel'

import getHints from '../graphql/getHints'

const getRow = function (fileContent, query, bufferPosition) {
  const prefix = fileContent.split(query)[0]
  const lines = prefix.split('\n')
  const startLine = lines.length - 1
  return bufferPosition.row - startLine
}

const getColumn = function (fileContent, query, bufferPosition) {
  const prefix = fileContent.split(query)[0]
  const row = getRow(fileContent, query, bufferPosition)
  if (row === 0) {
    return prefix.length + bufferPosition.column
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
  const hints = getHints({schema, query, cursor})

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
