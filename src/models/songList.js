import connection from './connection'

function getById(listId){
    const sql = 'SELECT * from List where id = ?'
    const insert = [listId];a
    const query = mysql.format(sql, insert);
    listInfo = connection.getData(query);
    songsInfo = connection.getSongs(listInfo)
    listInfo.songsInfo = songs
    return listInfo 
}

var songList = {
    getById: getById
}
export default songList
