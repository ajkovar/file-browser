(function($){
	//TODO require hack
	var koala = require("koala")
	
	window.File = function(options) {
		var self = this,
			fileName = options.fileName
			
		self.container = $("<div class='file'/>")
		$("body").append(self.container)
		self.container.hide()
		
		self.closeButton = $("<div><a href='javascript:;'>Close</a></div>").click(function(){
			self.hide()
			options.onClose()
		})
		self.container.append(self.closeButton)
		
		self.body = $("<div class='content' />")
		self.container.append(self.body)
		
		$.getJSON("/open", {
				fileName: fileName
			},
			function(data){
				self.body.html(koala.render(fileName, data.result))
				self.container.show(120)
			}
		)
	};
	File.prototype = {
		hide: function() {
			this.container.hide()
		}
	}
}(jQuery))