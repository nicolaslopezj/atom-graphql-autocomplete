'use babel'

/* global atom */
import getSchema from '../graphql/getSchema'
import { parse, validate } from 'graphql'
import getQueriesInFile from '../graphql/getQueriesInFile'
import getRange from './getRange'

export default class Linter {
  name = 'GraphQL'
  grammarScopes = ['source.js.jsx', 'source.js', 'source.graphql']
  scope = 'file'
  lintOnFly = true

  getErrorsForContent (editor, schema, content, fileContent) {
    try {
      const ast = parse(content)
      const errors = schema ? validate(schema, ast) : []
      return errors.filter(error => {
        if (
          atom.config.get('graphql-autocomplete.disableErrors.fragmentIsNeverUsed') &&
          /Fragment "[A-z]+" is never used\./g.test(error.message)
        ) return false
        return true
      }).map(error => {
        const location = error.locations[0]
        const node = error.nodes[0]
        const range = getRange({content, fileContent, location, node})
        return {
          type: 'Error',
          text: error.message,
          range,
          filePath: editor.getPath()
        }
      })
    } catch (error) {
      const location = error.locations[0]
      const range = getRange({content, fileContent, location})
      return [{
        type: 'Error',
        text: error.message,
        range,
        filePath: editor.getPath()
      }]
    }
  }

  async lint (editor) {
    try {
      let errors = []
      const fileContent = editor.buffer.lines.join('\n')
      const queries = getQueriesInFile(fileContent, editor)
      if (queries.length === 0) return []
      const schema = await getSchema()
      for (const query of queries) {
        const queryErrors = this.getErrorsForContent(editor, schema, query, fileContent)
        for (const error of queryErrors) {
          errors.push(error)
        }
      }
      return errors
    } catch (error) {
      console.log('LinterError', error)
      return []
    }
  }
}
