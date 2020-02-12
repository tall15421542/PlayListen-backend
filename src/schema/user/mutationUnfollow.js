export const schema = `
  unFollow(data: UnFollowInput): UnFollowPayload!
`
export const inputTypeDef = `
  input UnFollowInput{
    followerId: String!
    followeeId: String!
  }
`
export const payloadTypeDef = `
  type UnFollowPayload{
    success: Boolean!
  }
`
export const resolver = {
  Mutation: {
    unFollow: async(parent, {data}, {model}) => {
      await model.follow.delete(data)
      return {
        success: true
      }
    },
  }
}
