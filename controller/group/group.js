'use strict';

import GroupModel from '../../models/group/group'
import ImageModel from '../../models/group/image'
import VideoModel from '../../models/group/video'
import UserModel from '../../models/user/user'
import ActiveModel from '../../models/group/active'
import BaseComponent from '../../prototype/baseComponent'
import formidable from 'formidable'
import dtime from 'time-formater'
import * as _ from 'lodash'


class Group extends BaseComponent {
	constructor(){
        super();
		this.addGroup = this.addGroup.bind(this);
		this.getGroups = this.getGroups.bind(this);
		this.getGroupDetail = this.getGroupDetail.bind(this);
		this.addActive = this.addActive.bind(this);
		this.getActives = this.getActives.bind(this);
		this.addImage = this.addImage.bind(this);
		this.addVideo = this.addVideo.bind(this);
		this.getActiveDetail = this.getActiveDetail.bind(this);
	}

	//加入群组  参数 user_id groupid
	async joinGroup(req, res, next){
        const form = new formidable.IncomingForm();
        form.parse(req, async (err, fields, files) => {
            try {
                if (!fields.groupid) {
                    throw new Error('必须进入群组才能加入');
                }
                if (!fields.openid) {
                    throw new Error('必须输入用户ID');
                }
            } catch (err) {
                console.log('前台参数出错', err.message);
                res.send({
                    status: 0,
                    type: 'ERROR_PARAMS',
                    message: err.message
                })
                return
            }
            const user = await UserModel.findOne({open_id: fields.openid})
            //console.log(`user: ${user}`);
            const group = await GroupModel.findOne({id: fields.groupid})
            //console.log(`group: ${group}`);
			console.log(`group: ${group.member}`);
            const hasUser = group.member.find(u => u.open_id === fields.openid);
            console.log(`has user: ${hasUser}`);

            try{
                //更新数据
                if(!hasUser){
					user.groups.push(group)
                    group.member.push(user)
                    await group.save();
					await user.save();
                }
                res.send({
                    status: 1,
                    sussess: 'update group success',
                    groupDetail: group
                })
            }catch(err){
                console.log('group write to db failed');
                res.send({
                    status: 0,
                    type: 'ERROR_SERVER',
                    message: 'update group failed',
                })
            }
        })
    }

	//添加群组
	async addGroup(req, res, next){
        const form = new formidable.IncomingForm();
        form.parse(req, async (err, fields, files) => {
            try {
                if (!fields.name) {
                    throw new Error('必须输入群组名称');
                }
                if (!fields.openid) {
                    throw new Error('必须输入用户ID');
                }
            } catch (err) {
                console.log('前台参数出错', err.message);
                res.send({
                    status: 0,
                    type: 'ERROR_PARAMS',
                    message: err.message
                })
                return
            }

            const hasGroup = await GroupModel.findOne({name:fields.name})
            if(hasGroup) {
                res.send({
                    status: 0,
                    type: 'ERROR_PARAMS',
                    message: 'group has exist.'
                })
                return
            }

            const user = await UserModel.findOne({open_id: fields.openid})
            console.log(`user: ${user}`);
			

            let group_id;
            try{
                group_id = await this.getId('group_id');
            }catch(err){
                console.log('group_id');
                res.send({
                    type: 'ERROR_DATA',
                    message: '获取数据失败'
                })
                return
            }

            const newGroup = {
            	name: fields.name,
                description: fields.description || '',
                image_path: fields.imgPath || ' ',
                userId: user.id,
                member: [user],
                id: group_id,
                createtime: new Date().getTime()
            }
            console.log(`newGroup:${user}`);
            try{
                //保存数据
                const group = new GroupModel(newGroup);
                await group.save();
				user.groups.push(group);
				await user.save();
                res.send({
                    status: 1,
                    sussess: 'add group success',
                    groupDetail: newGroup
                })
            }catch(err){
                console.log('group write to db failed');
                res.send({
                    status: 0,
                    type: 'ERROR_SERVER',
                    message: 'add group failed',
                })
            }

        })

	}

