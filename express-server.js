require.paths.unshift('./lib', './lib/express/lib', './lib/coffee/lib')
require.paths.unshift()

var sys = require('sys'),
	fs = require('fs'),
	pwd = __dirname


require('express')
require('coffee') // coffeescript!

require('express/plugins')


configure(function() {
  set('root', __dirname); // required  for views
  enable('show exceptions');
  use(Static); // required for public/[images, javascripts]
  use(Logger);
});

/*get('/*.css', function(file) {
  this.render(file + ".css.sass", { layout: false })
})*/

get('/styles.css', function(file) {
  this.render("styles.css.sass", { layout: false })
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
	
	var files = []

        fileBrowser = new FileBrowser(pwd)
        fileBrowser.eachFile({
                onFile: function(path){
		    files.push({
			    name: path,
			    isDirectory: false
		    })
		},
		onDirectory: function(path){
		    files.push({
			    name: path,
			    isDirectory: true
		    })
		},
                onFinish: function(){
			self.respond(200, JSON.stringify({result: files}))
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
		fileName = this.param("fileName"),
		path
	
	if(fileName[0]==="/") {
		path = fileName
	}
	else path = pwd+"/"+fileName
	
	fs.readFile(path, 'ascii', function (err, data) {
	  if (err) throw err;
		sys.puts(data.constructor)  
		self.respond(200, JSON.stringify({result: data}))
	});
	
})

var server = run()

var checked = {}

var io = require('./lib/Socket.IO-node/lib/socket.io'),
	sys = require("sys"),
	FileBrowser = require("file-browser").FileBrowser

io.listen(server, {
	
	onClientConnect: function(client){
		sys.puts("watching " + __dirname)
		
		fileBrowser = new FileBrowser(__dirname)
		fileBrowser.eachFile({
			recursive: true,
			onFile: function(path){
				sys.puts("watching " + path)
				fs.watchFile(path, function watcher(curr, prev) {
				  sys.puts(path + " has changed."); /* 
				  client.send('the current mtime is: ' + curr.mtime);
				  client.send('the previous mtime was: ' + prev.mtime);*/
				  	
				  	if(!checked[path]) {
					  	checked[path] = true
					  	
					  	//for some reason if you try to read the file while it is being watched, it throws file not found exception
					  	// so unwatch it temporarily and the rewatch it when finished reading
					  	//fs.unwatchFile(path) 
					  	try {
						  	fs.readFile(path, 'ascii', function (err, data) {
								if (err) {
									sys.puts("read file " + path + " failed for some reason. ")
									// wtf? how the hell does it think this file doesnt exist
									//throw err;
								}
								else {
									client.send(JSON.stringify({path: path, data:data}));
								}
								//fs.watchFile(path, watcher)
							});
							//client.send(JSON.stringify({path: path, data:true}));
						}
						catch(e) {
							sys.puts("read file " + path + " failed for some reason. ")
						}
					}
					else client.send(JSON.stringify({path: path})) 
				  
				});
			},
			onFinish: function(){
				sys.puts("Done scanning directory.")
			}
		})
		
		
	},
	
	onClientDisconnect: function(client){
		//client.broadcast("bye")
		//client.broadcast(json({ announcement: client.sessionId + ' disconnected' }));
	},
	
	onClientMessage: function(message, client){
		//client.broadcast("message")
		//sys.puts(client)
		/*var msg = { message: [client.sessionId, message] };
		buffer.push(msg);
		if (buffer.length > 15) {
			buffer.shift();
		}
		client.broadcast(json(msg));
		*/
	}
	
});
