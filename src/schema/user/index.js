import * as typeUser from './typeUser'
import * as queryUser from './queryUser'
import * as mutationCreateUser from './mutationCreateUser'
import * as mutationSignIn from './mutationSignIn'
import  { merge } from 'lodash'

var typeDefs = [ typeUser ]
var queries = [queryUser]
var mutations = [
  mutationCreateUser, 
  mutationSignIn
]

export const typedef = `
  ${typeDefs.map(e => e.schema).join('\n')}
`

export const query = `
  ${queries.map(e => e.schema).join('\n')}
`

export const mutation = `
  ${mutations.map(e => e.schema).join('\n')}
`

export const mutationInput = `
  ${mutations.map(e => e.inputTypeDef).join('\n')}
`

export const mutationPayload=`
  ${mutations.map(e => e.payloadTypeDef).join('\n')}
`

var resolvers_arr = typeDefs.map(e => e.resolver).concat(queries.map(e => e.resolver)).concat(mutations.map(e => e.resolver))
var resolvers = {}
resolvers_arr.forEach((e) => { 
  resolvers = merge(resolvers, e)
})

export { resolvers }
