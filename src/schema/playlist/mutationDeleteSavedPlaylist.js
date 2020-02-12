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
    success: Boolean
  }
`

export const resolver = {
  Mutation: {
    deleteSavedPlaylist: async(parent, {data}, {model}) =>{
      await model.savedPlaylist.delete(data)
      return { success: true }
    }
  }
}
