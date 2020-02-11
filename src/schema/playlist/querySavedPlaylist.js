import { songList_database_to_graphql } from '../../models/songList'
import { listByIdLoader } from '../../loader/index'

export const schema = `
  savedPlaylist(userId: String!): [SavedPlaylist]
`

export const resolver = {
  Query: {
    savedPlaylist: async(parent, {userId}, {model}) => {
      const saveLists = await model.savedPlaylist.getByUserId(userId);
      var playlists = await listByIdLoader.loadMany(saveLists.map(saveList => saveList.listId))
      var ret = []
      for(var i = 0 ; i < playlists.length ; ++i){
        ret.push({playlist: songList_database_to_graphql(playlists[i]), savedAt: saveLists[i].savedAt})
      }
      return ret;
    }
  }
}
