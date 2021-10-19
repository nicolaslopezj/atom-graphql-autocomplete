'use babel'
/* global fetch */
import {getIntrospectionQuery} from 'graphql'
import buildClientFromIntrospection from './buildClientFromIntrospection'
import throttle from 'lodash/throttle'

const introspectionQuery = getIntrospectionQuery()

const fetchFromURL = async function (url) {
  const result = await fetch(url, {
    method: 'post',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({query: introspectionQuery}),
    credentials: 'include'
  })
  const introspection = await result.json()
  return buildClientFromIntrospection(introspection)
}

const fetchers = {}
export default url => {
  if (!fetchers[url]) {
    fetchers[url] = throttle(fetchFromURL, 5000, {trailing: false})
  }
  const fetcher = fetchers[url]
  return fetcher(url)
}
