import connection from './pool'
import songListModel from './songList'
import songModel from './song'
import savedPlaylistModel from './savedPlaylist'
import userModel from './user'
import Search from './search/index'

function model(){
  this.conn = new connection()
  this.search = new Search() 
  this.song = new songModel(this.conn, this.search)
  this.user = new userModel(this.conn)
  this.songList = new songListModel(this.conn, this.song)
  this.savedPlaylist = new savedPlaylistModel(this.conn)
}

export default model;

const modelInstance = new model()
export { modelInstance }

