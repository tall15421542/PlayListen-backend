import { user_database_to_graphql } from '../../models/user'
export const schema =`
  searchUser(prefix: String!): [User!]
`
export const resolver = {
  Query:{
    searchUser: async(parent, {prefix}, {model}) => {
        const users = await model.user.searchByPrefix(prefix)
        return users.map( user => user_database_to_graphql(user))
    },
  }
}
