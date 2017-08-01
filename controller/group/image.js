'use strict';

import ImageModel from '../../models/image/image'

class Image {
    constructor() {

    }

    //添加图片
    async addImage(req, res, next){
        const newImage = {
            user_id: 'wx001',
            username: 'michael',
            img_path: '/img/1.jpg',
            groupId: 1,
            description: 'description'
        }
        try{
            //保存数据
            const image = new ImageModel(newImage);
            await image.save();
            res.send({
                status: 1,
                sussess: 'add image success',
                userDetail: newImage
            })
        }catch(err){
            console.log('image write to db failed');
            res.send({
                status: 0,
                type: 'ERROR_SERVER',
                message: 'add image failed',
            })
        }
    }

    //查询图片
    async getImages(req, res, next){

    }
}