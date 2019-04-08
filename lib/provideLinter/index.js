'use babel'
import lint from './lint'

export default function provideLinter() {
  return {
    name: 'GraphQL',
    scope: 'file', // or 'project'
    lintsOnChange: true, // or true
    grammarScopes: ['source.js.jsx', 'source.js', 'source.graphql'],
    lint
  }
}
