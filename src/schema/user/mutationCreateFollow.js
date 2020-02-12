export const schema = `
  createFollow(data: CreateFollowInput): CreateFollowPayload!
`
export const inputTypeDef = `
  input CreateFollowInput{
    followerId: String!
    followeeId: String!
  }
`
export const payloadTypeDef = `
  type CreateFollowPayload{
    success: Boolean!
  }
`
export const resolver = {
  Mutation: {
    createFollow: async(parent, {data}, {model}) => {
      await model.follow.create(data)
      return {
        success: true
      }
    },
  }
}