	async addActive(req, res, next){
        const form = new formidable.IncomingForm();
        form.parse(req, async (err, fields, files) => {
            try {
                if (!fields.title) {
                    throw new Error('必须输入活动名称');
                }
                // if (!fields.imagepath) {
                //     throw new Error('必须输入活动图片');
                // }
                if (!fields.time) {
                    throw new Error('必须输入时间');
                }
                if (!fields.address) {
                    throw new Error('必须输入地址');
                }
                if (!fields.description) {
                    throw new Error('必须输入内容');
                }
                if (!fields.openid) {
                    throw new Error('必须输入用户ID');
                }
                if (!fields.groupid) {
                    throw new Error('必须输入群组ID');
                }
            } catch (err) {
                console.log('前台参数出错', err.message);
                res.send({
                    status: 0,
                    type: 'ERROR_PARAMS',
                    message: err.message
                })
                return
            }

            const user = await UserModel.findOne({open_id: fields.openid})
            console.log(`user: ${user}`);

            let active_id;
            try{
                active_id = await this.getId('active_id');
            }catch(err){
                console.log('active_id');
                res.send({
                    type: 'ERROR_DATA',
                    message: '获取数据失败'
                })
                return
            }

            const newActive = {
                title: fields.title,
                description: fields.description || '',
                time: fields.time,
                address: fields.address,
                imagepath: fields.imagepath || ' ',
                userid: user.id,
                groupid: fields.groupid,
                id: active_id,
                createtime: new Date().getTime(),
                addtime: dtime().format('YYYY-MM-DD HH:mm')
            }
            console.log(`newActive:${newActive}`);
            try{
                //保存数据
                const active = new ActiveModel(newActive);
                await active.save();
                res.send({
                    status: 1,
                    sussess: 'add active success',
                    activeDetail: newActive
                })
            }catch(err){
                console.log('active write to db failed');
                res.send({
                    status: 0,
                    type: 'ERROR_SERVER',
                    message: 'add active failed',
                })
            }
        })
    }

	//查询群组
	async getGroups(req, res, next){
	    console.log(`request:${req.query.openid}`);
	    let openid = req.query.openid;
	    try{
            if(!openid){
                throw new Error('必须输入用户ID');
            }
        } catch (err) {
            console.log('前台参数出错', err.message);
            res.send({
                status: 0,
                type: 'ERROR_PARAMS',
                message: err.message
            })
            return
        }

        const user = await UserModel.findOne({open_id: openid})
        console.log(`user: ${user}`);
		const idArray = [];
		user.groups.forEach(function(item){
			idArray.push(item.id)
		})

        const groups = await GroupModel.find({id: {$in:idArray}}, '-_id')
        try {
            res.send(groups)
        } catch (err) {
            res.send({
                status: 0,
                type: 'ERROR_GET_GROUP_LIST',
                message: 'get groups error'
            })
        }

	}

	async getActives(req, res, next){
        console.log(`request:${req.query.groupid}`);
        let groupid = req.query.groupid;
        try{
            if(!groupid){
                throw new Error('必须有群组ID');
            }
        } catch (err) {
            console.log('前台参数出错', err.message);
            res.send({
                status: 0,
                type: 'ERROR_PARAMS',
                message: err.message
            })
            return
        }

        const groupDetail = await GroupModel.findOne({id: groupid}, '-_id')

        const activelist = await ActiveModel.find({groupid: groupid}, '-_id')

        activelist.map((item, index) => {
            const u = groupDetail.member.find(u => u.id === item.userid);
            return Object.assign(item, {user_image_path: u.image_path, username: u.username});
        })
		
		const temp1 = _.sortBy(activelist, function(item){
            return -item.createtime;
        })

        try {
            res.send(temp1)
        } catch (err) {
            res.send({
                status: 0,
                type: 'ERROR_GET_GROUP_DETAIL',
                message: 'get group detail error'
            })
        }
    }

    async getActiveDetail(req, res, next){
        console.log(`request:${req.query.activeid}`);
        let activeid = req.query.activeid;
        try{
            if(!activeid){
                throw new Error('必须有ID');
            }
        } catch (err) {
            console.log('前台参数出错', err.message);
            res.send({
                status: 0,
                type: 'ERROR_PARAMS',
                message: err.message
            })
            return
        }

        const active = await ActiveModel.findOne({id: activeid}, '-_id')

        const user = await UserModel.findOne({id: active.userid})

        Object.assign(active, {username: user.username})

        try {
            res.send(active)
        } catch (err) {
            res.send({
                status: 0,
                type: 'ERROR_GET_ACTIVE_DETAIL',
                message: 'get active detail error'
            })
        }
    }
	
