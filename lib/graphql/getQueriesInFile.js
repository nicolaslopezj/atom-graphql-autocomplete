'use babel'

import {isJS, isGQL} from './isType'
import getStartingLine from './getStartingLine'
import getClientName from './getClientName'

export default function (content, editor) {
  if (isJS(content, editor)) {
    const queries = []
    const regex = /(?:gql|Relay\.QL)`((?:.|\n)+?)`/g
    let match
    while ((match = regex.exec(content)) !== null) {
      if (match.index === regex.lastIndex) regex.lastIndex++
      const query = match[1]
      try {
        const line = getStartingLine({content, query})
        const clientName = getClientName({content, line: line - 1})
        queries.push({query, clientName})
      } catch (error) {
        console.log('error reading client name', error)
        queries.push({query})
      }
    }
    return queries
  } else if (isGQL(content, editor)) {
    return [{query: content}]
  } else {
    return []
  }
}
