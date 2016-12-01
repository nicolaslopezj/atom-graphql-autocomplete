'use babel'

export const isJS = function (content, editor) {
  const scope = editor.getGrammar().scopeName
  return (scope === 'source.js.jsx' || scope === 'source.js') &&
  (content.includes(`gql\``) || content.includes('Relay.QL`'))
}

export const isGQL = function (content, editor) {
  const scope = editor.getGrammar().scopeName
  return scope === 'source.graphql'
}
