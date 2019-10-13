function user_database_to_graphql(user_database){
    return{
        id: user_database.userId,
        name: user_database.userName,
        bio: user_database.bio,
        avatar: user_database.avatar,
    }
}

function songList_database_to_graphql(list_database){
    return{
        id: list_database.listId,
        ownerId: list_database.userId,
        name: list_database.listName,
        des: list_database.listDes,
        cover: list_database.listCover,
        createAt: list_database.createAt,
        updateAt: list_database.updateAt,
    }
}

function song_database_to_graphql(song_database){
    return{
        id: song_database.songId,
        listId: song_database.listId,
        sourceId: song_database.sourceId,
        name: song_database.songName,
        cover: song_database.songCover,
        duration: song_database.duration 
    }
}

function songs_to_graphql(songs){
    var ret = []
    const resultNum = songs.length 
    for(var i = 0 ; i < resultNum ; ++i){
        if(!songs[i].listId){
            songs[i].songId = songs[i].listId = -1
        }
        ret.push(song_database_to_graphql(songs[i]))
    }
    return ret 
}

export default{
    Query: {
        user: async(parent, {userId}, {model}) =>{
            const u = await model.user.getById(userId)
            const ret = user_database_to_graphql(u)
            return ret
        },
        playlist: async(parent, {listId}, {model}) =>{
            const list = await model.songList.getById(listId);
            return songList_database_to_graphql(list) 
        },

        searchResult: async(parent, {query}, {model}) => {
            const result = await model.search.youtube.getURLInfoArray(query)
            return songs_to_graphql(result)
        }
    },

    Mutation: {
        createPlaylist: async(parent, {data}, {model}) =>{
            const listId = await model.songList.create(data)
            const list = await model.songList.getById(listId)
            return songList_database_to_graphql(list) 
        },

        createUser: async(parent, {data}, {model}) => {
            const user = await model.user.create(data)
            return user_database_to_graphql(user)
        }
    },

    Playlist: {
        songs: async (playlist, args, { model} ) => {
            const result = await model.song.getMultipleInstance(playlist.id)
            return songs_to_graphql(result)
        },
        owner: async(playlist, args, {model} ) => {
            const result = await model.user.getById(playlist.ownerId)
            return user_database_to_graphql(result)
        }
    }

    
}
