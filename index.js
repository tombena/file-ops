//main script here
var Promise = require('bluebird');
var fs = Promise.promisifyAll(require('fs'));
var append = Promise.promisifyAll(require('./lib/append'))
var rename = Promise.promisifyAll(require('./lib/rename'))

// returns current date in Year-Month-Day_Hour-Minute format
function get_date_formatted() {
	const date = new Date().toISOString().replace(/T/, '_')
	const date_tok = date.split('.')[0].split(':')
	return date_tok[0] + '-' + date_tok[1]
}

const src = './files/original/'
const dest = './files/moved/'

// create destination folder if it doesn't exist yet
if (!fs.existsSync(dest)) {
    fs.mkdir(dest, (err) => {
		if (err)
			return console.log(`Unable to create ${dest} directory`);
	})
}

const date = get_date_formatted()

fs.readdirAsync(src)
	.map(function (filename) {
		// decompose filename into name.extension
	    const arr = filename.split('.')
		const extension = arr[arr.length - 1]
		var name = arr[0]

		// if multiple extensions, name is filename without last extension
		if (arr.length > 2) {
			for (var i = 1; i < arr.length - 1; i++) {
				name +=  '.' + arr[i]
			}
		}

		const new_name = name + '_EDITED_' + date + '.' + extension
		const data = [filename, src.substr(2) + filename, new_name, dest.substr(2) + new_name]
		return append.appendFileInfoAsync(src + filename, data, extension)
	})
    .map(function (content) {
    	// if success in appendFileInfo, can rename file
    	if (Array.isArray(content))
    		return rename.renameAsync(content[0], content[1])
    	else // if failure, return filename
    		return content
	})
    .then(function (content) {
    	var n_err = 0
    	var err_files = []
    	
    	// look for errors
    	for(var i = 0; i < content.length; i++){
    		// files not prefixed by "./" signal an error
    		if(content[i].substring(0,2) !== './') {
    			n_err++
    			err_files.push(content[i])
    		}
    	}

    	if (n_err === 0)
    		console.log(`Renamed ${content.length} files, with 0 errors`)
    	else if (n_err === 1)
    		console.log(`Renamed ${content.length} files, with 1 error (${err_files})`)
    	else
    		console.log(`Renamed ${content.length} files, with ${n_err} errors (${err_files})`)
})