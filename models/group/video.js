'use strict';

import mongoose from 'mongoose'

const videoSchema = new mongoose.Schema({
    description: { type: String, default: "" },
    id: Number,
    name: String,
    video_path: { type: String, default: "" },
    userid: Number,
    groupid: Number,
    createtime: { type: Date, default: Date.now },
    addtime: String,
    user_image_path: { type: String, default: "" },
    username: String
});

videoSchema.index({ id: 1 });

const Video = mongoose.model('Video', videoSchema);

export default Video