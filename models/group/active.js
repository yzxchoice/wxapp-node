'use strict';

import mongoose from 'mongoose'

const activeSchema = new mongoose.Schema({
    id: Number,
    title: String,
    imagepath: { type: String, default: "" },
    time: String,
    address: String,
    description: { type: String, default: "" },
    userid: Number,
    groupid: Number,
    createtime: { type: Date, default: Date.now },
    addtime: String,
    user_image_path: { type: String, default: "" },
    username: String
});

activeSchema.index({ id: 1 });

const active = mongoose.model('Active', activeSchema);

export default active