/*var sys = require('sys'),
   http = require('http'),
   fs = require('fs');

http.createServer(function (req, res) {
  	res.writeHead(200, {'Content-Type': 'text/html'});
  	fs.readdir(".", function(err, files){
		files.forEach(function(fileName){
			res.write(fileName + "<br>")
		})
		res.end()
	})

  //res.end('Hello World\n');

  
}).listen(8124, "127.0.0.1");

sys.puts('Server running at http://127.0.0.1:8124/');*/

var sys = require('sys'),
	fs = require('fs'),
	kiwi = require('kiwi'),
	pwd = __dirname;

kiwi.require('express');

configure(function() {
  set('root', __dirname); // required  for views
  enable('show exceptions');

  require('express/plugins');
  use(Static); // required for public/[images, javascripts]
  use(Logger);
});

get('/*.css', function(file) {
  this.render(file + ".css.sass", { layout: false })
})

get('/', function(){
  this.redirect('/home')
})

get('/home', function(){
	this.render("home.html.haml", {
		layout: false,
		locals: {
			pwd: pwd
		}
	})
})

get('/pwd', function(){
	this.respond(200, JSON.stringify({result: pwd}))
})

get('/ls', function(){
	var self = this
	self.contentType('json')
	
	fs.readdir(pwd, function(err, fileNames){
		var numberChecked = 0;
		var files = []
		
		if(fileNames === undefined) {
			sys.puts("List of filenames for directory " + pwd + " is coming back undefined.")
			self.respond(200, JSON.stringify({result: []}))
		}
		else {
			fileNames.forEach(function(fileName){
				fs.stat(pwd+"/"+fileName, function(err, stat){
				
					if(stat===undefined) {
						sys.puts(pwd+"/"+fileName + " is UNDEFINED :P")
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
})

get('/cd', function(){
	var to = this.param("to")
	
	// absolute url
	if(to[0]==="/") { 
		pwd = to
	}
	// relative url
	else {
		to.split("/").forEach(function(dir){
			switch(dir) {
				case "..": 
					pwd = pwd.slice(0, pwd.lastIndexOf("/"))
					pwd = pwd.indexOf("/") === -1 ? "/" : pwd
					break
				case ".":
					break
				default: 
					pwd += (pwd==="/") ? 
						(dir) : 
						("/" + dir)
			}
		})
	}
	sys.puts(pwd)
	this.respond(200, JSON.stringify({success: true}))
})

get('/open', function(){
	var self = this,
		fileName = this.param("fileName")
	fs.readFile(pwd+"/"+fileName, 'ascii', function (err, data) {
	  if (err) throw err;
	sys.puts(data.constructor)  
	self.respond(200, JSON.stringify({result: data}))
	});
	
})

run()