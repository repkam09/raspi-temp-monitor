var restify = require('restify');
var fs = require('fs');
var http = require('http');

var server = restify.createServer({
    name: 'repkam09.com',
    version: '1.0.0'
});

var prefix = 'repserv';

server.use(restify.acceptParser(server.acceptable));
server.use(restify.queryParser());
server.use(restify.CORS());
server.use(restify.fullResponse());
server.use(restify.bodyParser());

// Handles the configuration values for the tempmon service
server.get(prefix + '/tempmon/config', function (req, res, next) {
  
    // Create a new response object
    var response = {};
    response.reqtime = 6;
    response.emailarray = ['mark@repkam09.com', 'repkam09@gmail.com'];  
  
    // Send the response to the client
    res.send(response);
    return next();
});

// Handles recording the temp value and timestamp for the tempmon service
server.get(prefix + '/tempmon/:temp', function (req, res, next) {
    var response = {};
    response.date = new Date().getTime();
    response.temp = req.params.temp

    // Write the results to a text file
    var fileString = response.date + " | " + response.temp;
    logfileout(fileString, "templogfile.txt");  

    // Send the response to the client
    res.send(response);
    return next();
});

// Handles acting as a proxy for GET requests
server.get(prefix + '/corsget/:url', function (req, res, next) {
    var geturl = atob(req.params.url);
    http.get(geturl, function (res) {
        res.send(res);
    }).on('error', function (e) {
        console.log(req.params.url + " error: " + e.message);
    });
    
    return next();
});


server.get(prefix + '/logging/:log', function (req, res, next) {
    var response = {};
    response.status = '200';
    response.msg = "OK";

    // Write the results to a text file
    logfileout(req.params.log, "loglogfile.txt");  

    // Send the response to the client
    res.send(response);
    return next();
});


// Start the server:
server.listen(16000, function () {
    console.log('%s listening at %s', server.name, server.url);
});


// Helper function to write to a file
function logfileout(message, filename) {
    fs.appendFile(filename, message + '\r\n', function (err) {
        if (err) {
            console.log(err);
        }
    });
}
