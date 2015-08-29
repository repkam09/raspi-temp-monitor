var fs = require('fs');
var https = require('https');
var Cron = require('cron').CronJob;

function getTemp() {
    fs.readFile('/sys/bus/w1/devices/28-00000400a88a/w1_slave', function (err, buffer) {
        if (err) {
            console.error(err);
            process.exit(1);
        }

        // Read data from file (using fast node ASCII encoding).
        var data = buffer.toString('ascii').split(" "); // Split by space

        // Extract temperature from string and divide by 1000 to give celsius
        var temp = parseFloat(data[data.length - 1].split("=")[1]) / 1000.0;

        // Round to one decimal place
        temp = Math.round(temp * 10) / 10;

        // Add date/time to temperature
        var response = {
            unix_time: Date.now(),
            c: temp,
            f: (temp * 9 / 5 + 32)
        };

        // Execute call back with data
        return response;
    });
};



var tempcheck = function () {
    console.log("client.js - tempcheck - start");
    var temp = getTemp();

    console.log(JSON.stringify(temp));

    var options = {
        host: 'https://repkam09.com',
        path: '/repserv/tempmon/' + temp.f
    };

    var req = https.get(options, function (res) {
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
        console.log('Server Error: ' + e.message);
    });

};

var onFinish = function () {
    console.log("client.js - onFinish - start");
};

// Start a new cron task
var task = new Cron('0 */2 * * *', tempcheck, onFinish, true, null, null);