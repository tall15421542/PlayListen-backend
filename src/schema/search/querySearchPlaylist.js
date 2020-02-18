import { songList_database_to_graphql } from '../../models/songList'
export const schema =`
  searchPlaylist(prefix: String!): [Playlist!]
`
export const resolver = {
  Query:{
    searchPlaylist: async(parent, {prefix}, {model}) => {
        const playlists = await model.songList.searchByPrefix(prefix)
        return playlists.map( playlist => songList_database_to_graphql(playlist))
    },
  }
}
