'use babel'

import {isJS, isGQL} from './isType'

export default function (content, editor) {
  if (isJS(content, editor)) {
    const queries = []
    const regex = /(?:gql|Relay\.QL)`((?:.|\n)+?)`/g
    let match
    while ((match = regex.exec(content)) !== null) {
      if (match.index === regex.lastIndex) regex.lastIndex++
      const query = match[1]
      queries.push(query)
    }
    return queries
  } else if (isGQL(content, editor)) {
    return [content]
  } else {
    return []
  }
}
