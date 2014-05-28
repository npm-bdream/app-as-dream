var express = require('express');
var server = express();

//server.use(express.logger());

server.use(function(req, res, next){
    console.log('%s %s', req.method, req.url);
    next();
});

server.use(express.static(__dirname + '/_www'));

server.listen(3000);