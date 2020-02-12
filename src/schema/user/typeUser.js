import { userList_database_to_graphql, songList_database_to_graphql } from '../../models/songList'
import { listByIdLoader } from '../../loader/index'

export const schema = `
  type User{
    id: ID!
    name: String!
    email: String!
    bio: String
    avatar: String
    playlists: [Playlist!]
    followingList: [User]
    googleId: String
    googleAccessToken: String
    facebookId: String
    facebookAccessToken: String
    savedPlaylists: [SavedPlaylist]
  }
`

export const resolver = {
  User: {
    playlists: async(user, args, {model}) => {
      // const userList = await model.songList.getByUser(user.id);
      const listIds = await model.songList.getListIdsByUser(user.id)
      const userList = await listByIdLoader.loadMany(listIds)
      return userList_database_to_graphql(userList);
    },

    googleAccessToken: async(user, args, {model}) => {
      return await model.user.getGoogleAccessToken(user.id)
    },

    savedPlaylists: async(user, args, {model}) => {
      const saveLists = await model.savedPlaylist.getByUserId(user.id);
      var playlists = await listByIdLoader.loadMany(saveLists.map(saveList => saveList.listId))
      var ret = []
      for(var i = 0 ; i < playlists.length ; ++i){
        ret.push({playlist: songList_database_to_graphql(playlists[i]), savedAt: saveLists[i].savedAt})
      }
      return ret;
    }
  }
}
