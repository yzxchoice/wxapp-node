'use strict';

import mongoose from 'mongoose'

const groupSchema = new mongoose.Schema({
	description: { type: String, default: "" },
	id: Number,
	name: String,
	image_path: { type: String, default: "" },
	userId: Number,
	member: [{
        open_id: String,
        username: String,
		id: Number,
		image_path: String
	}],
    activelist: [],
    createtime: { type: Date, default: Date.now }
});

groupSchema.index({ id: 1 });

const group = mongoose.model('Group', groupSchema);

export default group