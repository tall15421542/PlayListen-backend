import { songList_database_to_graphql } from '../../models/songList'
import { listByIdLoader } from '../../loader/index'

export const schema = `
  createPlaylist(data: CreatePlaylistInput!): Playlist!
`
export const inputTypeDef = `
  input CreatePlaylistInput{
      name: String!
      ownerId: String!
      des: String
      cover: String
      songs: [CreateSongInput!]
  }
`
export const payloadTypeDef = `

`
export const resolver = {
  Mutation: {
    createPlaylist: async(parent, {data}, {model}) =>{
      const listId = await model.songList.create(data, 'youtube')
      const list = await model.songList.getById(listId)
      listByIdLoader.prime(listId, list)
      return songList_database_to_graphql(list) 
    }
  }
}
