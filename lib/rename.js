//rename module
var fs = require('fs')
/*************************************************************
rename file from source path to destination path
return initial path in case of success and
initial path without prefix "./" in case of failure 
**************************************************************/
function rename(src, dest, callback) {
	fs.rename(src, dest, (err) => {
		if (err)
			return callback(null, src.substr(2))
		else 
			return callback(null, src)
	})
}

module.exports.rename = rename