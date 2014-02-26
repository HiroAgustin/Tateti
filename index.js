var http = require('http')
,   path = require('path')
,   fs = require('fs');
 
http.createServer(function requestHandler(req, res)
{
    var fileName = path.basename(req.url) || 'index.html';

    fs.readFile(__dirname + '/' + fileName, function (err, contents)
    {
        res.end(contents);
    });

}).listen(8080);