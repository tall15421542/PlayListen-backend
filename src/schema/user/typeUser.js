<<<<<<< HEAD
import { userList_database_to_graphql, songList_database_to_graphql } from '../../models/songList'
import { listByIdLoader } from '../../loader/index'
=======
import { userList_database_to_graphql } from '../../models/songList'
import { user_database_to_graphql } from '../../models/user'
import { listByIdLoader, userByIdLoader } from '../../loader/index'

>>>>>>> finish follow

export const schema = `
  type User{
    id: ID!
    name: String!
    email: String!
    bio: String
    avatar: String
    playlists: [Playlist!]
    googleId: String
    googleAccessToken: String
    facebookId: String
    facebookAccessToken: String
    savedPlaylists: [SavedPlaylist]
    followers: [User]
    followees: [User]
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

<<<<<<< HEAD
    savedPlaylists: async(user, args, {model}) => {
      const saveLists = await model.savedPlaylist.getByUserId(user.id);
      var playlists = await listByIdLoader.loadMany(saveLists.map(saveList => saveList.listId))
      var ret = []
      for(var i = 0 ; i < playlists.length ; ++i){
        ret.push({playlist: songList_database_to_graphql(playlists[i]), savedAt: saveLists[i].savedAt})
      }
      return ret;
=======
    followers: async(user, args, {model}) => {
      const followerIds = await model.follow.getFollowerIds(user.id)
      const followers = await userByIdLoader.loadMany(followerIds)
      console.log(followers)
      return followers.map(follower => user_database_to_graphql(follower))
    },

    followees: async(user, args, {model}) => {
      const followeeIds = await model.follow.getFolloweeIds(user.id)
      const followees = await userByIdLoader.loadMany(followeeIds)
      return followees.map(followee => user_database_to_graphql(followee))
>>>>>>> finish follow
    }
  }
}
