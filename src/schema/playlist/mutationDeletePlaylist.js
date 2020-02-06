export const schema = `
  deletePlaylist(data: DeletePlaylistInput!): DeletePlaylistPayload!
`
export const inputTypeDef = `
  input DeletePlaylistInput{
    listId: ID!
  }
`
export const payloadTypeDef = `
  type DeletePlaylistPayload{
    listId: ID!
  }
`
export const resolver = {
  Mutation:{
    deletePlaylist: async(parent, {data}, {model}) => {
      model.songList.delete(data.listId)
      return { listId: data.listId }
    }
  }
}
