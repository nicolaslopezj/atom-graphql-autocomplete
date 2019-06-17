'use babel'

export default function(query) {
  return query.trim().startsWith('mutation')
}
