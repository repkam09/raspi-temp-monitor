var restify = require('restify');
var fs = require('fs');
var request = require('request');

var server = restify.createServer({
    name: 'repkam09.com',
    version: '1.0.0'
});

var prefix = 'repserv';

var timerfunc = null;

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
    clearTimeout(timerfunc); // clear the timer, we got something from the client.

    var response = {};
    response.date = new Date().getTime();
    response.temp = req.params.temp

    // Write the results to a text file
    var fileString = response.date + " | " + response.temp;
    logfileout(fileString, "templogfile.txt");

    // Send the response to the client
    res.send(response);

    // restart the timer to wait until the next checkin
    timerfunc = setTimeout(function () {
        serverTempTimeout();
    }, 180 * 1000);

    return next();
});

// Handles acting as a proxy for GET requests
server.get(prefix + '/corsget/:url', function (req, resMain, next) {
    var geturl = new Buffer(req.params.url, 'base64').toString();
    console.log(req.params.url + " ==> " + geturl);
    request(geturl, function (error, response, body) {
        if (error) {
            resMain.send(500, error);
        }

        var typestring = response.headers["content-type"].split(";")[0];
        switch (typestring) {
            case "image/jpeg":
                console.log("got jpeg image: ", geturl);
                resMain.setHeader('content-type', 'image/jpeg');
                resMain.send(body);
                break;

            case "image/png":
                console.log("got png image: ", geturl);
                resMain.setHeader('content-type', 'image/png');
                resMain.send(body);
                break;

            default:
                resMain.setHeader('content-type', 'text/plain');
                var newbody = new Buffer(body).toString('base64');
                resMain.send(newbody);
        }
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


function serverTempTimeout() {
    console.log("Did not get a response from server in 3 minutes!");
}
