var sys = require("sys"),
	fs = require("fs")

var FileBrowser = exports.FileBrowser = function(){
	
}

FileBrowser.prototype = {
		
	eachFile: function(options){
		var directory = options.directory, 
			callback = options.callback
			onFile = options.onFile,
			onDirectory = options.onDirectory
		
		(function eachFileRecursive(){	
			fs.readdir(directory, function(err, fileNames){
				var numberChecked = 0;
				var files = []
		
				if(fileNames === undefined) {
					sys.puts("List of filenames for directory " + pwd + " is coming back undefined.")
					callback([])
				}
				else {
					fileNames.forEach(function(fileName){
						fs.stat(directory+"/"+fileName, function(err, stat){
				
							if(stat===undefined) {
								sys.puts(directory+"/"+fileName + " is UNDEFINED :P")
							}
							files.push({
								name: fileName,
								isDirectory: stat.isDirectory()
							})

							numberChecked++
				
							// all files have been stat'ed, return the result
							if(numberChecked===fileNames.length) {
								self.respond(200, JSON.stringify({result: files}))
							}
						})
					})
				}
			})
		
	}
	
}

