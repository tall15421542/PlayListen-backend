import { user_database_to_graphql } from '../../models/user'
import { songs_to_graphql } from '../../models/songList'
import { userByIdLoader, songsByListIdLoader } from '../../loader/index'

export const schema = `
  type SavedPlaylist{
    playlist: Playlist!
    savedAt: Date! 
  }
`
export const resolver = {
}
