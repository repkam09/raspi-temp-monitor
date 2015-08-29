# raspi-temp-monitor
This project is made up of three different parts described below.

#Raspberry Pi Client
This code uses a DS1820 tempreature sensor to read the tempreature value of the room and reports it to the server part of this code every 2 hours using the cron npm package

#Server Code/REST API
Using the Restify npm package there is a basic REST API with some simple calls that the client can make to report the room tempreature back to the server.

Eventually the server will have some extra features to determine if the Raspberry Pi has not checked in for several hours and will notify a list of pre-configured people by email that something is wrong with the Pi/Internet/Power.

#Server Website Code
This is currently not implemented.
This is the web interface viewer for the collected data. Data collected will have a timestamp and a tempreature. This means the interface should show a graph of the date/temp data as well as some averages per week and maybe min/max temps.

#Other Notes
This code assumes using the DS18B20 sensor connected with w1. You must add "dtoverlay=w1-gpio" to your /boot/config.txt in order to use the device! This took me a while to figure out.
