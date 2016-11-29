'use babel'

import {isJS, isGQL} from './isType'

export default function (content, editor) {
  if (isJS(content, editor)) {
    const queries = []
    let result = /(.|\n)*((gql|Relay\.QL)`((.|\n)+)`)[),](.|\n)*/g.exec(content)
    let part = result[4]
    queries.push(part)
    let tries = 0
    while (part && tries < 100) {
      tries++
      content = content.replace(result[2], '')
      result = /(.|\n)*((gql|Relay\.QL)`((.|\n)+)`)[),](.|\n)*/g.exec(content)
      if (!result) break
      part = result[4]
      queries.push(part)
    }

    console.log(queries, 'queryies')

    return queries
  } else if (isGQL(content, editor)) {
    return [content]
  } else {
    return []
  }
}
