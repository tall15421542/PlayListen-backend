export const schema = `
  saveList(data: SaveListInput!): SaveListPayload!
`
export const inputTypeDef = `
  input SaveListInput{
    userId: String!
    listId: String!
  }
`

export const payloadTypeDef = `
  type SaveListPayload{
    savedList: Playlist
  }
`

export const resolver = {

}
