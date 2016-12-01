'use babel'

import {isJS, isGQL} from './isType'
/* global atom */

const replaceTag = function (content) {
  if (!atom.config.get('graphql-autocomplete.disableErrors.templateString')) return content
  return content.replace(/(?:...)?\${\w+}/g, '')
}

export default function (content, editor) {
  if (isJS(content, editor)) {
    const queries = []
    const regex = /(?:gql|Relay\.QL)`((?:.|\n)+?)`/g
    let match
    while ((match = regex.exec(content)) !== null) {
      if (match.index === regex.lastIndex) regex.lastIndex++
      queries.push(replaceTag(match[1]))
    }
    return queries
  } else if (isGQL(content, editor)) {
    return [content]
  } else {
    return []
  }
}
