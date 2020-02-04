import { user_database_to_graphql } from '../models/user'
import { songList_database_to_graphql, songs_to_graphql } from '../models/songList'

export const typedef = `
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
`

export const query = `
    playlist(listId: String!): Playlist
    exploreList(num: Int!): [Playlist]
`

export const mutation = `
    updatePlaylist(data: UpdatePlaylistInput!): Playlist!
    deletePlaylist(data: DeletePlaylistInput!): DeletePlaylistPayload!
    createPlaylist(data: CreatePlaylistInput!): Playlist!
    saveList(data: SaveListInput!): SaveListPayload!
`

export const mutationInput = `
  input UpdatePlaylistInput{
      oldId: String!
      listInfo: CreatePlaylistInput!
      createdAt: String!
  }
  
  input DeletePlaylistInput{
      listId: ID!
  }

  input CreatePlaylistInput{
      name: String!
      ownerId: String!
      des: String
      cover: String
      songs: [CreateSongInput!]
  }

  input SaveListInput{
    userId: String!
    listId: String!
  }
`

export const mutationPayload=`
  type DeletePlaylistPayload{
      listId: ID!
  }

  type SaveListPayload{
    savedList: Playlist
  }
`

export const resolvers = {  
  Playlist: {
        songs: async (playlist, args, { model} ) => {
            if(playlist.songs){
                console.log("I have")
                console.log(playlist.songs)
                return playlist.songs
            }
            const result = await model.song.getMultipleInstance(playlist.id)
            return songs_to_graphql(result)
        },
        owner: async(playlist, args, {model} ) => {
            const result = await model.user.getById(playlist.ownerId)
            return user_database_to_graphql(result)
        }
    },
  Query: {
    playlist: async(parent, {listId}, {model}) =>{
        const list = await model.songList.getById(listId);
        return songList_database_to_graphql(list) 
    },

    exploreList: async(parent, {num}, {model}) => {
        const result = await model.songList.getExploreList(num);
        var ret = []
        for(var i = 0 ; i < result.length ; ++i){
            ret.push(songList_database_to_graphql(result[i]))
        }
        return ret;
    }
  },

  Mutation:{
    createPlaylist: async(parent, {data}, {model}) =>{
        const listId = await model.songList.create(data, 'youtube')
        const list = await model.songList.getById(listId)
        return songList_database_to_graphql(list) 
    },
    updatePlaylist: async(parent, {data}, {model}) => {
        const list = await model.songList.update(data)
        return songList_database_to_graphql(list)
    },

    deletePlaylist: async(parent, {data}, {model}) => {
        model.songList.delete(data.listId)
        return { listId: data.listId }
    }
  }
}
