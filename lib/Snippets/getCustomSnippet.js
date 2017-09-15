'use babel'
import {getAutocompleteSuggestions} from 'graphql-language-service-interface'

const isInFunctionArgs = function(query, cursor) {
  const line = query.split('\n')[cursor.line]
  const character = line.split('')[cursor.character - 1]
  return character === '('
}

const isInsideQuery = function(query, cursor) {
  const lines = query.split('\n')
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    const characters = line.split('')
    for (let j = 0; j < characters.length; j++) {
      const character = characters[j]
      if (character === '{') {
        if (i === cursor.line) {
          if (j >= cursor.character) {
            return false
          }
        }
        return true
      }
    }
  }
  return false
}

const hasEndingParenthesis = function(query, cursor) {
  const line = query.split('\n')[cursor.line]
  const character = line.split('')[cursor.character]
  return character === ')'
}

const getAllParameters = function(schema, query) {
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

export default function(hints, schema, query, cursor) {
  const isInside = isInsideQuery(query, cursor)
  const isInFunction = isInFunctionArgs(query, cursor)
  if (isInside && isInFunction) {
    const ending = hasEndingParenthesis(query, cursor) ? '' : ')'
    const text = hints.map(({label}) => `${label}: $${label}`).join(', ') + ending
    return {
      label: text,
      detail: 'Arguments',
      documentation: 'Include all arguments of the field'
    }
  } else if (isInFunction) {
    const ending = hasEndingParenthesis(query, cursor) ? '' : ')'
    const allHints = getAllParameters(schema, query)
    const text = allHints.map(({label, detail}) => `$${label}: ${detail}`).join(', ') + ending
    return {
      label: text,
      detail: 'Arguments',
      documentation: 'Include all arguments of the field'
    }
  }
}
