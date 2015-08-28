var fs = require('fs');
var https = require('https');

var Cron = require('cron').CronJob;
var ADC = require('../adc-pi-gpio');

var config = {
    tolerance: 2,
    interval: 300,
    channels: [0],
    SPICLK: 12,
    SPIMISO: 16,
    SPIMOSI: 18,
    SPICS: 22
};


var adc = new ADC(config);

process.on('SIGTERM', function () {
    adc.close();
});
process.on('SIGINT', function () {
    adc.close();
});

adc.init();

adc.on('ready', function () {
    console.log('Pins ready, listening to channel');
});
adc.on('close', function () {
    console.log('ADC terminated');
    process.exit();
});
adc.on('change', function (data) {
    console.log('Channel ' + data.channel + ' value is now ' + data.value + ' which in proportion is: ' + data.percent);
});



var tempcheck = function () {
    console.log("client.js - tempcheck - start");
    var temp = getTemp();

    var options = {
        host: 'https://repkam09.com',
        path: '/repserv/tempmon/' + temp
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

function getTemp() {
    console.log("client.js - getTemp from gpio");
    return 70; // This is TOTALLY gpio. Really.
}

// Start a new cron task
// constructor(cronTime, onTick, onComplete, start, timezone, context)
var task = new Cron('0 */2 * * *', tempcheck, onFinish, true, null, null);