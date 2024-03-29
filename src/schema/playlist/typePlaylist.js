import { user_database_to_graphql } from '../../models/user'
import { songs_to_graphql } from '../../models/songList'
import { userByIdLoader, songsByListIdLoader } from '../../loader/index'

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
    isSaved: Boolean!
  }
`
export const resolver = {
  Playlist: {
    songs: async (playlist, args, { model} ) => {
      const result = await songsByListIdLoader.load(playlist.id)
      return songs_to_graphql(result)
    },
    owner: async(playlist, args, {model} ) => {
      const result = await userByIdLoader.load(playlist.ownerId)
      return user_database_to_graphql(result)
    },
    isSaved: async(playlist, args, {model, me}) => {
      if(!me) return false
      const savedLists = await model.savedPlaylist.getByUserId(me.id)
      for(var savedList of savedLists){
        if(savedList.listId === playlist.id){
          return true
        }
      }
      return false
    }
  }
}
