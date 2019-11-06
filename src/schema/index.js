import { gql } from 'apollo-server-express'

const schema = gql`
scalar Date
type Query{
    searchResult(query: String!): [Song!]
    playlist(listId: String!): Playlist
    user(userId: String!): User
}

type Mutation{
    createPlaylist(data: CreatePlaylistInput!): Playlist!
    createUser(data: CreateUserInput): CreateUserPayload!
    signIn(data: SignInInput): SignInPayload!
}

type SignInPayload{
    user: User 
    token: String 
    result: String!
}

type CreateUserPayload{
    user: User 
    token: String 
    result: String!
}

input SignInInput{
    userName: String!
    password: String!
}

input CreatePlaylistInput{
    name: String!
    ownerId: String!
    des: String
    cover: String
    songs: [CreateSongInput!]
}

input CreateUserInput{
    userName: String!
    email: String!
    password: String!
}


input CreateSongInput{
    sourceId: String!
    name: String!
    cover: String!
    duration: String!
}

type Playlist{
    id: ID!
    owner: User!
    name: String!
    des: String!
    cover: String!
    createdAt: Date!
    updatedAt: Date!
    songs: [Song!]!
}

type User{
    id: ID!
    name: String!
    email: String!
    bio: String
    avatar: String
    playlist: Playlist!
}

type Song{
    id: ID!
    listId: String!
    sourceId: String!
    name: String!
    cover: String!
    duration: String!
}
`

export default schema
