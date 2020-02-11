export const typedef = `
  type Song{
      id: ID!
      listId: String!
      sourceId: String!
      name: String!
      cover: String!
      duration: String!
  }
`

export const query = `
`

export const mutation = `
`

export const mutationInput = `
  input CreateSongInput{
      sourceId: String!
      name: String!
      cover: String!
      duration: String!
  }
`

export const mutationPayload=`
`

export const resolvers = {}
