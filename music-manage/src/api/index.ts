import {deletes, get, getBaseURL, post} from './request'

const HttpManager = {

    attachImageUrl: (url) => `${getBaseURL()}/${url}`,
 

    getLoginStatus: ({username, password}) => post(`admin/login/status`, {username, password}),


    getAllUser: () => get(`user`),

    getUserOfId: (id) => get(`user/detail?id=${id}`),

    deleteUser: (id) => get(`user/delete?id=${id}`),

    getCollectionOfUser: (userId) => get(`collection/detail?userId=${userId}`),

    deleteCollection: (userId, songId) => deletes(`collection/delete?userId=${userId}&&songId=${songId}`),

    getCommentOfSongId: (songId) => get(`comment/song/detail?songId=${songId}`),

    getCommentOfSongListId: (songListId) => get(`comment/songList/detail?songListId=${songListId}`),

    deleteComment: (id) => get(`comment/delete?id=${id}`),

  
    getAllSinger: () => get(`singer`),

    setSinger: ({name, sex, birth, location, introduction}) => post(`singer/add`, {
        name,
        sex,
        birth,
        location,
        introduction
    }),

    updateSingerMsg: ({id, name, sex, birth, location, introduction}) => post(`singer/update`, {
        id,
        name,
        sex,
        birth,
        location,
        introduction
    }),

    deleteSinger: (id) => deletes(`singer/delete?id=${id}`),


    getAllSong: () => get(`song`),

    getSongOfSingerId: (id) => get(`song/singer/detail?singerId=${id}`),

    getSongOfId: (id) => get(`song/detail?id=${id}`),

    getSongOfSingerName: (id) => get(`song/singerName/detail?name=${id}`),

    updateSongMsg: ({id, singerId, name, introduction, lyric}) => post(`song/update`, {
        id,
        singerId,
        name,
        introduction,
        lyric
    }),
    updateSongUrl: (id) => `${getBaseURL()}/song/url/update?id=${id}`,
    updateSongImg: (id) => `${getBaseURL()}/song/img/update?id=${id}`,
    updateSongLrc: (id) => `${getBaseURL()}/song/lrc/update?id=${id}`,

    deleteSong: (id) => deletes(`song/delete?id=${id}`),


    setSongList: ({title, introduction, style}) => post(`songList/add`, {title, introduction, style}),

    getSongList: () => get(`songList`),

    updateSongListMsg: ({id, title, introduction, style}) => post(`songList/update`, {id, title, introduction, style}),

    deleteSongList: (id) => get(`songList/delete?id=${id}`),


    setListSong: ({songId,songListId}) => post(`listSong/add`, {songId,songListId}),

    getListSongOfSongId: (songListId) => get(`listSong/detail?songListId=${songListId}`),

    deleteListSong: (songId) => get(`listSong/delete?songId=${songId}`)

}

export {HttpManager}
