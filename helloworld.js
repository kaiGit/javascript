var http = require("http");

var server = http.createServer(function (req, res){
  res.writeHead(200, {'Content-Type':'text/plain'});
  res.end("Hello World, this is Kai's first nodde js app.\n");
});

server.listen(8080);

console.log("your first hello world server is running");
