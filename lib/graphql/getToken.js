'use babel'

import CharacterStream from 'codemirror-graphql/utils/CharacterStream'
import { LexRules, ParseRules, isIgnored } from 'codemirror-graphql/utils/Rules'
import onlineParser from 'codemirror-graphql/utils/onlineParser'
import _ from 'underscore'

const getToken = function (query, {row, column}) {
  const parserOptions = {
    eatWhitespace: stream => stream.eatWhile(isIgnored),
    LexRules,
    ParseRules
  }
  const parser = onlineParser(parserOptions)
  const state = parser.startState()
  const lines = query.split('\n')

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    const stream = new CharacterStream(line)
    let style = null
    for (let i = 0; !stream.eol() && i < 1000; i++) {
      style = parser.token(stream, state)
      if (style === 'invalidchar') {
        return {stream, state, style}
      }
      if (i === row && column === stream._pos) {
        return {stream, state, style}
      }
    }
    if (i === row) {
      if (!style) return null
      return {stream, state, style}
    }
  }
}

export default async function (editor, query, bufferPosition, prefix) {
  const {stream, state, style} = getToken(query, bufferPosition)
  return {
    string: prefix,
    stream: _.clone(stream),
    state: _.clone(state),
    style: _.clone(style)
  }
}
