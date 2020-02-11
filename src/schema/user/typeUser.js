import { userList_database_to_graphql } from '../../models/songList'
import { listByIdLoader } from '../../loader/index'

export const schema = `
  type User{
    id: ID!
    name: String!
    email: String!
    bio: String
    avatar: String
    playlists: [Playlist!]
    savedLists: [Playlist]
    followingList: [User]
    googleId: String
    googleAccessToken: String
    facebookId: String
    facebookAccessToken: String
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
    }
  }
}
