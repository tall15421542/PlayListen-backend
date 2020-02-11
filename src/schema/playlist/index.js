import * as typePlaylist from './typePlaylist'
import * as queryPlaylist from './queryPlaylist'
import * as queryExplorePlaylist from './queryExplorelist'
import * as mutationCreatePlaylist from './mutationCreatePlaylist'
import * as mutationUpdatePlaylist from './mutationUpdatePlaylist'
import * as mutationDeletePlaylist from './mutationDeletePlaylist'
import * as mutationSavePlaylist from './mutationSavePlaylist'
import * as mutationDeleteSavedPlaylist from './mutationDeleteSavedPlaylist'
import * as querySavedPlaylist from './querySavedPlaylist'
import  { merge } from 'lodash'

var typeDefs = [ typePlaylist ]

var queries = [
  queryPlaylist, 
  queryExplorePlaylist,
  querySavedPlaylist
]

var mutations = [
  mutationCreatePlaylist, 
  mutationUpdatePlaylist, 
  mutationDeletePlaylist,  
  mutationSavePlaylist,
  mutationDeleteSavedPlaylist
]

var resolvers_arr = typeDefs.map(e => e.resolver).concat(queries.map(e => e.resolver)).concat(mutations.map(e => e.resolver))
var resolvers = {}
resolvers_arr.forEach((e) => { 
  resolvers = merge(resolvers, e)
})

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
export { resolvers }
