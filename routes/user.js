'use strict';

import express from 'express';
import User from '../controller/user/user'

const router = express.Router();

router.post('/adduser', User.addUser);
router.post('/getopenid', User.getOpenid);

export default router