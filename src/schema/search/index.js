import { songs_to_graphql } from '../../models/songList'
export const typedef = `
  type SearchItem{
    type: Int!
    playlist: Playlist
    user: User
  }
`

export const query = `
    searchResult(query: String!): [Song!]
    search(data: SearchInput!): SearchPayload!
`

export const mutation = `
`

export const mutationInput = `
  input SearchInput{
    prefix: String!
    limit: Int!
  }
`

export const mutationPayload=`
  type SearchPayload{
    result: [SearchItem]
  }
`

export const resolvers = {
  Query:{
    searchResult: async(parent, {query}, {model}) => {
        const result = await model.search.youtube.getURLInfoArray(query)
        return songs_to_graphql(result)
    },
  }
}
