import { GraphQLScalarType } from 'graphql'
import { Kind } from 'graphql/language'
import jwt from 'jsonwebtoken' 

const createToken = ({ id, name }) => jwt.sign({ id, name }, process.env.TOKEN_SECRET, {
  expiresIn: '1d'
});

function user_database_to_graphql(user_database){
    return {
        id: user_database.userId,
        name: user_database.userName,
        bio: user_database.bio,
        avatar: user_database.avatar,
        email: user_database.email
    }
}
function user_database_to_autentication_result(user_database){
    var result, token, user
    console.log(user_database)
    if(user_database){
        result = 'success'
        user = {
            id: user_database.userId,
            name: user_database.userName,
            bio: user_database.bio,
            avatar: user_database.avatar,
            email: user_database.email
        }
        console.log(user)
        token = createToken(user);
    }else{
        result = 'failed'
    }

    return{
        user: user,
        token: token,
        result: result
    }
}

function songList_database_to_graphql(list_database){
    return{
        id: list_database.listId,
        ownerId: list_database.userId,
        name: list_database.listName,
        des: list_database.listDes,
        cover: list_database.listCover,
        createdAt: list_database.createdAt,
        updatedAt: list_database.updatedAt,
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
            const listId = await model.songList.create(data, 'youtube')
            const list = await model.songList.getById(listId)
            return songList_database_to_graphql(list) 
        },

        createUser: async(parent, {data}, {model}) => {
            const exist = await model.user.exist(data)
            if(!exist){
                const user = await model.user.create(data)
                return user_database_to_autentication_result(user)
            }
            return{
                user: null,
                token: null,
                result: 'duplicate'
            }
        },

        updatePlaylist: async(parent, {data}, {model}) => {
            const list = await model.songList.update(data)
            return songList_database_to_graphql(list)
        },

        signIn: async(parent, {data}, {model}) => {
            const user = await model.user.getByName(data.userName)
            if(user && user.password === data.password){
                return user_database_to_autentication_result(user)
            }
            if(user && user.password !== data.password){
                return{
                    user: null, 
                    token: null,
                    result: 'password_fail'
                }
            }
            return{
                user: null,
                token: null,
                result: 'not_exist'
            }
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
    },

    Date: new GraphQLScalarType({
        name: 'Date',
        description: 'custom scalar type Date',
        serialize(value){
            return value.getTime();
        },
        parseValue(value){
            return new Date(value);
        },
        parseLiteral(ast){
            if(ast.kind == Kind.INT){
                return new Date(parseInt(ast.value, 10));
            }
            else if(ast.kind == Kind.STRING){
                return new Date(ast.value);
            }
            return null;
        }
    })
}
