'use babel'

import getSchema from '../graphql/getSchema'
import getQueriesInFile from '../graphql/getQueriesInFile'
import getErrorForContent from './getErrorForContent'

/*
name = 'GraphQL'
grammarScopes = ['source.js.jsx', 'source.js', 'source.graphql']
scope = 'file'
lintOnFly = true
 */

export default async function lint(editor) {
  try {
    let errors = []
    const fileContent = editor.buffer.getText()
    const queries = getQueriesInFile(fileContent, editor)
    if (queries.length === 0) return []
    const schema = await getSchema()
    for (const query of queries) {
      const queryErrors = getErrorForContent(editor, schema, query, fileContent)
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
