'use strict';

import VideoModel from '../../models/video/video'

class Video {
    constructor() {

    }

    //添加视频
    async addVideo(req, res, next){
        const newVideo = {
            user_id: 'wx001',
            username: 'michael',
            video_path: '/img/1.jpg',
            groupId: 1,
            description: 'description'
        }
        try{
            //保存数据
            const video = new VideoModel(newVideo);
            await video.save();
            res.send({
                status: 1,
                sussess: 'add video success',
                userDetail: newVideo
            })
        }catch(err){
            console.log('video write to db failed');
            res.send({
                status: 0,
                type: 'ERROR_SERVER',
                message: 'add video failed',
            })
        }
    }

    //查询用户
    async getVideos(req, res, next){

    }
}