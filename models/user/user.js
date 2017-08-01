'use strict';

import mongoose from 'mongoose'

const Schema = mongoose.Schema;

const userSchema = new Schema({
    id: Number,
    open_id: String,
    username: String,
    groundId: Number,
    image_path: String,
	groups: [{
		name: String,
		id: Number,
		description: String
	}]
})

userSchema.index({ id: 1 });

const User = mongoose.model('User', userSchema);

export default User