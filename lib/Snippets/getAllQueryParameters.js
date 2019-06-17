'use babel'
import {getAutocompleteSuggestions} from 'graphql-language-service-interface'

export default function(schema, query) {
  const lines = query.split('\n')
  const hints = []
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    const characters = line.split('')
    for (let j = 0; j < characters.length; j++) {
      const character = characters[j]
      if (character === '(') {
        const cursor = {line: i, character: j + 1}
        for (const hint of getAutocompleteSuggestions(schema, query, cursor)) {
          if (query.includes('$' + hint.label)) {
            hints.push(hint)
          }
        }
      }
    }
  }
  return hints
}
