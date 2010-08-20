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
			
			if(file.data) {
				file.id=count++
				fileCache[file.path] = file
				
				var changedFile = $("<div class='change-" + file.id + "'>" + file.path + "</div>").click(function(){
					$.getJSON("/open", {
							fileName: file.path
						},
						function(data){
							
							
							
							var base = difflib.stringAsLines(file.data);
							var newtxt = difflib.stringAsLines(data.result);
							
							// create a SequenceMatcher instance that diffs the two sets of lines 
							var sm = new difflib.SequenceMatcher(base, newtxt);
							// get the opcodes from the SequenceMatcher instance
							// opcodes is a list of 3-tuples describing what changes should be made to the base text
							//      in order to yield the new text
							var opcodes = sm.get_opcodes();
							var contextSize = null;
							
							// build the diff view and add it to the current DOM
							$(diffview.buildView({ 
								baseTextLines:base,
								newTextLines:newtxt,
								opcodes:opcodes,
								// set the display titles for each resource
								baseTextName:"Base Text",
								newTextName:"New Text",
								contextSize:contextSize,
								viewType: 0
							})).appendTo("body");
							//window.location = url + "#diff";
							
						}
					)
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