	//群组详情
	async getGroupDetail(req, res, next){
        console.log(`request:${req.query.groupid}`);
        let groupid = req.query.groupid;
		let pageindex = req.query.pageindex || 0;
		let pagenum = req.query.pagenum || 10;
        try{
            if(!groupid){
                throw new Error('必须有群组ID');
            }
        } catch (err) {
            console.log('前台参数出错', err.message);
            res.send({
                status: 0,
                type: 'ERROR_PARAMS',
                message: err.message
            })
            return
        }
        const groupDetail = await GroupModel.findOne({id: groupid}, '-_id')

        const activelist = await ActiveModel.find({groupid: groupid}, '-_id')
        const imagelist = await ImageModel.find({groupid: groupid}, '-_id')
        const videolist = await VideoModel.find({groupid: groupid}, '-_id')


        const temp = [...activelist, ...imagelist, ...videolist]

        temp.map((item, index) => {
            const u = groupDetail.member.find(u => u.id === item.userid);
            return Object.assign(item, {user_image_path: u.image_path, username: u.username});
        })

        const temp1 = _.sortBy(temp, function(item){
            return -item.createtime;
        })
        console.log(pageindex*pagenum);
        console.log((parseInt(pageindex)+1)*pagenum);

        const temp2 = temp1.slice(pageindex*pagenum, (parseInt(pageindex)+1)*pagenum);

        console.log(`集合:${temp2}`)

        groupDetail.activelist = temp2;
        // console.log(groupDetail);
        try {
            res.send(groupDetail)
        } catch (err) {
            res.send({
                status: 0,
                type: 'ERROR_GET_GROUP_DETAIL',
                message: 'get group detail error'
            })
        }
	}

	async getAlbum(req, res, next){
        let groupid = req.query.groupid;
        let pageindex = req.query.pageindex || 0;
        let pagenum = req.query.pagenum || 10;
        try{
            if(!groupid){
                throw new Error('必须有群组ID');
            }
        } catch (err) {
            console.log('前台参数出错', err.message);
            res.send({
                status: 0,
                type: 'ERROR_PARAMS',
                message: err.message
            })
            return
        }
        const groupDetail = await GroupModel.findOne({id: groupid}, '-_id')


        const images = await ImageModel.find({groupid: groupid}, '-_id')

        images.map((item, index) => {
            const u = groupDetail.member.find(u => u.id === item.userid);
            return Object.assign(item, {user_image_path: u.image_path, username: u.username});
        })
		
		const temp1 = _.sortBy(images, function(item){
            return -item.createtime;
        })

        const temp2 = temp1.slice(pageindex*pagenum, (parseInt(pageindex)+1)*pagenum);


        try{
            res.send(temp2)
        }catch(err){
            res.send({
                status: 0,
                type: 'ERROR_GET_IMAGE_LIST',
                message: 'get images error'
            })
        }
    }

