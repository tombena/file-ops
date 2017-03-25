# Getting started with Node.js

The basic task is to asynchronously read files from a directory, append four pieces of information to each file and then to output the results of the script (number renamed, number of errors if any, etc).

1. The original name of the file
2. The original file path
3. The new name of the file
4. The new file path

Original files located in `files/original` are moved into `files/moved`, each file is renamed. The new name of the file is `[original file name]_edited_[year-month-day_hour-second]` with its original extension.

```
// The hour timestamp is in 24 hour notation (14:00 = 2:00pm)
// Rename Example:
	my-text-file.txt -> my-text-file_EDITED_2015-05-31_14-22.txt 

// Old Location:
	files/original/my-text-file.txt

// New Location
	files/moved/my-text-file_EDITED_2015-05-31_14-22.txt

// The result of the script should output something like
	renamed 4 files, with 0 errors
// or
	renamed 3 files, with 1 error (somefile.txt)
```

For text files, append the four pieces of information to the text file on new lines below the original contents of the file. 
For json files, add new properties to the json file with the four pieces of information.
