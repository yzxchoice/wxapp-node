'use strict';

import mongoose from 'mongoose'

const imageSchema = new mongoose.Schema({
    description: { type: String, default: "" },
    id: Number,
    name: String,
    img_path: { type: String, default: "" },
    userid: Number,
    groupid: Number,
    createtime: { type: Date, default: Date.now },
    addtime: String,
    user_image_path: { type: String, default: "" },
    username: String,
    imgtoken: String,
    imgpatharray: [
        { type: String, default: "" }
    ]
});

imageSchema.index({ id: 1 });

const Image = mongoose.model('Image', imageSchema);

export default Image