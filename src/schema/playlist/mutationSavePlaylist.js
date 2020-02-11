import { listByIdLoader } from '../../loader/index'
import { songList_database_to_graphql } from '../../models/songList'

export const schema = `
  savePlaylist(data: SavePlaylistInput!): SavePlaylistPayload!
`
export const inputTypeDef = `
  input SavePlaylistInput{
    userId: String!
    listId: String!
  }
`

export const payloadTypeDef = `
  type SavePlaylistPayload{
    savedList: [Playlist!]
  }
`

export const resolver = {
  Mutation: {
    savePlaylist: async(parent, {data}, {model}) =>{
      await model.savedPlaylist.create(data)
      const listIds = await model.savedPlaylist.getListIdsByUserId(data.userId)
      const lists = await listByIdLoader.loadMany(listIds)
      const savedList = lists.map(list => {
        return songList_database_to_graphql(list)
      })
      return { savedList }
    }
  }
}
