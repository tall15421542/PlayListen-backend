import { userList_database_to_graphql } from '../../models/songList'

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
      const userList = await model.songList.getByUser(user.id);
      return userList_database_to_graphql(userList);
    },

    googleAccessToken: async(user, args, {model}) => {
      return await model.user.getGoogleAccessToken(user.id)
    }
  }
}