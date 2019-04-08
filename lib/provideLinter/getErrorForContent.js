'use babel'

import getRange from './getRange'
import cleanQuery from '../graphql/cleanQuery'
import {parse, validate} from 'graphql'
/* global atom */

export default function getErrorsForContent(editor, schema, content, fileContent) {
  try {
    const cleanedQuery = cleanQuery(content)
    const ast = parse(cleanedQuery)
    const errors = schema ? validate(schema, ast) : []
    return errors
      .filter(error => {
        if (
          atom.config.get('graphql-autocomplete.disableErrors.fragmentIsNeverUsed') &&
          /Fragment "[A-z]+" is never used\./g.test(error.message)
        ) {
          return false
        }

        if (
          atom.config.get('graphql-autocomplete.disableErrors.unknownFragment') &&
          /Unknown fragment "[A-z]+"./g.test(error.message)
        ) {
          return false
        }

        return true
      })
      .map(error => {
        const location = error.locations[0]
        const node = error.nodes[0]
        const range = getRange({content, fileContent, location, node})
        return {
          severity: 'error',
          excerpt: error.message,
          location: {
            file: editor.getPath(),
            position: range
          }
        }
      })
  } catch (error) {
    const location = error.locations[0]
    const range = getRange({content, fileContent, location})
    return [
      {
        severity: 'error',
        excerpt: error.message,
        location: {
          file: editor.getPath(),
          position: range
        }
      }
    ]
  }
}
