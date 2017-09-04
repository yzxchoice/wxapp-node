'use strict';

import UserModel from '../../models/user/user'
import BaseComponent from '../../prototype/baseComponent'
import formidable from 'formidable'
import fetch from 'node-fetch'


class User extends BaseComponent {
    constructor() {
        super();
        this.addUser = this.addUser.bind(this);
        this.getOpenid = this.getOpenid.bind(this);
    }
	
	async getOpenid(req, res, next){
		const form = new formidable.IncomingForm();
        form.parse(req, async (err, fields, files) => {
			
            try {
                if (!fields.jscode) {
                    throw new Error('获取用户信息失败');
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
			let appid = 'wxecbc6499f3fb2ccf'
            let  secret = '159c82fd404d05752a868134a7abb102'
            let  js_code = fields.jscode
            let  grant_type = 'authorization_code'
			const result = await fetch(`https://api.weixin.qq.com/sns/jscode2session?appid=${appid}&secret=${secret}&js_code=${js_code}&grant_type=${grant_type}`)

			const json = await result.json();
			console.log(json.openid);
			res.send({
				status: 1,
				sussess: 'get openid success',
				openid: json.openid
			})
		})
	}

	async getUser(req, res, next){
        const form = new formidable.IncomingForm();
        form.parse(req, async (err, fields, files) => {
            try {
                if (!fields.jscode) {
                    throw new Error('获取用户信息失败');
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
        })
    }

    //添加用户
    async addUser(req, res, next){
        const form = new formidable.IncomingForm();
        form.parse(req, async (err, fields, files) => {
			
            try {
                if (!fields.open_id) {
                    throw new Error('获取用户信息失败');
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
			
			
            let user_id;
            try{
                user_id = await this.getId('user_id');
            }catch(err){
                console.log('user_id');
                res.send({
                    type: 'ERROR_DATA',
                    message: '获取数据失败'
                })
                return
            }
            const newUser = {
                open_id: fields.open_id,
                username: fields.username,
                image_path: fields.image_path,
                id: user_id
            }
            try {
                const hasUser = await UserModel.findOne({open_id:fields.open_id}, '-_id')
                // console.log(`has user: ${hasUser}`);
                if(!hasUser){
                    //保存数据
                    const user = new UserModel(newUser);
                    await user.save();
                    res.send({
                        status: 1,
                        sussess: 'add user success',
                        userDetail: newUser
                    })
                }else{
					res.send({
                        status: 1,
                        sussess: 'user exist',
                        userDetail: hasUser
                    })
				}

            } catch (err) {
                console.log('user write to db failed');
                res.send({
                    status: 0,
                    type: 'ERROR_SERVER',
                    message: 'add user failed',
                })
            }
        })
    }

    //查询用户
    async getUsers(req, res, next){

    }
}

export default new User()