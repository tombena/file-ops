/* append 1.original name of the file
		  2.original file path
		  3. new name of the file
		  4.new file path
at end of file if .txt
in fields if .json */

var Promise = require("bluebird");
var fs = Promise.promisifyAll(require("fs"));

// appendFileInfo = function(file, data, extension) {
// 	if (extension == 'txt') {
// 		var buff = ""
// 		for (var i = 0; i < data.length; i++) {
// 		buff += "\n" + data[i]
// 		}
// 		buff += "\n"

// 		return fs.appendFileAsync("/a/a/a", buff)

// 	} else if (extension == 'json') {
// 		fs.readFileAsync(file)
// 			.then(function(content) {

// 				// NEED ASYNC MTDS FOR PARSE & STRINGIFY?

// 				// convert file content (string) to JSON
// 				var m = JSON.parse(content)
// 				// add fields
// 				m["old_name"] = data[0]
// 				m["old_path"] = data[1]
// 				m["new_name"] = data[2]
// 				m["new_path"] = data[3]
// 				return fs.writeFileAsync(file, JSON.stringify(m))
// 		}).catch(e => {
// 			// console.log(`Error appending ${file}`)
//         // can address the error here and recover from it, from getItemsAsync rejects or returns a falsey value
//         // throw e; // Need to rethrow unless we actually recovered, just like in the synchronous version
//     })
// 	}
// }
// module.exports.appendFileInfo = appendFileInfo


function append_file_info(file, data, extension, callback){
	if (extension == 'txt') {
		var buff = ""
		for (var i = 0; i < data.length; i++) {
			buff += "\n" + data[i]
		}
		buff += "\n"
		fs.appendFile(file, buff, (err) => {
			if (err)
				return callback(err)
			else
				return callback(null, ["./" + data[1], "./" + data[3]])

		})
	} else if (extension == 'json') {
		fs.readFile(file, (err, content) => {
			if (err)
				return callback(new Error(`Unable to read ${file}`))

			// convert file content (string) to JSON
			var m = JSON.parse(content)
			// add fields
			m["old_name"] = data[0]
			m["old_path"] = data[1]
			m["new_name"] = data[2]
			m["new_path"] = data[3]
			// convert JSON back to string
			fs.writeFile(file, JSON.stringify(m), (err) => {
				if (err)
					return callback(err)
				else 
					return callback(null, ["./" + data[1], "./" + data[3]])
			})
		})
	}
	// succes: null & return value
	// return callback(null, file)
}

module.exports.append_file_info = append_file_info
