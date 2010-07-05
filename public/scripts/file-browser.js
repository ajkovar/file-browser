(function($) {
	
	window.FileBrowser = function(container){
		var self = this;
		self.container = $(container)
	
		self.pwdElem = $("<h2 />")
		self.container.append(self.pwdElem)
	
		self.container.append(
			$("<div />")
				.append("<a href='javascript:;'>Up</a>")
				.click(function(){
					self.cd("..")	
				})
		)
			
		self.contents = $("<ul />")
		self.container.append(self.contents)
			
		self.ls()
		self.pwd()
	}

	FileBrowser.prototype = {
		ls: function(){
			var self = this,
				contents = self.contents
			//TODO temporary.. remove this
			if(self.file)
			self.file.hide()
					
			//clear out previous contents
			contents.empty()
		
			//hide so it can be faded in
			contents.hide()
				
			$.getJSON("/ls", function(data){

				$.each(data.result, function(i, file){
					var li;
					if(file.isDirectory) {
						li = $("<li />").append(
							$("<a href='javascript:;' />").append(file.name).click(function(){
								self.cd(file.name)
							})
						);
					}
					else {
						li = $("<li />").append(
							$("<a href='javascript:;' />").append(file.name).click(function(){
								self.open(file.name)
							})
						);
						//li = $("<li />").append(file.name)
					}
					contents.append(li)
				})

				contents.fadeIn(80);
			})
		},
		cd: function(to){
			var self = this;
			$.getJSON("/cd", {
					to: to				
				},
				function(){
					self.ls()
					self.pwd()
				}
			)
		},
		pwd: function(){
			var self = this;
			$.getJSON("/pwd", function(data){
				self.pwdElem.html(data.result)
			})
		},
		open: function(fileName){
			var self = this
			self.hide()
			new File({
				fileName: fileName,
				onClose: function(){
					self.show()
				}
			})
		},
		show: function(){
			var self = this
			self.container.fadeIn()		
		},
		hide: function(){
			this.container.hide()
		}
	}
}(jQuery))