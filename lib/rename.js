//rename module
function rename(src, dest){
	const fs = require('fs')
	fs.rename(src, dest, (err) => {
		if (err) {
			return console.log(err);
		}
	})
}

module.exports.rename = rename