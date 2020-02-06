import { gql } from 'apollo-server-express'
import * as User from './user/index'
import * as Playlist from './playlist/index'
import * as Search from './search/index'
import * as Song from './song/index'
import * as _Date from './date'
import { makeExecutableSchema } from 'graphql-tools';
import { merge } from 'lodash'

const _typedefs = []
const _queries = []
const _mutations = []
const _mutationInputs = []
const _mutationPayloads = []

const schemas = [User, Playlist, Search, Song, _Date]
var resolvers = {};

schemas.forEach((s) => {
  _typedefs.push(s.typedef)
  _queries.push(s.query)
  _mutations.push(s.mutation)
  _mutationInputs.push(s.mutationInput)
  _mutationPayloads.push(s.mutationPayload)
  resolvers = merge(resolvers, s.resolvers)
})

const schema =gql`
${_typedefs.join('\n')}

type Query{
  ${_queries.join('\n')}
}

type Mutation{
  ${_mutations.join('\n')}
}

${_mutationInputs.join('\n')}
${_mutationPayloads.join('\n')}
`
export { schema, resolvers }

