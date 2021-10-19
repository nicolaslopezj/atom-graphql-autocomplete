'use babel'

export default function ({content, query}) {
  try {
    const pre = content.split(query)[0]
    const lines = pre.split('\n')
    return lines.length
  } catch (error) {
    console.log('error getting line', error)
    return 1
  }
}
