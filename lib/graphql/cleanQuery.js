'use babel'
/* global atom */

export default function (content) {
  if (!atom.config.get('graphql-autocomplete.disableErrors.templateString')) return content
  return content.replace(/(?:...)?\${\w+}/g, '').replace(/\${[\w.]+}/g, ' ')
}
