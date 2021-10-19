'use babel'

export default function ({content, line}) {
  const lines = content.split('\n')
  const lineText = lines[line - 1]
  if (!lineText) return
  if (!lineText.includes('clientName:')) return

  const replace1 = lineText.replace('clientName:', '').trim()
  const replace2 = replace1.split("'")[1]
  if (!replace2) return

  return replace2.trim()
}
