(function($) {
	$.ajaxSetup({
	  cache: false
	});
	
	$(document).ready(function(){
		var fileBrowser = new FileBrowser(".file-browser")	
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