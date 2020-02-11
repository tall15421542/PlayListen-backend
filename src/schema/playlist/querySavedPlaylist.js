import { songList_database_to_graphql } from '../../models/songList'
import { listByIdLoader } from '../../loader/index'

export const schema = `
  savedPlaylist(userId: String!): [Playlist]
`
export const resolver = {
  Query: {
    savedPlaylist: async(parent, {userId}, {model}) => {
      const listIds = await model.savedPlaylist.getListIdsByUserId(userId);
      console.log(listIds)
      var ret = await listByIdLoader.loadMany(listIds)
      for(var i = 0 ; i < ret.length ; ++i){
        ret[i] = songList_database_to_graphql(ret[i])
      }
      return ret;
    }
  }
}
