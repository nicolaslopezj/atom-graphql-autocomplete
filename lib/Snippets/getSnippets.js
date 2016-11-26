'use babel'

import getHintsAtPosition from 'codemirror-graphql/utils/getHintsAtPosition'
import getToken from '../graphql/getToken'

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
  const positionInQuery = {
    row: getRow(fileContent, query, bufferPosition),
    column: getColumn(fileContent, query, bufferPosition)
  }
  const token = await getToken(editor, query, positionInQuery, prefix)
  const cursor = { line: positionInQuery.row + 1, column: positionInQuery.column + 1 }
  const hints = getHintsAtPosition(schema, query, cursor, token)

  if (!hints) return []
  return hints.list.map(hint => {
    return {
      snippet: hint.text,
      displayText: hint.text,
      type: 'value',
      leftLabel: hint.type.toString(),
      description: hint.description || 'Self descriptive.'
    }
  })
}
