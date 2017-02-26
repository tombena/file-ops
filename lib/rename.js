//rename module
function rename(src, dest, callback) {
	const fs = require('fs')
	fs.rename(src, dest, (err) => {
		if (err)
			return callback(true);
	})
	callback(null, 'rename');
}

module.exports.rename = rename