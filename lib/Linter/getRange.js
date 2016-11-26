'use babel'

const getNodeLength = function (node) {
  if (!node) return 1
  if (node.kind === 'VariableDefinition') {
    return node.variable.name.value.length + 1
  } else if (node.kind === 'Variable') {
    return node.name.value.length + 1
  } else if (node.kind === 'Field') {
    return node.name.value.length
  } else if (node.kind === 'Argument') {
    return node.name.value.length
  } else {
    return node.loc.end - node.loc.start
  }
}

export default function ({content, fileContent, location, node}) {
  const prefix = fileContent.split(content)[0]
  const lines = prefix.split('\n')
  const line = lines.length + 1
  const finalLine = line + location.line - 3
  const column = location.line === 1 ? lines[lines.length - 1].length : 0
  let startFinalColumn = column + location.column - 1
  let length = getNodeLength(node)
  const endFinalColumn = startFinalColumn + length
  if (node && node.alias && node.alias.value) {
    startFinalColumn += node.alias.value.length + 2
  }
  return [
    [finalLine, startFinalColumn],
    [finalLine, endFinalColumn]
  ]
}