    async addImage(req, res, next){
        const form = new formidable.IncomingForm();
        // form.uploadDir = "E:\\michael\\wxapp-node\\wxapp-node\\public\\pic";
        form.uploadDir = "/wxapp/public/pic";
        form.keepExtensions = true;
        form.parse(req, async (err, fields, files) => {
            // let l = files.file.path.lastIndexOf('/')
            console.log(`files:${files}`)
            let l = files.file.path.lastIndexOf('\\')
            let filename = files.file.path.substring(l+1)
            try {
                if (!files) {
                    throw new Error('必须选择图片');
                }
            } catch (err) {
                console.log('前台参数出错', err.message);
                res.send({
                    status: 0,
                    type: 'ERROR_PARAMS',
                    message: err.message
                })
                return
            }
            const user = await UserModel.findOne({open_id: fields.openid})
            console.log(`user: ${user}`);
            let image_id;
            try{
                image_id = await this.getId('image_id');
            }catch(err){
                console.log('image_id');
                res.send({
                    type: 'ERROR_DATA',
                    message: '获取数据失败'
                })
                return
            }
            ///已经存在第一张图片
            const imageExist = await ImageModel.findOne({imgtoken: fields.imgtoken})
            if(imageExist){
                try{
                    imageExist.imgpatharray.push(filename)
                    await imageExist.save();
                    res.send({
                        status: 1,
                        sussess: 'add image success',
                        imageDetail: imageExist
                    })
                } catch (err){
                    console.log('image write to db failed');
                    res.send({
                        status: 0,
                        type: 'ERROR_SERVER',
                        message: 'add image failed',
                    })
                }

            }else {
                const newImage = {
                    userid: user.id,
                    img_path: filename,
                    name: fields.name || '',
                    groupid: fields.groupid,
                    description: fields.description || '',
                    id: image_id,
                    createtime: new Date().getTime(),
                    addtime: dtime().format('YYYY-MM-DD HH:mm'),
                    imgpatharray: [filename],
                    imgtoken: fields.imgtoken
                }
                console.log(newImage);
                try {
                    //保存数据
                    const image = new ImageModel(newImage);
                    await image.save();
                    res.send({
                        status: 1,
                        sussess: 'add image success',
                        imageDetail: newImage
                    })

                } catch (err) {
                    console.log('image write to db failed');
                    res.send({
                        status: 0,
                        type: 'ERROR_SERVER',
                        message: 'add image failed',
                    })
                }
            }

        })
    }

    async getVideos(req, res, next){
        let groupid = req.query.groupid;
        let pageindex = req.query.pageindex || 0;
        let pagenum = req.query.pagenum || 10;
        try{
            if(!groupid){
                throw new Error('必须有群组ID');
            }
        } catch (err) {
            console.log('前台参数出错', err.message);
            res.send({
                status: 0,
                type: 'ERROR_PARAMS',
                message: err.message
            })
            return
        }
        const groupDetail = await GroupModel.findOne({id: groupid}, '-_id')


        const videos = await VideoModel.find({groupid: groupid}, '-_id')

        videos.map((item, index) => {
            const u = groupDetail.member.find(u => u.id === item.userid);
            return Object.assign(item, {user_image_path: u.image_path, username: u.username});
        })
		
		const temp1 = _.sortBy(videos, function(item){
            return -item.createtime;
        })

        const temp2 = temp1.slice(pageindex*pagenum, (parseInt(pageindex)+1)*pagenum);

        try{
            res.send(temp2)
        }catch(err){
            res.send({
                status: 0,
                type: 'ERROR_GET_VIDEO_LIST',
                message: 'get videos error'
            })
        }
    }

    async addVideo(req, res, next){
        const form = new formidable.IncomingForm();
        // form.uploadDir = "E:\\michael\\wxapp-node\\wxapp-node\\public\\videos";
        form.uploadDir = "/wxapp/public/videos";
        form.keepExtensions = true;
        form.parse(req, async (err, fields, files) => {
            // let l = files.file.path.lastIndexOf('/')
            let l = files.file.path.lastIndexOf('\\')
            let filename = files.file.path.substring(l+1)
            try {
                if (!files) {
                    throw new Error('必须选择视频');
                }
            } catch (err) {
                console.log('前台参数出错', err.message);
                res.send({
                    status: 0,
                    type: 'ERROR_PARAMS',
                    message: err.message
                })
                return
            }
            const user = await UserModel.findOne({open_id: fields.openid})
            console.log(`user: ${user}`);
            let video_id;
            try{
                video_id = await this.getId('video_id');
            }catch(err){
                console.log('video_id');
                res.send({
                    type: 'ERROR_DATA',
                    message: '获取数据失败'
                })
                return
            }
            const newVideo = {
                userid: user.id,
                video_path: filename,
                groupid: fields.groupid,
                description: fields.description || '',
                name: fields.name || '',
                id: video_id,
                createtime: new Date().getTime(),
                addtime: dtime().format('YYYY-MM-DD HH:mm')
            }
            try {
                //保存数据
                const video = new VideoModel(newVideo);
                await video.save();
                res.send({
                    status: 1,
                    sussess: 'add video success',
                    userDetail: newVideo
                })
            } catch (err) {
                console.log('video write to db failed');
                res.send({
                    status: 0,
                    type: 'ERROR_SERVER',
                    message: 'add video failed',
                })
            }
        })
    }

}

export default new Group()