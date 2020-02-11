import { user_database_to_authentication_result } from '../../models/user'
export const schema = `
  createUserByFacebook(data: CreateUserByFacebookInput): CreateUserByFacebookPayload!
`
export const inputTypeDef = `
  input CreateUserByFacebookInput{
    userName: String!
    email: String!
    facebookId: String!
    facebookAccessToken: String!
  }
`
export const payloadTypeDef = `
  type CreateUserByFacebookPayload{
    user: User 
    token: String 
    result: String!
  }
`
export const resolver = {
  Mutation: {
    createUserByFacebook: async(parent, {data}, {model}) => {
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
  }
}
