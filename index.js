//main script here
const rename = require('./lib/rename')
const append = require('./lib/append')
const async = require('async')
const fs = require('fs')

// returns current date in Year-Month-Day_Hour-Minute format
function get_date_formatted() {
	var date = new Date().toISOString().replace(/T/, '_')
	var date_tok = date.split(".")[0].split(":")
	return date_tok[0] + "-" + date_tok[1]
}

var src = './files/original/'
var dest = './files/moved/'

// create destination folder if it doesn't exist yet
if (!fs.existsSync(dest)) {
    fs.mkdir(dest, (err) => {
		if (err)
			return console.log(`Unable to create ${dest} directory`);
	})
}

var file_count = 0;
var file_remaining = 0;
var err_count = 0;
var err_files = []
var arr, name, extension

// list contents of folder
fs.readdir(src, (err, files) => {
	if(err)
		return console.log(`Unable to read ${dest} directory`);

	files.forEach(file => {
		arr = file.split(".");
		extension = arr[arr.length - 1]
		//file name without extension
		name = arr[0]

		// if multiple extensions file name is file without last extension
		if (arr.length > 2) {
			for (var i = 1; i < arr.length - 1; i++) {
				name +=  '.' + arr[i]
			}
		}

		if (extension == 'txt' || extension == 'json') {
			file_count++;
			file_remaining++;

			var date = get_date_formatted()
			const new_name = name + "_EDITED_" + date + "." + extension
			const data = [file, src.substr(2) + file, new_name, dest.substr(2) + new_name]

			// append_file_info and rename should happen sequentially
			async.series([
				function(callback) {
			    	append.append_file_info(src + file, data, extension, callback)
			  	},
			  	function(callback) {
			    	rename.rename("./" + data[1], "./" + data[3], callback)
				}
			], function(err) {
				if (err) {
					err_count++
					err_files.push(file)	
				}
				file_remaining--

				// print output when all files have been treated
				if (file_remaining == 0)
					if (err_count == 0)
						console.log(`Renamed ${file_count} files, with 0 errors`)
					else
						console.log(`Renamed ${file_count - err_count} files, with ${err_count} error(s) (${err_files})`)
			})
		}
	})
})
