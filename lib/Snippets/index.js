'use babel'
import getSnippets from './getSnippets'
import {isJS, isGQL} from '../graphql/isType'
import getQueriesInFile from '../graphql/getQueriesInFile'
import getSchema from '../graphql/getSchema'

export default class Snippets {
  selector = '.source.js, .source.graphql'
  inclusionPriority = 100
  suggestionPriority = 2

  getLine (editor, bufferPosition) {
    return editor.buffer.lines[bufferPosition.row]
  }

  async getSuggestions ({editor, bufferPosition, scopeDescriptor, prefix}) {
    const lineText = this.getLine(editor, bufferPosition)
    const fileContent = editor.buffer.lines.join('\n')
    const file = editor.buffer.file

    if (!isJS(fileContent, editor) && !isGQL(fileContent, editor)) return []

    try {
      const queries = getQueriesInFile(fileContent, editor)
      if (queries.length === 0) return []
      const schema = await getSchema()
      for (const query of queries) {
        const snippets = await getSnippets({
          schema,
          query,
          file,
          lineText,
          editor,
          bufferPosition,
          scopeDescriptor,
          prefix,
          fileContent
        })
        if (snippets.length) {
          return snippets
        }
      }
      return null
    } catch (error) {
      console.log('Orionsoft snippets error', error)
    }
    return null
  }
}
