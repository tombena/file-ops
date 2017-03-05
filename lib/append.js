/* append 1.original name of the file
		  2.original file path
		  3. new name of the file
		  4.new file path
at end of file if .txt
in fields if .json */

var Promise = require("bluebird");
var fs = Promise.promisifyAll(require("fs"));

function append_file_info(file, data, extension, callback){
	if (extension == 'txt') {
		var buff = ""
		for (var i = 0; i < data.length; i++) {
			buff += "\n" + data[i]
		}
		buff += "\n"
		fs.appendFile("/a/a/a/", buff, (err) => {
			if (err) // in case of error, return filename
				return callback(null, data[0])
			else	// in case of success return filepath and new filepath
				return callback(null, ["./" + data[1], "./" + data[3]])

		})
	} else if (extension == 'json') {
		fs.readFile(file, (err, content) => {
			if (err) // in case of error, return filename
				return callback(null, data[0])

			// convert file content (string) to JSON
			var m = JSON.parse(content)
			// add fields
			m["old_name"] = data[0]
			m["old_path"] = data[1]
			m["new_name"] = data[2]
			m["new_path"] = data[3]
			// convert JSON back to string
			fs.writeFile(file, JSON.stringify(m), (err) => {
				if (err) // in case of error, return filename
					return callback(null, data[0])
				else 
					return callback(null, ["./" + data[1], "./" + data[3]])
			})
		})
	}
	// succes: null & return value
	// return callback(null, file)
}

module.exports.append_file_info = append_file_info
