'use strict';

import mongoose from 'mongoose'

const idsSchema = new mongoose.Schema({
	group_id: Number,
	user_id: Number,
	video_id: Number,
	image_id: Number,
	active_id: Number,
});

const Ids = mongoose.model('Ids', idsSchema);

Ids.findOne((err, data) => {

	if (!data) {
		const newIds = new Ids({
            group_id: 0,
            user_id: 0,
            video_id: 0,
            image_id: 0,
            active_id: 0
		});
        console.log(`ids:${newIds}`)
		newIds.save();
	}
})
export default Ids