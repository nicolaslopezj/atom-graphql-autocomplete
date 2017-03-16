'use babel'
/* global fetch */
/* global atom */

import {buildClientSchema, introspectionQuery} from 'graphql'
import fs from 'fs-plus'
import _ from 'underscore'
import path from 'path'

let id = 1
const addId = _.debounce(() => id++, 10 * 1000 /* 10 seconds */)
const getId = function () {
  addId()
  return id
}

const buildClientFromIntrospection = ({ data }) => buildClientSchema(data)

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
  return buildClientFromIntrospection(introspection)
}

const getFromFSPath = (filePath) => {
  const projectPath = atom.project.getPaths()[0]
  const fqPath = fs.isAbsolute(filePath)
    ? filePath
    : path.join(projectPath, filePath)

  if (!fs.existsSync(fqPath)) {
    console.warn(`Error reading graphql introspection JSON from: ${fqPath}`)
    return {}
  }

  try {
    const data = JSON.parse(fs.readFileSync(fqPath).toString())
    return buildClientFromIntrospection({ data })
  } catch (error) {
    console.warn(`Error deserializing graphql introspection json from: ${fqPath} ${error.message}`)
    return {}
  }
}

let schema = null
let lastId = null

export default async function () {
  const id = getId()
  const config = getConfig()
  if (config.file && config.file.path) return getFromFSPath(config.file.path)
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
