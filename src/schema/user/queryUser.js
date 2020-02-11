import { user_database_to_graphql } from '../../models/user'
import { userByIdLoader } from '../../loader/index'
export const schema =`
  user(userId: String!): User
`
export const resolver = {
  Query:{
    user: async(parent, {userId}, {model}) =>{
      // const u = await model.user.getById(userId)
      const u = await userByIdLoader.load(userId)
      const ret = user_database_to_graphql(u)
      return ret
    },
  },
}
