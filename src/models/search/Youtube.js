import {google} from 'googleapis'

// Construct function
function Youtube(){
    this.api = google.youtube({version: 'v3', auth: process.env.YOUTUBE_AUTH_KEY}) // specify your API key here);
    this.listReg = new RegExp('^https://www.youtube.com/playlist\\?list=(\\w+)')
    this.songReg = new RegExp('^https://www.youtube.com/watch\\?')
}

// Object Method
Youtube.prototype.getPlayListInfo = async function(playlistId) {
    const body = await this.api.playlistItems.list({
        playlistId: playlistId,
        part: 'contentDetails',
        maxResults: 50,
    });
    const songlist = body.data.items;
    let songlistInfo = [];
    songlist.map((song) => {
        songlistInfo.push({
            songName: song.contentDetails.title,
            url: idToUrl(song.contentDetails.videoId),
            cover: getCoverImage(song.contentDetails.videoId),
            duration: song.contentDetails.duration,
        });
    });
    console.log(songlistInfo)
    return songlistInfo;
}

Youtube.prototype.getSingleURLInfo = async function(URL) {
    let videoId = urlToId(URL);
    const body = await this.api.videos.list({
        id: videoId,
        part: 'contentDetails',
    });
    console.log(body.data.items)
    let songInfoArray = [
        {
            songName: body.data.items[0].contentDetails.title,
            url: idToUrl(videoId),
            cover: getCoverImage(videoId),
            duration: body.data.items[0].contentDetails.duration,
        },
    ];
    console.log(songInfoArray)
    return songInfoArray;
}


// a very simple example of searching for youtube videos
Youtube.prototype.getURLInfoArray = async function(URL) {
    var result
    if ((result = URL.match(this.listReg))) {
        console.log('it is a song list');
        const listId = result[1];
        const playlistArray = await this.getPlayListInfo(listId);
        return playlistArray;
    }

    if (this.songReg.test(URL)) {
        console.log('single song url');
        const singleSongInfo = await this.getSingleURLInfo(URL);
        return singleSongInfo;
    }

    console.log('query');
    const res = await this.api.search.list({
        part: 'id,snippet',
        q: URL,
        maxResults: 5,
        type: 'video',
    });

    let songInfoArray = [];
    res.data.items.map((element) => {
        songInfoArray.push({
            songName: element.snippet.title,
            url: idToUrl(element.id.videoId),
            cover: getCoverImage(element.id.videoId),
            duration: "PT0M0S",
        });
    });
    return songInfoArray
}

// Helper func
function urlToId(url) {
    let sp_url = url.split('?v=');
    let em_url = sp_url[sp_url.length - 1];
    let final_url = em_url.split('&')[0];
    return final_url;
}

function getCoverImage(id) {
    let url = 'https://img.youtube.com/vi/' + id + '/sddefault.jpg';
    return url;
}

function idToUrl(ytId){
    return 'https://www.youtube.com/watch?v=' + ytId
}

export default Youtube
