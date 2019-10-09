import connection from './connection'

function getSongsInfo(listId){
    const sql = 'SELECT * from Song WHERE listId = ?'
    const insert = 'listId'
    const query = mysql.format(sql, insert);
    songsInfo = connection.getData(query);
    reutrn songsInfo;
}

export default getSongsInfo;
