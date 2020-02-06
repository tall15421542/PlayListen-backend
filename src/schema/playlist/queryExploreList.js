import { songList_database_to_graphql } from '../../models/songList'

export const schema = `
  exploreList(num: Int!): [Playlist]
`
export const resolver = {
  Query: {
    exploreList: async(parent, {num}, {model}) => {
      const result = await model.songList.getExploreList(num);
      var ret = []
      for(var i = 0 ; i < result.length ; ++i){
        ret.push(songList_database_to_graphql(result[i]))
      }
      return ret;
    }
  }
}
