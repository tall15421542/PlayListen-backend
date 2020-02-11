import { listByIdLoader } from '../../loader/index'
import { songList_database_to_graphql } from '../../models/songList'
export const schema = `
  deleteSavedPlaylist(data: DeleteSavedPlaylistInput!): DeleteSavedPlaylistPayload!
`
export const inputTypeDef = `
  input DeleteSavedPlaylistInput{
    userId: String!
    listId: String!
  }
`

export const payloadTypeDef = `
  type DeleteSavedPlaylistPayload{
    savedList: [Playlist!]
  }
`

export const resolver = {
  Mutation: {
    deleteSavedPlaylist: async(parent, {data}, {model}) =>{
      await model.savedPlaylist.delete(data)
      const listIds = await model.savedPlaylist.getListIdsByUserId(data.userId)
      console.log(listIds)
      const lists = await listByIdLoader.loadMany(listIds)
      const savedList = lists.map(list => songList_database_to_graphql(list))
      return { savedList }
    }
  }
}
