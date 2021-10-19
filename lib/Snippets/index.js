'use babel'
import getSnippets from './getSnippets'
import {isJS, isGQL} from '../graphql/isType'
import getQueriesInFile from '../graphql/getQueriesInFile'
import getSchema from '../graphql/getSchema'

export default class Snippets {
  selector = '.source.js, .source.graphql'
  inclusionPriority = 100
  suggestionPriority = 2

  async getSuggestions({editor, bufferPosition, scopeDescriptor, prefix}) {
    const fileContent = editor.buffer.getText()
    const lines = fileContent.split('\n')
    const lineText = lines[bufferPosition.row]
    const file = editor.buffer.file

    if (!isJS(fileContent, editor) && !isGQL(fileContent, editor)) return []

    try {
      const queries = getQueriesInFile(fileContent, editor)
      if (queries.length === 0) return []
      for (const {query, clientName} of queries) {
        const schema = await getSchema(clientName)

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
