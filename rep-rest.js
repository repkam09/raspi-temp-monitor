var restify = require('restify');
var fs = require('fs');

var server = restify.createServer({
  name: 'repkam09.com',
  version: '1.0.0'
});

var prefix = 'repserv';
var baseurl = 'https://repkam09.com/';

server.use(restify.acceptParser(server.acceptable));
server.use(restify.queryParser());
server.use(restify.bodyParser());

server.get(prefix + '/tempmon/config', function (req, res, next) {
  
  // Create a new response object
  var response = {};
  response.reqtime = 6;
  response.emailarray = ['mark@repkam09.com', 'repkam09@gmail.com'];  
  
  // Send the response to the client
  res.send(response);
  return next();
});

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

server.listen(8080, function () {
  console.log('%s listening at %s', server.name, server.url);
});


function logfileout(message, filename) {
  fs.appendFile(filename, message + '\r\n', function (err) {
    if (err) {
      console.log(err);
    }
  });
}