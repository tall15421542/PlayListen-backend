import { user_database_to_authentication_result } from '../../models/user'
export const schema = `
  createUser(data: CreateUserInput): CreateUserPayload!
`
export const inputTypeDef = `
  input CreateUserInput{
    userName: String!
    email: String!
    password: String!
  }
`
export const payloadTypeDef = `
  type CreateUserPayload{
    user: User 
    token: String 
    result: String!
  }
`
export const resolver = {
  Mutation: {
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
  }
}
