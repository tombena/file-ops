//main script here
// const rename = require('./lib/rename')
// const append = require('./lib/append')
// const async = require('async')
// const fs = require('fs')

// returns current date in Year-Month-Day_Hour-Minute format
function get_date_formatted() {
	var date = new Date().toISOString().replace(/T/, '_')
	var date_tok = date.split(".")[0].split(":")
	return date_tok[0] + "-" + date_tok[1]
}

var src = './files/original/'
var dest = './files/moved/'

var file_count = 0
var file_remaining = 0
var err_count = 0
var err_files = []
var arr, name, extension

var Promise = require("bluebird");
var fs = Promise.promisifyAll(require("fs"));
var append = Promise.promisifyAll(require("./lib/append"))
var rename = Promise.promisifyAll(require("./lib/rename"))

// / create destination folder if it doesn't exist yet
if (!fs.existsSync(dest)) {
    fs.mkdir(dest, (err) => {
		if (err)
			return console.log(`Unable to create ${dest} directory`);
	})
}
const date = get_date_formatted()



fs.readdirAsync(src)
	.map(function (filename) {
	    var arr = filename.split(".")
		var extension = arr[arr.length - 1]

		//file name without extension
		name = arr[0]

		// if multiple extensions file name is file without last extension
		if (arr.length > 2) {
			for (var i = 1; i < arr.length - 1; i++) {
				name +=  '.' + arr[i]
			}
		}

		const new_name = name + "_EDITED_" + date + "." + extension
		const data = [filename, src.substr(2) + filename, new_name, dest.substr(2) + new_name]
		return append.append_file_infoAsync(src + filename, data, extension)
	})
    .map(function (content) {
    	// returning an array in case of success
    	if (Array.isArray(content)) {
    		return rename.renameAsync(content[0], content[1])
    	} else {
    		return content
    	}
	})
    .then(function (content) {
    	var n_err = 0
    	var err_files = []
    	console.log(content)
    	for(var i = 0; i < content.length; i++){
    		// files starting with "./"
    		if(content[i][0] != ".") {
    			n_err++
    			err_files.push(content[i])
    		}
    	}

    	if (n_err == 0)
    		console.log(`Renamed ${content.length} files, with 0 errors`)
    	else if (n_err == 1)
    		console.log(`Renamed ${content.length} files, with 1 error (${err_files})`)
    	else
    		console.log(`Renamed ${content.length} files, with ${n_err} errors (${err_files})`)
})