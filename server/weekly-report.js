var restify = require('restify');
var fs = require('fs');
var nodemailer = require('nodemailer');

// Read in the settings from config file. This hides the username/password/email list from github.
// This must be put in a file called config.json.
// emailuser, emailpass, emailstring values included.

var settings = JSON.parse(fs.readFileSync('config.json', 'utf8'));

if (settings.emailuser) {
    console.log("Starting as " + settings.emailuser);
}

// Get the list of who to email.
var emaillist = settings.emailstring;

console.log("Email list is " + emaillist);

// create reusable transporter object using SMTP transport
var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: settings.emailuser,
        pass: settings.emailpass
    }
});

var logfilelocation = '/home/mark/website/tools/raspi-temp-monitor/templogfile.txt';

function getLastCheckinTime() {
    var filedata = fs.readFileSync(logfilelocation, 'utf-8');
    var lines = filedata.trim().split('\n');

    var lastline = lines.slice(-1);
    var fields = lastline[0].split('|');
    var date = (Number(fields[0].trim()));
    var dat = new Date(date);
    return dat;
}

function getTempForLastDays(nbrDays) {
    var filedata = fs.readFileSync(logfilelocation, 'utf-8');
    var lines = filedata.trim().split('\n');
    var hoursneeded = (nbrDays * 24) * 2;

    if (hoursneeded > lines.length) {
        console.log("Warn: Log does not go back that far. Using ALL values. Needed " + hoursneeded + " but only have " + lines.length + " in log");
    }

    var lastLines = lines.slice(hoursneeded * -1);

    var finaltemp = 0;

    lastLines.forEach(function (line) {
        var fields = line.split('|');
        var temp = Number(fields[1].trim());
        finaltemp = (finaltemp + temp);
    });

    var avgtemp = (finaltemp / hoursneeded);

    // Round the answer to two decimal places
    return avgtemp.toFixed(2);
}


function sendMailMessage(options) {
    transporter.sendMail(options, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Message sent: ' + info.response);
        }
    });
}

function printemail(config) {
    console.log("--------------------------");
    console.log("From: " + config.from);
    console.log("To: " + config.to);
    console.log("Subject: " + config.subject);
    console.log("Message: " + config.text);
    console.log("--------------------------");
}

// Start the process of sending the mail message
var currentTime = new Date();

// Build the text of the message to send out
var message =   'This is the weekly status report from the Repka RaspberryPi Tempreature Monitor system.\n' +
                'The last check-in was ' + getLastCheckinTime() + '.\n\n' +
                'Here are the average tempreature statistics for the last few days:\n\n' +
                '    * Yesterday: ' + getTempForLastDays(1) + '\n' +
                '    * Last 2 Days: ' + getTempForLastDays(2) + '\n' +
                '    * Last 3 Days: ' + getTempForLastDays(3) + '\n' +
                '    * Last 4 Days: ' + getTempForLastDays(4) + '\n\n' +
                'You can view the graph at https://repkam09.com/tools/raspi-temp-monitor/ for the latest information.\n' +
                'This message is informational only. There is no action that you need to take. Have a wonderful day!\n\n';

// Create the email message to send out
var weeklyreport = {
    from: 'Temp Monitor <raspitempmon@gmail.com>', // sender address
    to: emaillist, // list of receivers
    subject: 'Weekly Report - pitempmon - ' + currentTime, // Subject line
    text: message
};

console.log("Sending weekly report message to " + emaillist);

printemail(weeklyreport);
sendMailMessage(weeklyreport);