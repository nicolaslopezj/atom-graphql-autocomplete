'use babel'

import {isJS, isGQL} from './isType'

export default function (content, editor) {
  if (isJS(content, editor)) {
    const queries = []
    const regex = /(?:gql|Relay\.QL)`((?:.|\s)+?)`/g
    let match
    while ((match = regex.exec(content)) !== null) {
      if (match.index === regex.lastIndex) regex.lastIndex++
      queries.push(match[1])
    }
    return queries
  } else if (isGQL(content, editor)) {
    return [content]
  } else {
    return []
  }
}
