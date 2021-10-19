'use babel'
import {buildClientSchema} from 'graphql'

export default ({data}) => buildClientSchema(data)
