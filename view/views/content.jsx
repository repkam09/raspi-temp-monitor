var React = require('react');
var log = require('../util/utility');
var LineChart = require("react-chartjs").Line;

var ContentView = React.createClass({

    getInitialState: function() {
        return {chart : null };
    },

	/**
	 * componentDidMount - function is called when a component is
	 * mounted into the DOM.
	 */
    componentDidMount: function() {
        log.verbose('content.jsx - componentDidMount');
        updateChart(this);
    },

	/**
	 * componentWillUnmount - function is called when a component is
	 * about to be unmounted from the DOM.
	 */
    componentWillUnmount: function() {
        log.verbose('content.jsx - componentWillUnmount');
    },

	/**
	 * This function is written in JSX syntax to provide an HTML-like
	 * view of the react component
	 */
    render: function() {
        log.verbose('content.jsx - render() ');

        var chartOptions = {
                scaleOverride: true,
                scaleStartValue: 30,
                scaleSteps: 15,
                scaleStepWidth: 4
            };

        var maybeChart = null;
        if (this.state.chart) {
            maybeChart = ( <LineChart data={this.state.chart} options={chartOptions} width="800" height="450"/> );
        }

        return (
            <div>
                {maybeChart}

                <p>Here is the proejct description from GitHub:</p>

                <p>This project exists to provide a way of monitoring the tempreature of a room with data being collected
                   by a server (in my case a VPS) somewhere else. All of the code here was designed for a Raspberry Pi B
                   and written in nodejs as that's the language I have been doing recently. Nothing here uses the normal
                   Raspberry Pi GPIO. I am taking advantage of the fact that the DS1820 sensor uses the 1-wire interface
                   and can be accessed through the normal Linux filesystem on the Pi.
                </p>
			</div>
    	);
    }
});

function updateChart(that) {
    var labelsArr = [];
    var dataArr = [];

    var url = "templogfile.txt";
    var xmlhttp = new XMLHttpRequest();

    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            var file = xmlhttp.responseText;
            var splitArr = file.split('\n');

            var lines = splitArr.splice((splitArr.length - 15), splitArr.length);

            var count = 0;
            lines.forEach(function(line) {
                var tempParts = line.split('|');
                if (tempParts.length == 2) {
                    if (count === 0) {
                        var datestamp = Number(tempParts[0].trim());
                        var dat = new Date(datestamp).toLocaleString();
                        labelsArr.push(dat);
                    } else {
                        labelsArr.push("");
                    }
                    dataArr.push(tempParts[1].trim());
                }

                count++;

                if (count === 3) {
                    count = 0;
                }
            });

            // Draw the chart on the screen

            var chart = {
                labels: labelsArr,
                datasets: [{
                    label: "Home Temp Monitor",
                    fillColor: "rgba(151,187,205,0.2)",
                    strokeColor: "rgba(151,187,205,1)",
                    pointColor: "rgba(151,187,205,1)",
                    pointStrokeColor: "#fff",
                    pointHighlightFill: "#fff",
                    pointHighlightStroke: "rgba(151,187,205,1)",
                    data: dataArr
                }]
            };

            that.setState({ chart: chart });
        } else {
            // Something went wrong while getting chart data
        }
    }

    xmlhttp.open("GET", url, true);
    xmlhttp.send();
}

module.exports = ContentView;
