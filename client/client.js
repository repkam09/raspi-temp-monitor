var fs = require('fs');
var Cron = require('cron').CronJob;


var tempcheck = function () {
  console.log("client.js - tempcheck - start");
};

var onFinish = function () {
  console.log("client.js - onFinish - start");
};

// Start a new cron task
// constructor(cronTime, onTick, onComplete, start, timezone, context)
var task = new Cron('* * * * * *', tempcheck , onFinish, true, null);

