
DirectoryWatcher = function(){
	this.fileWatchers = []
}
DirectoryWatcher.prototype = {

	fileIsBeingWatched: function(path){
		return !!fileWatchers[path] 
	},
	watchFile: function(path){
		if(!this.fileIsBeingWatched())
		fileWatchers[path] =  new DiffWatcher(path)
	}
	getDiff: function(options){
		var path = options.path;

			$.getJSON("/open", {
					fileName: path
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
	}
}
