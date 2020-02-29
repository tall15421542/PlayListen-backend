import { songList_database_to_graphql } from '../../models/songList'
import { listByIdLoader, songsByListIdLoader } from '../../loader/index'

export const schema = `
  updatePlaylist(data: UpdatePlaylistInput!): Playlist!
`
export const inputTypeDef = `
  input UpdatePlaylistInput{
    oldId: String!
    listInfo: CreatePlaylistInput!
    createdAt: String!
  }
`
export const payloadTypeDef = `

`
export const resolver = {
  Mutation:{
    updatePlaylist: async(parent, {data}, {model}) => {
      const list = await model.songList.update(data)
      listByIdLoader.clear(list.listId)
      songsByListIdLoader.clear(list.listId)
      return songList_database_to_graphql(list)
    },
  }
}
