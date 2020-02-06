import { user_database_to_authentication_result } from '../../models/user'

export const schema = `
  signIn(data: SignInInput): SignInPayload!
`
export const inputTypeDef = `
  input SignInInput{
    userName: String!
    password: String!
  }
`
export const payloadTypeDef = `
  type SignInPayload{
    user: User 
    token: String 
    result: String!
  }
`
export const resolver = {
  Mutation: {
    signIn: async(parent, {data}, {model}) => {
      const user = await model.user.getByName(data.userName)
      console.log(user)
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
  }
}
