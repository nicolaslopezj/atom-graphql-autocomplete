'use babel'
/* global atom */

import fs from 'fs-plus'
import path from 'path'
import fetchSchemaForURL from './fetchSchemaForURL'
import buildClientFromIntrospection from './buildClientFromIntrospection'

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

const get = fetchSchemaForURL

const getFromFSPath = filePath => {
  const projectPath = atom.project.getPaths()[0]
  const fqPath = fs.isAbsolute(filePath) ? filePath : path.join(projectPath, filePath)

  if (!fs.existsSync(fqPath)) {
    console.warn(`Error reading graphql introspection JSON from: ${fqPath}`)
    return {}
  }

  try {
    const {data} = JSON.parse(fs.readFileSync(fqPath).toString())
    return buildClientFromIntrospection({data})
  } catch (error) {
    console.warn(`Error deserializing graphql introspection json from: ${fqPath} ${error.message}`)
    return {}
  }
}

const getURL = (config, clientName) => {
  try {
    if (!clientName) return config.request.url
    return config.clients[clientName]
  } catch (error) {
    return config.request.url
  }
}

export default async function (clientName) {
  const config = getConfig()
  if (config.file && config.file.path) return getFromFSPath(config.file.path)
  try {
    const url = getURL(config, clientName)
    if (!url) return null
    const schema = await get(url)
    return schema
  } catch (error) {
    throw new Error('Error GraphQL fetching schema', error.message)
  }
}
