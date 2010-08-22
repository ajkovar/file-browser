(function($) {
	var fileCache = {},
		count = 0
	
	$.ajaxSetup({
	  cache: false
	});
	
	$(document).ready(function(){
		var fileBrowser = new FileBrowser(".file-browser")
		socket = new io.Socket('localhost');  
		socket.connect();
		socket.send('some data');
		socket.addEvent('message', function(data){
			var file = JSON.parse(data)

			var directoryWatcher = new DirectoryWatcher()
			if(!directoryWatcher.fileIsBeingWatched(file.path))
				directoryWatcher.watchFile(file.path)
			}

			//directoryWatcher.getDiff({
			//	file: file.path,
			//	onReady: function(oldFile, newFile){

			//	}
			//})
			
			if(file.data) {
				file.id=count++
				fileCache[file.path] = file
				
				var changedFile = $("<div class='change-" + file.id + "'>" + file.path + "</div>").click(function(){
				})
				
				$('.file-changes').append(changedFile)
				
			}
			else {    
				var id = ".change-" + fileCache[file.path].id
				var elem = $(id, $('.file-changes'))  
				var currentFontSize =  parseInt(/\d+/.exec(elem.css("font-size")))
				elem.animate({"font-size":currentFontSize+1}, "slow")
			}
		});
	})
	
	
	// commonjs import hack
	window.exports = {}
	
	window.require = function(){
		return exports
	}
	
	// require('path').extname hack       
	exports.extname = function(fileName) {
		return fileName.slice(fileName.lastIndexOf("."), fileName.length)
	}
		
	 
}(jQuery))
