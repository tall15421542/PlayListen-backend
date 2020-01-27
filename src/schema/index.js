import { gql } from 'apollo-server-express'

const schema = gql`
scalar Date
type Query{
    searchResult(query: String!): [Song!]
    playlist(listId: String!): Playlist
    user(userId: String!): User
    exploreList(num: Int!): [Playlist]
    search(data: SearchInput!): SearchPayload!
}

type Mutation{
    createPlaylist(data: CreatePlaylistInput!): Playlist!
    createUser(data: CreateUserInput): CreateUserPayload!
    signIn(data: SignInInput): SignInPayload!
    updatePlaylist(data: UpdatePlaylistInput!): Playlist!
    deletePlaylist(data: DeletePlaylistInput!): DeletePlaylistPayload!
    saveList(data: SaveListInput!): SaveListPayload!
    follow(data: FollowInput!): FollowPayload!
}

input SearchInput{
  prefix: String!
  limit: Int!
}

type SearchPayload{
  result: [SearchItem]
}

type SearchItem{
  type: Int!
  playlist: Playlist
  user: User
}

input SaveListInput{
  userId: String!
  listId: String!
}

type SaveListPayload{
  savedList: Playlist
}

input FollowInput{
  followerId: String!
  followingId: String!
}

type FollowPayload{
  following: User!
}
type SignInPayload{
    user: User 
    token: String 
    result: String!
}

type DeletePlaylistPayload{
    listId: ID!
}

type CreateUserPayload{
    user: User 
    token: String 
    result: String!
}

input DeletePlaylistInput{
    listId: ID!
}

input UpdatePlaylistInput{
    oldId: String!
    listInfo: CreatePlaylistInput!
    createdAt: String!
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
    playlists: [Playlist!]
    savedLists: [Playlist]
    followingList: [User]
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
