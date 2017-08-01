'use strict';

import express from 'express';
import Group from '../controller/group/group'

const router = express.Router();

router.post('/addgroup', Group.addGroup);
router.get('/groups', Group.getGroups);
router.get('/getgroupdetail', Group.getGroupDetail);
router.post('/addactive', Group.addActive);
router.get('/getactives', Group.getActives);
router.get('/getactivedetail', Group.getActiveDetail);

router.post('/joingroup', Group.joinGroup);

router.post('/addimage', Group.addImage);
router.post('/addvideo', Group.addVideo);
router.get('/getalbum', Group.getAlbum);
router.get('/getvideos', Group.getVideos);

router.post('/addvideo', Group.addVideo);
router.get('/videos', Group.getVideos);

export default router