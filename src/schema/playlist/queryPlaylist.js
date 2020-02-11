import { songList_database_to_graphql } from '../../models/songList'
import { listByIdLoader } from '../../loader/index'
export const schema = `
  playlist(listId: String!): Playlist
`
export const resolver = {
  Query: {
    playlist: async(parent, {listId}, {model}) =>{
      // const list = await model.songList.getById(listId);
      const list = await listByIdLoader.load(listId)
      return songList_database_to_graphql(list) 
    },
  }
}
