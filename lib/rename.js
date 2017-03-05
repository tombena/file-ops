//rename module
function rename(src, dest, callback) {
	console.log("In rename")
	const fs = require('fs')
	fs.rename(src, dest, (err) => {
		if (err)
			return callback(new Error(`Unable to rename ${src}`))
		else 
			return callback(null, src)
	})
}

module.exports.rename = rename