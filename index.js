//main script here
const rename = require('./lib/rename')

// returns current date in Year-Month-Day_Hour-Minute format
function get_date_formatted() {
	var date = new Date().toISOString().replace(/T/, '_')
	var date_tok = date.split(".")[0].split(":")
	return date_tok[0] + "-" + date_tok[1]
}

// extension should be txt or json
function append_file_info(file, data, extension){
	const fs = require('fs')
	if (extension == 'txt'){
		var buff = ""
		for (var i = 0; i < data.length; i++) {
			buff += "\n" + data[i]
		}
		buff += "\n"
		fs.appendFile(file, buff, (err) => {
			if (err) {
			return console.log(err);
			}
			rename.rename("./" + data[1], "./" + data[3])
		})
	} else {
		fs.readFile(file, (err, content) => {
			if (err) {
			return console.log(err);
			}
			var m = JSON.parse(content)
			m["old_name"] = data[0]
			m["old_path"] = data[1]
			m["new_name"] = data[2]
			m["new_path"] = data[3]
			fs.writeFile(file, JSON.stringify(m), (err) => {
				if (err) {
					return console.log(err);
				}
				rename.rename("./" + data[1], "./" + data[3])
			})
		})
	}
}


var src = './files/original/'
var dest = './files/moved/'

const fs = require('fs')
var arr, name, extension;

// check if folder exists, if not create it
// NEED TO HANDLE ERROR HERE
fs.mkdir(dest, (err) => {
	if (err) {
		return console.log(err);
	}
})

fs.readdir(src, (err, files) => {
	files.forEach(file => {
		console.log(`File = ${file}`)

		arr = file.split(".");
		extension = arr[arr.length - 1]
		//file name without extension
		name = arr[0]

		// pick files and not directories or hidden files

		// if multiple extensions, file name is file without last extension
		if (arr.length > 2) {
			for (var i = 1; i < arr.length - 1; i++) {
				name +=  '.' + arr[i]
			}
		}

		var date = get_date_formatted()

		if (extension == 'txt' || extension == 'json') {
			const new_name = name + "_EDITED_" + date + "." + extension
			const data = [file, src.substr(2) + file, new_name, dest.substr(2) + new_name]
			append_file_info(src + file, data, extension)
		}

		if (err) {
		    return console.log(err);
		}
	})
})