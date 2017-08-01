'use strict';

import group from './group'
import user from './user'

export default app => {
	// app.get('/', (req, res, next) => {
	// 	res.redirect('/');
	// });
	app.use('/group', group);
	app.use('/user', user);
	// app.use('/active', active);
}