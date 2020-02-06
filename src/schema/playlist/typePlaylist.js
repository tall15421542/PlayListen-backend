import { user_database_to_graphql } from '../../models/user'
import { songs_to_graphql } from '../../models/songList'

export const schema = `
  type Playlist{
    id: ID!
    owner: User!
    name: String!
    des: String!
    cover: String!
    createdAt: Date!
    updatedAt: Date!
    songs: [Song!]!
  }
`
export const resolver = {
  Playlist: {
    songs: async (playlist, args, { model} ) => {
      if(playlist.songs){
        console.log("I have")
        console.log(playlist.songs)
        return playlist.songs
      }
      const result = await model.song.getMultipleInstance(playlist.id)
      return songs_to_graphql(result)
    },
    owner: async(playlist, args, {model} ) => {
      const result = await model.user.getById(playlist.ownerId)
      return user_database_to_graphql(result)
    }
  }
}
