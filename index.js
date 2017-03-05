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

// PROMISE BLOCK *******************************************************************
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
	// .catch(e => {
 //        // console.log(e)// can address the error here and recover from it, from getItemsAsync rejects or returns a falsey value
 //        // throw e // Need to rethrow unless we actually recovered, just like in the synchronous version

 //    })
    .map(function (content) {
		return rename.renameAsync(content[0], content[1])
	})







// need to reduce in the end to know number of files renamed and errors

// fs.readdirAsync(src).map(function (filename) {
//     return fs.readFileAsync(src + "/" + filename, "utf8");
// }).then(function (content) {
//     console.log("so this is what we got: ", content)
// });

// END OF PROMISE BLOCK *******************************************************************

// // list contents of folder

// fs.readdir(src, (err, files) => {
// 	if(err)
// 		return console.log(`Unable to read ${dest} directory`);

// 	files.forEach(file => {
// 		arr = file.split(".");
// 		extension = arr[arr.length - 1]
// 		//file name without extension
// 		name = arr[0]

// 		// if multiple extensions file name is file without last extension
// 		if (arr.length > 2) {
// 			for (var i = 1; i < arr.length - 1; i++) {
// 				name +=  '.' + arr[i]
// 			}
// 		}

// 		if (extension == 'txt' || extension == 'json') {
// 			file_count++;
// 			file_remaining++;

// 			// MAKE THIS FUNCTION ASYNC!!!!
// 			var date = get_date_formatted()
// 			const new_name = name + "_EDITED_" + date + "." + extension
// 			const data = [file, src.substr(2) + file, new_name, dest.substr(2) + new_name]

// 			// append_file_info and rename should happen sequentially
// 			async.series([
// 				function(callback) {
// 			    	append.append_file_info(src + file, data, extension, callback)
// 			  	},
// 			  	function(callback) {
// 			    	rename.rename("./" + data[1], "./" + data[3], callback)
// 				}
// 			], function(err) {
// 				if (err) {
// 					err_count++
// 					err_files.push(file)
// 					console.log(err)
// 				}
// 				file_remaining--

// 				// print output when all files have been treated
// 				if (file_remaining == 0)
// 					if (err_count == 0)
// 						console.log(`Renamed ${file_count} files, with 0 errors`)
// 					else
// 						console.log(`Renamed ${file_count - err_count} files, with ${err_count} error(s) (${err_files})`)
// 			}
// 		}
// 	})
// })