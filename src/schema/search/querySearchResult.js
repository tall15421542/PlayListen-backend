import { songs_to_graphql } from '../../models/songList'
export const schema =`
  searchResult(query: String!): [Song!]
`
export const resolver = {
  Query:{
    searchResult: async(parent, {query}, {model}) => {
        const result = await model.search.youtube.getURLInfoArray(query)
        return songs_to_graphql(result)
    },
  }
}
