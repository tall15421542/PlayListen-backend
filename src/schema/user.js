import { user_database_to_graphql, user_database_to_authentication_result } from '../models/user'
import { userList_database_to_graphql } from '../models/songList'

export const typedef = `
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

export const query = `
    user(userId: String!): User
`

export const mutation = `
    createUser(data: CreateUserInput): CreateUserPayload!
    signIn(data: SignInInput): SignInPayload!
    follow(data: FollowInput!): FollowPayload!
`

export const mutationInput = `
  input CreateUserInput{
      userName: String!
      email: String!
      password: String!
  }

  input SignInInput{
      userName: String!
      password: String!
  }

  input FollowInput{
    followerId: String!
    followingId: String!
  }
  
  type FollowPayload{
    following: User!
  }
`

export const mutationPayload=`
  type CreateUserPayload{
      user: User 
      token: String 
      result: String!
  }

  type SignInPayload{
      user: User 
      token: String 
      result: String!
  }
`

export const resolvers = {
  User: {
      playlists: async(user, args, {model}) => {
          const userList = await model.songList.getByUser(user.id);
          return userList_database_to_graphql(userList);
      },

      googleAccessToken: async(user, args, {model}) => {
        return await model.user.getGoogleAccessToken(user.id)
      }
  },

  Query:{
    user: async(parent, {userId}, {model}) =>{
        const u = await model.user.getById(userId)
        const ret = user_database_to_graphql(u)
        return ret
    },
  },

  Mutation:{
    createUser: async(parent, {data}, {model}) => {
        const exist = await model.user.exist(data)
        if(!exist){
            const user = await model.user.create(data)
            return user_database_to_authentication_result(user)
        }
        return{
            user: null,
            token: null,
            result: 'duplicate'
        }
    },

    signIn: async(parent, {data}, {model}) => {
        const user = await model.user.getByName(data.userName)
        if(user && user.password === data.password){
            return user_database_to_authentication_result(user)
        }
        if(user && user.password !== data.password){
            return{
                user: null, 
                token: null,
                result: 'password_fail'
            }
        }
        return{
            user: null,
            token: null,
            result: 'not_exist'
        }
    },

  },

}
