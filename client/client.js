var fs = require('fs');
var https = require('https');
var Cron = require('cron').CronJob;

function getTemp() {
    var buffer = fs.readFileSync('/sys/bus/w1/devices/28-000006b4a69b/w1_slave');

	// Read data from file (using fast node ASCII encoding).
        var data = buffer.toString('ascii').split(" "); // Split by space

        // Extract temperature from string and divide by 1000 to give celsius
        var temp = parseFloat(data[data.length - 1].split("=")[1]) / 1000.0;

        // Round to one decimal place
        temp = Math.round(temp * 10) / 10;

        // Execute call back with data
        return (temp * 9/5 + 32);
};



var tempcheck = function () {
    console.log("client.js - tempcheck - start");
    var temp = getTemp();

    console.log("Temp Returned: " + JSON.stringify(temp));

    var urlstring = "https://repkam09.com/repserv/tempmon/" + temp;

    var req = https.get(urlstring, function (res) {
        console.log('STATUS: ' + res.statusCode);

        var bodyChunks = [];
        res.on('data', function (chunk) {
            bodyChunks.push(chunk);
        });

        res.on('end', function () {
            var body = Buffer.concat(bodyChunks);
            console.log('Server Response: ' + body);
        });

    });

    req.on('error', function (e) {
        console.log('Server Error: ' + e.message + JSON.stringify(e));
    });

};

var onFinish = function () {
    console.log("client.js - onFinish - start");
};

// Start a new cron task
// var task = new Cron('0 */2 * * *', tempcheck, onFinish, true, null, null);


tempcheck();
