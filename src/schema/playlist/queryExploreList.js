import { songList_database_to_graphql } from '../../models/songList'
import { listByIdLoader } from '../../loader/index'

export const schema = `
  exploreList(num: Int!): [Playlist]
`
export const resolver = {
  Query: {
    exploreList: async(parent, {num}, {model}) => {
      // const result = await model.songList.getExploreList(num);
      const listIds = await model.songList.getExploreListIds(num);
      var ret = await listByIdLoader.loadMany(listIds.map(list => list.listId))
      for(var i = 0 ; i < ret.length ; ++i){
        ret[i] = songList_database_to_graphql(ret[i])
      }
      return ret;
    }
  }
}
