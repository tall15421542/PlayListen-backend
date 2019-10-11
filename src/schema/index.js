import { gql } from 'apollo-server-express'

const schema = gql`
type Query{
    searchResult(query: String!): [Song!]
    playlist(listId: String!): PlayList
    user(userId: String!): User
}

type Mutation{
    createPlayList(data: CreatePlayListInput!): PlayList!
    createUser(data: CreateUserInput): User!
}

input CreatePlayListInput{
    name: String!
    ownerId: String!
    des: String!
    cover: String!
    songs: [CreateSongInput!]
}

input CreateUserInput{
    userId: String!
    userName: String!
    avatar: String!
    password: String!
    bio: String!
}

input CreateSongInput{
    url: String!
    name: String!
    cover: String!
    duration: String!
}

type PlayList{
    id: ID!
    owner: User!
    name: String!
    des: String!
    cover: String!
    createAt: String!
    updateAt: String!
    songs: [Song!]!
}

type User{
    id: ID!
    name: String!
    bio: String!
    avatar: String!
}

type Song{
    id: ID!
    listId: String!
    url: String!
    name: String!
    cover: String!
    duration: String!
}
`

export default schema
