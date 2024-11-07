// @ts-check

var fs = require('fs');
var https = require('https');

function getTemp() {
    // The device does not alwasy respond so retry 5 times.
    let counter = 5;
    do {
        //             Change this ID to your Specific ID:xx-xxxxxxxxxxxx
        var buffer = fs.readFileSync('/sys/bus/w1/devices/28-000006b4a69b/w1_slave');

        // Read data from file (using fast node ASCII encoding).
        var data = buffer.toString('ascii').split(" "); // Split by space

        // Extract temperature from string and divide by 1000 to give celsius
        var temp = parseFloat(data[data.length - 1].split("=")[1]) / 1000.0;

        // Execute call back with data
        temp = ((temp * 9 / 5) + 32);
        temp = Math.round(temp * 10) / 10;

        console.log("getTemp: " + temp);
        counter--;
    } while (isNaN(temp) & (counter > 0));
    return temp;
};

function tempcheck() {
    var temp = null;
    var attempts = 0;

    while (attempts < 5 && temp === null) {
        temp = getTemp();

        // We're probably sometimes getting NaN here
        // which stringify will show as `null`
        if (JSON.stringify(temp) !== null) {
            console.log("Temp Returned: " + JSON.stringify(temp));
            break;
        }
        console.log("Failed to get temperature, retrying...", attempts);
        attempts++;
    }

    if (temp === null) {
        throw new Error('Failed to get temperature after 5 attempts.');
    }

    var postdata = JSON.stringify({
        // Change the client ID to something unique to you
        clientid: "repkam09",
        temp: temp
    });

    var options = {
        hostname: 'api.repkam09.com',
        port: 443,
        path: '/api/temp/checkin',
        method: 'POST',
        headers: {
            'Content-Type': "application/json",
            'Content-Length': Buffer.byteLength(postdata)
        }
    };


    var req = https.request(options, function (res) {
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

    req.write(postdata);
    req.end();

};

// Start a new cron task
console.log("Starting tempcheck...");
tempcheck();
