var sys = require('sys'),
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

sys.puts('Server running at http://127.0.0.1:8124/');