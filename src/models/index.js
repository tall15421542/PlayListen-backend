import connection from './pool'
import songListModel from './songList'
import songModel from './song'
import userModel from './User'
import Search from './search/index'

function model(){
    this.conn = new connection()
    this.song = new songModel(this.conn)
    this.user = new userModel(this.conn)
    this.songList = new songListModel(this.conn, this.song)
    this.search = new Search() 
}

export default model;

