'use babel'
/* global fetch */
/* global atom */

import {buildClientSchema, introspectionQuery} from 'graphql'
import fs from 'fs-plus'
import _ from 'underscore'

let id = 1
const addId = _.debounce(() => id++, 10 * 1000 /* 10 seconds */)
const getId = function () {
  addId()
  return id
}

const getConfig = function () {
  try {
    const projectPath = atom.project.getPaths()[0]
    const content = fs.readFileSync(`${projectPath}/.graphqlrc`).toString()
    return JSON.parse(content)
  } catch (error) {
    console.warn('Error reading graphql autocomplete config .graphqlrc', error)
    return {}
  }
}

const get = async function ({request}) {
  const result = await fetch(request.url, {
    method: 'post',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      ...request.headers
    },
    body: JSON.stringify({query: introspectionQuery}),
    credentials: 'include'
  })
  const introspection = await result.json()
  const schema = buildClientSchema(introspection.data)
  return schema
}

let schema = null
let lastId = null

export default async function () {
  const id = getId()
  const config = getConfig()
  if (!config.request) return null
  if (lastId === id && schema) return schema
  lastId = id
  try {
    schema = await get(config)
    return schema
  } catch (error) {
    throw new Error('Error GraphQL fetching schema', error.message)
  }
}
